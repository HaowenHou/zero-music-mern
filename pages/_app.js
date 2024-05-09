import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react"
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/store/store';
import Layout from './components/Layout';

export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ReduxProvider>
    </SessionProvider>
  )
}
