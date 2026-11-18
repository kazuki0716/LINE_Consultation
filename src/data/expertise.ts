export type ExpertiseCategory = "official" | "interview" | "media" | "association" | "warranty";

export type ExpertiseRecord = {
  id: string;
  title: string;
  category: ExpertiseCategory;
  publisher: string;
  date: string | null;
  description: string;
  sourceUrl: string;
  verificationStatus: "verified";
  imagePermission: "clinic_authorized" | "not_used";
};

export const expertiseRecords: ExpertiseRecord[] = [
  {
    id: "official-doctor-profile",
    title: "院長紹介",
    category: "official",
    publisher: "うえだ歯科医院",
    date: null,
    description: "上田大介院長の経歴、認定資格、所属学会・研究会を掲載した医院公式プロフィールです。",
    sourceUrl: "https://ueda-dental.net/doctor/",
    verificationStatus: "verified",
    imagePermission: "clinic_authorized",
  },
  {
    id: "doctors-file-interview",
    title: "上田大介院長 独自取材記事",
    category: "interview",
    publisher: "ドクターズ・ファイル",
    date: "2026-07-31",
    description: "診療方針や口腔外科での経験、医院づくりについて第三者メディアが取材したインタビューです。取材日は2024年10月11日です。",
    sourceUrl: "https://doctorsfile.jp/h/199133/df/1/",
    verificationStatus: "verified",
    imagePermission: "not_used",
  },
  {
    id: "doctors-file-clinic",
    title: "うえだ歯科医院 医院情報",
    category: "media",
    publisher: "ドクターズ・ファイル",
    date: null,
    description: "診療科目、診療時間、院長経歴などを掲載する第三者メディアの医院ページです。",
    sourceUrl: "https://doctorsfile.jp/h/199133/",
    verificationStatus: "verified",
    imagePermission: "not_used",
  },
  {
    id: "kagoshima-dental-association",
    title: "うえだ歯科医院 会員医院情報",
    category: "association",
    publisher: "鹿児島市歯科医師会",
    date: null,
    description: "鹿児島市歯科医師会が掲載する、うえだ歯科医院の会員医院情報です。",
    sourceUrl: "https://yoiha-kagoshima.or.jp/shikaiin/s_327/",
    verificationStatus: "verified",
    imagePermission: "not_used",
  },
  {
    id: "guidedent-listing",
    title: "インプラント保証関連 医院掲載",
    category: "warranty",
    publisher: "ガイドデント",
    date: null,
    description: "インプラント保証に関する外部サービスの医院掲載ページです。保証の適用条件は診察時にご確認ください。",
    sourceUrl: "https://www.guidedent.net/partner/ueda-dentla-clinic/",
    verificationStatus: "verified",
    imagePermission: "not_used",
  },
];

export const credentials = [
  { kind: "認定資格", title: "日本口腔外科学会 認定医", note: "口腔外科領域に関する認定資格です。" },
  { kind: "登録", title: "日本糖尿病協会 登録歯科医", note: "医院公式プロフィールに掲載されている登録情報です。" },
] as const;

export const memberships = [
  "日本口腔インプラント学会",
  "JIADS",
  "ITI Study Club 南九州",
] as const;
