import { Helmet } from "react-helmet-async";

/*
 * lang="fa" RULE — apply this whenever Persian text appears in rendered HTML:
 *
 *   <span lang="fa">مهراب غلامسامانی</span>
 *
 * The Persian name in <meta content> and JSON-LD below cannot carry a lang
 * attribute (they are not HTML elements). The canonical lang="fa" signal is
 * the .visually-hidden span in Hero.tsx, co-located with the H1.
 */

/* ── Site-wide constants ─────────────────────────────────────────────────── */
const SITE_URL  = "https://mehrabdev.com";
const OG_IMAGE  = `${SITE_URL}/og-image.png`;

const TITLE =
  "Mehrab Gholamsamani (Mehrab Samani) | Software Engineer";

const DESCRIPTION =
  "Portfolio of Mehrab Gholamsamani (Mehrab Samani · مهراب غلامسامانی) — " +
  "Full-Stack Developer based in Tampere, Finland. " +
  "React, TypeScript, Node.js, REST APIs.";

/* ── JSON-LD – Person schema ─────────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mehrab Gholamsamani",
  alternateName: ["Mehrab Samani", "مهراب غلامسامانی"],
  url: SITE_URL,
  image: OG_IMAGE,
  jobTitle: "Full-Stack Developer",
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tampere",
    addressCountry: "FI",
  },
  email: "mehrabgholamsamani@gmail.com",
  sameAs: [
    "https://www.linkedin.com/in/mehrab-gholamsamani-853103393/",
    "https://github.com/mehrabgholamsamani",
  ],
  knowsAbout: [
    "React",
    "TypeScript",
    "Node.js",
    "Express",
    "MongoDB",
    "Next.js",
    "REST APIs",
    "Full-Stack Development",
  ],
};

/* ── Component ───────────────────────────────────────────────────────────── */
export function SeoHead() {
  return (
    <Helmet>
      {/* ── Primary ──────────────────────────────────────────────────────── */}
      <title>{TITLE}</title>
      <meta name="description"  content={DESCRIPTION} />
      <meta name="author"       content="Mehrab Gholamsamani" />
      <meta name="robots"       content="index,follow" />
      <link rel="canonical"     href={`${SITE_URL}/`} />

      {/* ── Open Graph ───────────────────────────────────────────────────── */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={`${SITE_URL}/`} />
      <meta property="og:title"       content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image"       content={OG_IMAGE} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content="Mehrab Gholamsamani — Full-Stack Developer" />
      <meta property="og:locale"      content="en_US" />
      <meta property="og:site_name"   content="Mehrab Samani" />

      {/* ── Twitter Card ─────────────────────────────────────────────────── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image"       content={OG_IMAGE} />
      <meta name="twitter:image:alt"   content="Mehrab Gholamsamani — Full-Stack Developer" />

      {/* ── JSON-LD structured data ───────────────────────────────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
