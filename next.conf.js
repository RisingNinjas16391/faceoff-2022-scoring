require('dotenv').config()

module.exports = {
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
}