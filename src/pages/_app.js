import { AuthProvider } from "../lib/auth";
import { ClientProvider } from "../lib/supabase";

const App = ({ Component, pageProps }) => (
  <ClientProvider>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  </ClientProvider>
);

export default App;
