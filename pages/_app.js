import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import 'tailwindcss/tailwind.css'
import '../styles/font-style.css'
import '../styles/nprogress.css'

import Context, { UserContext } from '../components/shared/Context'
import Navigation from '../components/shared/Navigation'
import NProgress from 'nprogress'

Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());  

function MyApp({ Component, pageProps }) {
  const pathname = useRouter().pathname
  const pathWithoutNav = ['/login', '/daftar', '/cetak-invoice']

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
