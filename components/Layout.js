import Header from './Header'
import Footer from './Footer'
import Head from 'next/head'
import Script from 'next/script'

export default function Layout({ children, title, description, categorias = [], settings = {} }) {
  const siteTitle = title
    ? `${title} | Blog da Editora Ecclesiae`
    : 'Blog da Editora Ecclesiae \u2014 F\u00e9, Cultura e Tradi\u00e7\u00e3o Cat\u00f3lica'

  const siteDesc = description ||
    'Artigos sobre f\u00e9 cat\u00f3lica, espiritualidade, teologia, liturgia e cultura crist\u00e3. Blog da Editora Ecclesiae.'

  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-F162WWF7XQ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F162WWF7XQ');
        `}
      </Script>

      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{siteTitle}</title>
        <meta name="description" content={siteDesc} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/logo-ecclesiae.png" />
        <link rel="apple-touch-icon" href="/logo-ecclesiae.png" />
      </Head>

      <div className="min-h-screen flex flex-col bg-cream">
        <Header categorias={categorias} settings={settings} />
        <main className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
      </div>
    </>
  )
}
