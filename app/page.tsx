"use client";

import { Fragment, useEffect, useRef, useState } from "react";

type Bubble = {
  id: string;
  role: "user" | "ai";
  text: string;
  ts: number;
  turn: string;
  error?: boolean;
  greeting?: boolean;
};

type Access = "checking" | "locked" | "open" | "unconfigured" | "granted";

const NAME = "凪";
const STORE = "line-consultation:v1";
const CODE_KEY = "line-consultation:code";
const QUICK = ["仕事のことで悩んでる", "新しいことを始めたい", "人間関係がしんどい", "ただ話を聞いてほしい"];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const greeting = (): Bubble[] => {
  const ts = Date.now();
  return ["いらっしゃい。", "コーヒー淹れるから、ゆっくり話して。今日は、どんなことが引っかかってる？"].map((text, i) => ({
    id: `greet-${i}`,
    role: "ai",
    text,
    ts,
    turn: "greet",
    greeting: true,
  }));
};

const hm = (t: number) => new Date(t).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
const dayKey = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};
const dayLabel = (t: number) => {
  const now = Date.now();
  if (dayKey(t) === dayKey(now)) return "今日";
  if (dayKey(t) === dayKey(now - 86_400_000)) return "昨日";
  const d = new Date(t);
  return `${d.getMonth() + 1}/${d.getDate()}（${"日月火水木金土"[d.getDay()]}）`;
};

// LINE はマークダウンを描画しないので、混ざってきた記法を落とす
const clean = (s: string) =>
  s
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "・");

// 空行ごとに別の吹き出しにする
const splitBubbles = (s: string) =>
  clean(s)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

function toApi(bubbles: Bubble[]) {
  const out: { role: "user" | "assistant"; content: string }[] = [];
  for (const b of bubbles) {
    if (b.error || b.greeting) continue;
    const role = b.role === "user" ? "user" : "assistant";
    const last = out[out.length - 1];
    if (last && last.role === role) last.content += (role === "assistant" ? "\n\n" : "\n") + b.text;
    else out.push({ role, content: b.text });
  }
  while (out.length && out[0].role !== "user") out.shift();
  return out;
}

// 合言葉が無い（公開）モードでは何も付けない。日本語でも送れるようエンコードする。
const authHeader = (code: string): Record<string, string> => (code ? { "x-access-code": encodeURIComponent(code) } : {});

function Avatar() {
  return (
    <span className="avatar">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/avatar.svg" alt="" />
    </span>
  );
}

function LockScreen({ onUnlock }: { onUnlock: (code: string) => Promise<void> }) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || pending) return;
    setPending(true);
    setErr("");
    try {
      await onUnlock(value.trim());
    } catch (x) {
      setErr(x instanceof Error ? x.message : "確認に失敗しました");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="lock">
      <form className="card" onSubmit={submit}>
        <Avatar />
        <h1>{NAME}に相談</h1>
        <p>合言葉を入力してトークを開く</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="合言葉"
          aria-label="合言葉"
          autoComplete="off"
          autoFocus
        />
        <button type="submit" disabled={!value.trim() || pending}>
          {pending ? "確認中…" : "入る"}
        </button>
        {err && (
          <p className="error" role="alert">
            {err}
          </p>
        )}
        <p className="fine">凪は架空のキャラクターで、AIが演じています。実在の人物・店舗とは関係ありません。</p>
      </form>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="lock">
      <div className="card">
        <Avatar />
        <h1>サーバーの設定が必要です</h1>
        <p>Vercel の Environment Variables に次を登録して、再デプロイしてください。</p>
        <p className="fine" style={{ textAlign: "left", lineHeight: 1.8, margin: 0 }}>
          ANTHROPIC_API_KEY … APIキー
          <br />
          ACCESS_CODE … 合言葉（おすすめ）
          <br />
          ALLOW_PUBLIC=true … 合言葉なしで誰でも使えるようにする場合（API利用料に注意）
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  const [ready, setReady] = useState(false);
  const [access, setAccess] = useState<Access>("checking");
  const [code, setCode] = useState("");
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [turn, setTurn] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const coarse = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const unlocked = access === "open" || access === "granted";

  useEffect(() => {
    let alive = true;
    let savedCode = "";
    try {
      savedCode = localStorage.getItem(CODE_KEY) ?? "";
      const saved = JSON.parse(localStorage.getItem(STORE) ?? "null");
      setBubbles(Array.isArray(saved) && saved.length ? saved : greeting());
    } catch {
      setBubbles(greeting());
    }
    coarse.current = window.matchMedia("(pointer: coarse)").matches;
    setReady(true);

    (async () => {
      try {
        const { mode } = await fetch("/api/auth", { cache: "no-store" }).then((r) => r.json());
        if (!alive) return;
        if (mode === "open") return setAccess("open");
        if (mode === "unconfigured") return setAccess("unconfigured");
        if (savedCode) {
          const ok = (await fetch("/api/auth", { method: "POST", headers: authHeader(savedCode) })).ok;
          if (!alive) return;
          if (ok) {
            setCode(savedCode);
            return setAccess("granted");
          }
        }
        setAccess("locked");
      } catch {
        if (alive) setAccess("locked");
      }
    })();

    return () => {
      alive = false;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!ready || busy) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(bubbles.slice(-200)));
    } catch {}
  }, [bubbles, busy, ready]);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bubbles, busy, ready, access]);

  async function unlock(c: string) {
    const res = await fetch("/api/auth", { method: "POST", headers: authHeader(c) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error ?? "確認に失敗しました");
    try {
      localStorage.setItem(CODE_KEY, c);
    } catch {}
    setCode(c);
    setAccess("granted");
  }

  function lockOut() {
    abortRef.current?.abort();
    try {
      localStorage.removeItem(CODE_KEY);
    } catch {}
    setMenu(false);
    setCode("");
    setAccess("locked");
  }

  function clearChat() {
    setMenu(false);
    if (!window.confirm("トーク履歴をすべて削除しますか？")) return;
    abortRef.current?.abort();
    setBusy(false);
    setTurn(null);
    setBubbles(greeting());
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy || !unlocked) return;

    const userBubble: Bubble = { id: uid(), role: "user", text, ts: Date.now(), turn: uid() };
    const history = toApi([...bubbles, userBubble]);
    const turnId = uid();
    const startedAt = Date.now();

    setBubbles((p) => [...p, userBubble]);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    setBusy(true);
    setTurn(turnId);

    const put = (t: string) =>
      setBubbles((p) => [
        ...p.filter((b) => b.turn !== turnId),
        ...splitBubbles(t).map((s, i) => ({ id: `${turnId}-${i}`, role: "ai" as const, text: s, ts: startedAt, turn: turnId })),
      ]);
    const fail = (message: string) =>
      setBubbles((p) => [...p, { id: uid(), role: "ai", text: message, ts: Date.now(), turn: turnId, error: true }]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let acc = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json", ...authHeader(code) },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        if (res.status === 401) lockOut();
        throw new Error(j.error ?? "送信に失敗しました");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        put(acc);
      }
      acc += dec.decode();
      put(acc);
      if (!acc.trim()) fail("うまく返せなかった。もう一回送ってみて。");
    } catch (e) {
      if (ctrl.signal.aborted) return;
      if (acc.trim()) put(acc);
      fail(acc.trim() ? "途中で切れちゃったみたい。もう一回送ってみて。" : e instanceof Error ? e.message : "送信に失敗しました");
    } finally {
      if (abortRef.current === ctrl) {
        setBusy(false);
        setTurn(null);
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // IME 変換中の Enter は送信しない。スマホは Enter で改行。
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229 && !coarse.current) {
      e.preventDefault();
      void send(input);
    }
  };

  const lastUser = bubbles.map((b) => b.role).lastIndexOf("user");
  const waiting = busy && turn !== null && !bubbles.some((b) => b.turn === turn);
  const showQuick = !busy && !bubbles.some((b) => b.role === "user");

  if (!ready) return <main className="phone" />;

  return (
    <main className="phone">
      <header className="bar">
        <Avatar />
        <div className="who">
          <b>{NAME}</b>
          <span>架空のキャラクター・AIが演じています</span>
        </div>
        {unlocked && (
          <button className="iconbtn" aria-label="メニュー" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        )}
      </header>

      {menu && (
        <>
          <div className="scrim" onClick={() => setMenu(false)} />
          <div className="menu" role="menu">
            <button role="menuitem" onClick={clearChat}>
              トーク履歴を削除
            </button>
            {access === "granted" && (
              <button role="menuitem" onClick={lockOut}>
                合言葉をリセットして閉じる
              </button>
            )}
          </div>
        </>
      )}

      {access === "checking" && <div className="chat" />}
      {access === "unconfigured" && <SetupNotice />}
      {access === "locked" && <LockScreen onUnlock={unlock} />}

      {unlocked && (
        <>
          <div className="chat" ref={chatRef} role="log" aria-live="polite" aria-label="トーク">
            <div className="pill">凪は架空のキャラクターで、AIが演じています。実在の人物・店舗とは関係ありません。</div>
            {bubbles.map((b, i) => {
              const prev = bubbles[i - 1];
              const showDate = !prev || dayKey(prev.ts) !== dayKey(b.ts);
              const first = showDate || prev.role !== b.role;
              const read = b.role === "user" && (bubbles.slice(i + 1).some((x) => x.role === "ai") || (busy && i === lastUser));
              return (
                <Fragment key={b.id}>
                  {showDate && <div className="pill">{dayLabel(b.ts)}</div>}
                  <div className={`row ${b.role}${first ? " first" : ""}`}>
                    {b.role === "ai" && <div className="avatarcol">{first && <Avatar />}</div>}
                    <div className="col">
                      {b.role === "ai" && first && <div className="name">{NAME}</div>}
                      <div className="line">
                        {b.role === "user" && (
                          <div className="meta">
                            {read && <span>既読</span>}
                            <span>{hm(b.ts)}</span>
                          </div>
                        )}
                        <div className={`bubble${b.error ? " err" : ""}`}>{b.text}</div>
                        {b.role === "ai" && (
                          <div className="meta">
                            <span>{hm(b.ts)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}
            {waiting && (
              <div className="row ai first">
                <div className="avatarcol">
                  <Avatar />
                </div>
                <div className="col">
                  <div className="name">{NAME}</div>
                  <div className="line">
                    <div className="bubble" aria-label="入力中">
                      <span className="typing">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="composer">
            {showQuick && (
              <div className="quick">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => send(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <textarea
                ref={taRef}
                rows={1}
                value={input}
                placeholder="メッセージを入力"
                aria-label="メッセージ"
                maxLength={2000}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={onKeyDown}
              />
              <button className="send" type="submit" aria-label="送信" disabled={busy || !input.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12.6 2-12.6 2z" />
                </svg>
              </button>
            </form>
          </div>
        </>
      )}
    </main>
  );
}
