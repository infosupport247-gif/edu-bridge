// Lightweight Supabase Auth client — direct REST API
// Sets window.supabaseAuthClient as { auth: {...} }
// Stores access token from signIn so getUser() works

const BASE = 'https://ukkrwpaxxjmcozbvnjjb.supabase.co/auth/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVra3J3cGF4eGptY296YnZuampiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMTA1MjMsImV4cCI6MjEwNDU4NjUyM30.HY5GGg2SBL4WyVGeN9rrgYm_14DzhCvsFlP576ay1Yc';

var _accessToken = null;

function fetchAuth(path, opts = {}) {
    const url = BASE + path;
    const headers = {
        'apikey': KEY,
        'Authorization': 'Bearer ' + (opts._token || KEY),
        'Content-Type': 'application/json',
        ...(opts.headers || {})
    };
    delete opts._token;
    return fetch(url, {
        ...opts,
        headers: headers
    }).then(async r => {
        const data = await r.json().catch(() => ({}));
        if (path.includes('grant_type=password') && data.access_token) {
            _accessToken = data.access_token;
        }
        if (!r.ok) throw { message: data.message || 'HTTP ' + r.status, status: r.status };
        return data;
    });
}

window.supabaseAuthClient = {
    auth: {
        async getUser() {
            if (!_accessToken) {
                const r = await fetch(BASE + '/user', {
                    headers: { apikey: KEY }
                });
                const d = await r.json().catch(() => ({}));
                if (!r.ok) return { data: { user: null, session: null }, error: d.message || 'HTTP ' + r.status };
                return { data: { user: d, session: d }, error: null };
            }
            const h = { apikey: KEY, Authorization: 'Bearer ' + _accessToken };
            const r = await fetch(BASE + '/user', { headers: h });
            const d = await r.json().catch(() => ({}));
            if (!r.ok) return { data: { user: null, session: null }, error: d.message || 'HTTP ' + r.status };
            return { data: { user: d, session: d }, error: null };
        },
        async signInWithPassword({ email, password }) {
            const d = await fetchAuth('/token?grant_type=password', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            if (d.access_token)
                return { data: { session: d, user: d.user || d }, error: null };
            return { data: { session: null, user: null }, error: d };
        },
        async signUp({ email, password, options = {} }) {
            const body = { email, password };
            if (options.data) body.data = options.data;
            if (options.emailRedirectTo) body.emailRedirectTo = options.emailRedirectTo;
            const r = await fetchAuth('/signup', {
                method: 'POST',
                body: JSON.stringify(body)
            });
            if (r.user)
                return { data: { user: r.user, session: r.session || null }, error: null };
            return { data: { user: null, session: null }, error: r };
        },
        async verifyOtp({ email, token, type }) {
            const r = await fetchAuth('/verify', {
                method: 'POST',
                body: JSON.stringify({ email, token, type })
            });
            if (r.session) {
                _accessToken = r.session.access_token;
                return { data: { session: r.session, user: r.user || r }, error: null };
            }
            return { data: { session: null, user: null }, error: r };
        },
        async signInWithOAuth({ provider, options = {} }) {
            const redirectTo = options.redirectTo || location.origin + location.pathname;
            location.href = BASE + '/authorize?provider=' + provider +
                '&redirect_to=' + encodeURIComponent(redirectTo);
            return { error: null };
        },
        async resend({ type, email }) {
            const r = await fetchAuth('/resend', {
                method: 'POST',
                body: JSON.stringify({ type, email })
            });
            if (!r.error) return { data: { message_id: r.message_id }, error: null };
            return { data: null, error: r };
        }
    }
};
