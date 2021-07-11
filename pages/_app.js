import Head from 'next/head'
import { useRouter } from 'next/router'
import 'tailwindcss/tailwind.css'
import '../styles/font-style.css'

import Context, { UserContext } from '../components/shared/Context'
import Navigation from '../components/shared/Navigation'

function MyApp({ Component, pageProps }) {
  const pathname = useRouter().pathname
  const pathWithoutNav = ['/login', '/daftar']

  return (
    <>
      <Head>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <Context>
        {!pathWithoutNav.includes(pathname) && <Navigation />}
        <Component {...pageProps} />
      </Context>
    </>
  )
}

export default MyApp
