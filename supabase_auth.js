// Lightweight Supabase Auth client — direct REST API calls
// Replaces the esm.sh Supabase bundle (which has broken import directives on GitHub Pages)
const SUPABASE_AUTH_BASE = 'https://ukkrwpaxxjmcozbvnjjb.supabase.co/auth/v1';
const SUPABASE_ANON_KEY = 'eyJhbG...dXBh';

function supabaseFetch(path, options = {}) {
    const url = `${SUPABASE_AUTH_BASE}${path}`;
    const headers = new Headers({
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
    });
    const res = fetch(url, { ...options, headers });
    return res.then(async r => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw { message: data.message || `HTTP ${r.status}`, status: r.status };
        return data;
    });
}

export const supabaseAuth = {
    async getUser(accessToken) {
        const headers = { 'apikey': SUPABASE_ANON_KEY };
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
        const res = await fetch(`${SUPABASE_AUTH_BASE}/user`, { headers });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { data: { user: null }, error: data.message || `HTTP ${res.status}` };
        return { data: { user: data }, error: null };
    },
    async signInWithPassword({ email, password }) {
        const data = await supabaseFetch('/token?grant_type=password', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (data.access_token) {
            return { data: { session: data, user: data.user }, error: null };
        }
        return { data: { session: null, user: null }, error: data };
    },
    async signUp({ email, password, options = {} }) {
        const body = { email, password, ...options.data ? { data: options.data } : {} };
        if (options.emailRedirectTo) body.emailRedirectTo = options.emailRedirectTo;
        const result = await supabaseFetch('/signup', {
            method: 'POST',
            body: JSON.stringify(body)
        });
        if (result.user) {
            return { data: { user: result.user, session: result.session || null }, error: null };
        }
        return { data: { user: null, session: null }, error: result };
    },
    async verifyOtp({ email, token, type }) {
        const result = await supabaseFetch('/verify', {
            method: 'POST',
            body: JSON.stringify({ email, token, type })
        });
        if (result.session) {
            return { data: { session: result.session, user: result.user }, error: null };
        }
        return { data: { session: null, user: null }, error: result };
    },
    async signInWithOAuth({ provider, options = {} }) {
        const redirectTo = options.redirectTo || window.location.origin + window.location.pathname;
        const url = `${SUPABASE_AUTH_BASE}/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
        window.location.href = url;
        return Promise.resolve({ error: null });
    },
    async resend({ type, email }) {
        const result = await supabaseFetch('/resend', {
            method: 'POST',
            body: JSON.stringify({ type, email })
        });
        if (!result.error) return { data: { message_id: result.message_id }, error: null };
        return { data: null, error: result };
    }
};

export const SUPABASE_URL = SUPABASE_AUTH_BASE.replace('/auth/v1', '');
export const SUPABASE_ANON_KEY_EXPORT = SUPABASE_ANON_KEY;
