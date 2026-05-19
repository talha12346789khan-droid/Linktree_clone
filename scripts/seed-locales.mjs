import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const en = JSON.parse(
  fs.readFileSync(path.join(root, "messages/en.json"), "utf8")
);

/** Deep merge: override leaves in `base` with `overrides` */
function deepMerge(base, overrides) {
  const out = { ...base };
  for (const key of Object.keys(overrides)) {
    if (
      overrides[key] &&
      typeof overrides[key] === "object" &&
      !Array.isArray(overrides[key]) &&
      base[key] &&
      typeof base[key] === "object"
    ) {
      out[key] = deepMerge(base[key], overrides[key]);
    } else {
      out[key] = overrides[key];
    }
  }
  return out;
}

const packs = {
  ur: {
    common: { loading: "لوڈ ہو رہا ہے...", signIn: "سائن ان", signOut: "سائن آؤٹ", language: "زبان", delete: "حذف کریں", save: "محفوظ کریں" },
    nav: { product: "پروڈکٹ", templates: "ٹیمپلیٹس", marketplace: "مارکیٹ", learn: "سیکھیں", pricing: "قیمتیں", searchProfiles: "پروفائل تلاش", myProfile: "میری پروفائل", analytics: "تجزیات", support: "سپورٹ", signIn: "سائن ان" },
    home: { title1: "آپ کے لیے", title2: "لنک ان بائیو", subtitle: "ایک لنک سے اپنی تمام لنکس شیئر کریں۔", claimCta: "اپنا لنک ٹری بنائیں", handlePlaceholder: "ہینڈل درج کریں" },
    generate: { editTitle: "لنک ٹری میں ترمیم", claimTitle: "لنک ٹری بنائیں", yourLinks: "آپ کی لنکس", addLink: "+ لنک شامل کریں" },
    analytics: { title: "آپ کے تجزیات", profileVisits: "پروفائل وزٹس", linkClicks: "لنک کلکس" },
    footer: { copyright: "© 2026 Linktree-clone۔ جملہ حقوق محفوظ ہیں۔" }
  },
  hi: {
    common: { loading: "लोड हो रहा है...", signIn: "साइन इन", signOut: "साइन आउट", language: "भाषा", delete: "हटाएं" },
    nav: { product: "उत्पाद", templates: "टेम्पलेट", marketplace: "मार्केट", learn: "सीखें", pricing: "मूल्य", searchProfiles: "प्रोफ़ाइल खोजें", myProfile: "मेरी प्रोफ़ाइल", analytics: "एनालिटिक्स", support: "सहायता" },
    home: { title1: "आपके लिए", title2: "लिंक इन बायो", subtitle: "एक लिंक से सब कुछ साझा करें।", claimCta: "अपना लिंकट्री बनाएं", handlePlaceholder: "हैंडल दर्ज करें" },
    analytics: { title: "आपके एनालिटिक्स", profileVisits: "प्रोफ़ाइल विज़िट", linkClicks: "लिंक क्लिक" },
    footer: { copyright: "© 2026 Linktree-clone। सर्वाधिकार सुरक्षित।" }
  },
  ja: {
    common: { loading: "読み込み中...", signIn: "サインイン", signOut: "サインアウト", language: "言語", delete: "削除" },
    nav: { product: "製品", templates: "テンプレート", marketplace: "マーケット", learn: "学ぶ", pricing: "料金", searchProfiles: "プロフィール検索", myProfile: "マイプロフィール", analytics: "分析", support: "サポート" },
    home: { title1: "あなたのための", title2: "リンクインバイオ", subtitle: "ひとつのリンクですべてを共有。", claimCta: "リンクツリーを作成", handlePlaceholder: "ハンドルを入力" },
    analytics: { title: "あなたの分析", profileVisits: "プロフィール閲覧", linkClicks: "リンククリック" },
    footer: { copyright: "© 2026 Linktree-clone. All rights reserved." }
  },
  es: {
    common: { loading: "Cargando...", signIn: "Iniciar sesión", signOut: "Cerrar sesión", language: "Idioma", delete: "Eliminar" },
    nav: { product: "Producto", templates: "Plantillas", marketplace: "Mercado", learn: "Aprender", pricing: "Precios", searchProfiles: "Buscar perfiles", myProfile: "Mi perfil", analytics: "Analíticas", support: "Soporte" },
    home: { title1: "Un enlace en bio", title2: "hecho para ti.", subtitle: "Un enlace para compartir todo lo que creas.", claimCta: "Crea tu linktree", handlePlaceholder: "Ingresa tu usuario" },
    analytics: { title: "Tus analíticas", profileVisits: "Visitas al perfil", linkClicks: "Clics en enlaces" },
    footer: { copyright: "© 2026 Linktree-clone. Todos los derechos reservados." }
  },
  ar: {
    common: { loading: "جاري التحميل...", signIn: "تسجيل الدخول", signOut: "تسجيل الخروج", language: "اللغة", delete: "حذف" },
    nav: { product: "المنتج", templates: "القوالب", marketplace: "السوق", learn: "تعلّم", pricing: "الأسعار", searchProfiles: "بحث الملفات", myProfile: "ملفي", analytics: "التحليلات", support: "الدعم" },
    home: { title1: "رابط في البايو", title2: "صُمم من أجلك.", subtitle: "رابط واحد لمشاركة كل روابطك.", claimCta: "أنشئ صفحتك", handlePlaceholder: "أدخل المعرف" },
    analytics: { title: "تحليلاتك", profileVisits: "زيارات الملف", linkClicks: "نقرات الروابط" },
    footer: { copyright: "© 2026 Linktree-clone. جميع الحقوق محفوظة." }
  },
  fr: {
    common: { loading: "Chargement...", signIn: "Connexion", signOut: "Déconnexion", language: "Langue", delete: "Supprimer" },
    nav: { product: "Produit", templates: "Modèles", marketplace: "Marketplace", learn: "Apprendre", pricing: "Tarifs", searchProfiles: "Rechercher", myProfile: "Mon profil", analytics: "Analytiques", support: "Assistance" },
    home: { title1: "Un lien en bio", title2: "fait pour vous.", claimCta: "Créer votre linktree", handlePlaceholder: "Votre identifiant" },
    analytics: { title: "Vos statistiques", profileVisits: "Visites du profil", linkClicks: "Clics sur les liens" },
    footer: { copyright: "© 2026 Linktree-clone. Tous droits réservés." }
  },
  de: {
    common: { loading: "Laden...", signIn: "Anmelden", signOut: "Abmelden", language: "Sprache", delete: "Löschen" },
    nav: { product: "Produkt", templates: "Vorlagen", marketplace: "Marktplatz", learn: "Lernen", pricing: "Preise", searchProfiles: "Profile suchen", myProfile: "Mein Profil", analytics: "Analysen", support: "Support" },
    home: { title1: "Link in Bio", title2: "für dich gemacht.", claimCta: "Linktree erstellen", handlePlaceholder: "Handle eingeben" },
    analytics: { title: "Deine Analysen", profileVisits: "Profilaufrufe", linkClicks: "Link-Klicks" },
    footer: { copyright: "© 2026 Linktree-clone. Alle Rechte vorbehalten." }
  },
  pt: {
    common: { loading: "Carregando...", signIn: "Entrar", signOut: "Sair", language: "Idioma", delete: "Excluir" },
    nav: { product: "Produto", templates: "Modelos", marketplace: "Mercado", learn: "Aprender", pricing: "Preços", searchProfiles: "Buscar perfis", myProfile: "Meu perfil", analytics: "Análises", support: "Suporte" },
    home: { title1: "Link na bio", title2: "feito para você.", claimCta: "Criar seu linktree", handlePlaceholder: "Digite seu handle" },
    analytics: { title: "Suas análises", profileVisits: "Visitas ao perfil", linkClicks: "Cliques nos links" },
    footer: { copyright: "© 2026 Linktree-clone. Todos os direitos reservados." }
  },
  tr: {
    common: { loading: "Yükleniyor...", signIn: "Giriş yap", signOut: "Çıkış", language: "Dil", delete: "Sil" },
    nav: { product: "Ürün", templates: "Şablonlar", marketplace: "Pazar", learn: "Öğren", pricing: "Fiyatlar", searchProfiles: "Profil ara", myProfile: "Profilim", analytics: "Analitik", support: "Destek" },
    home: { title1: "Bio linkin", title2: "senin için.", claimCta: "Linktree oluştur", handlePlaceholder: "Kullanıcı adı" },
    analytics: { title: "Analitiklerin", profileVisits: "Profil görüntüleme", linkClicks: "Link tıklamaları" },
    footer: { copyright: "© 2026 Linktree-clone. Tüm hakları saklıdır." }
  },
  zh: {
    common: { loading: "加载中...", signIn: "登录", signOut: "退出", language: "语言", delete: "删除" },
    nav: { product: "产品", templates: "模板", marketplace: "市场", learn: "学习", pricing: "定价", searchProfiles: "搜索主页", myProfile: "我的主页", analytics: "分析", support: "支持" },
    home: { title1: "个人简介链接", title2: "为你打造。", subtitle: "一个链接分享你的所有内容。", claimCta: "创建 Linktree", handlePlaceholder: "输入用户名" },
    analytics: { title: "你的分析", profileVisits: "主页访问", linkClicks: "链接点击" },
    footer: { copyright: "© 2026 Linktree-clone. 保留所有权利。" }
  },
};

for (const [locale, overrides] of Object.entries(packs)) {
  const merged = deepMerge(en, overrides);
  fs.writeFileSync(
    path.join(root, `messages/${locale}.json`),
    JSON.stringify(merged, null, 2) + "\n"
  );
}

console.log("Seeded locale message files (merged with en.json)");
