import '../styles/globals.css'
import MainContainer from '../components/MainContainer'
import { SessionProvider } from "next-auth/react"


function MyApp({ Component, pageProps,session }) {

  
  return (
    <SessionProvider session={session}>
      <MainContainer>
      <Component {...pageProps} />
    </MainContainer>
    </SessionProvider>
  )
}

export default MyApp


