import Header from './Header'
import Footer from './Footer'
import Head from 'next/head'

export default function Layout({ children, title, description }) {
  const siteTitle = title
    ? `${title} | Blog da Editora Ecclesiae`
    : 'Blog da Editora Ecclesiae — Fé, Cultura e Tradição Católica'

  const siteDesc = description ||
    'Artigos sobre fé católica, espiritualidade, teologia, liturgia e cultura cristã. Blog da Editora Ecclesiae.'

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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-cream">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
