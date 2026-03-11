import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

Salve com **Ctrl+S** e feche. Depois:
```
git add .
git commit -m "corrige SessionProvider"
git push