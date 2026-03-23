import Header from './Header'
import Footer from './Footer'
import Head from 'next/head'

export default function Layout({ children, title, description, categorias = [], settings = {} }) {
  const siteTitle = title
    ? `${title} | Blog da Editora Ecclesiae`
    : 'Blog da Editora Ecclesiae \u2014 F\u00e9, Cultura e Tradi\u00e7\u00e3o Cat\u00f3lica'

  const siteDesc = description ||
    'Artigos sobre f\u00e9 cat\u00f3lica, espiritualidade, teologia, liturgia e cultura crist\u00e3. Blog da Editora Ecclesiae.'

  return (
    <>
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
