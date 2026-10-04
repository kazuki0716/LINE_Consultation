import { accessMode, checkAccess } from "@/lib/guard";

export const runtime = "nodejs";

// 画面が最初に呼ぶ：合言葉が要るか、設定不足か、誰でも使えるか。
export async function GET() {
  return Response.json({ mode: accessMode() }, { headers: { "Cache-Control": "no-store" } });
}

// 合言葉の確認だけを行う（ロック画面用）。
export async function POST(req: Request) {
  const r = checkAccess(req);
  if (r === "unconfigured") return Response.json({ error: "サーバーの設定が足りません（ACCESS_CODE）。" }, { status: 503 });
  if (r === "denied") return Response.json({ error: "合言葉が違います" }, { status: 401 });
  return Response.json({ ok: true });
}
