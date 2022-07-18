import { createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js'

export const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const ClientContext = createContext();

export function ClientProvider({ children }) {
    return (
        <ClientContext.Provider value={client}>
            {children}
        </ClientContext.Provider>
    );
}
export function useClient() {
    return useContext(ClientContext);
}
