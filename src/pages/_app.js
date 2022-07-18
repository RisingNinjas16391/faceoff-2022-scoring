import { ClientProvider } from "../lib/supabase";

const App = ({ Component, pageProps }) => (
    <ClientProvider>
      <Component {...pageProps} />
    </ClientProvider>
)

export default App