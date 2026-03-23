import { SessionProvider } from 'next-auth/react'
import Script from 'next/script'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
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
      <Component {...pageProps} />
    </SessionProvider>
  )
}
