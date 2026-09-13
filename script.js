const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',(event)=>{glow.style.transform=`translate(${event.clientX-160}px,${event.clientY-160}px)`;});
const observer=new IntersectionObserver((entries)=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const stats=document.querySelector('.stats');
let counted=false;
new IntersectionObserver((entries)=>{if(!entries[0].isIntersecting||counted)return;counted=true;document.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count),start=performance.now(),duration=1300;const tick=now=>{const p=Math.min((now-start)/duration,1);el.textContent=Math.floor(target*(1-Math.pow(1-p,3))).toLocaleString();if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);});},{threshold:.4}).observe(stats);
const countries={all:{locale:'en-US',currency:'USD',rate:1,states:[],max:1000},kenya:{locale:'en-KE',currency:'KES',rate:129,states:'Baringo|Bomet|Bungoma|Busia|Elgeyo-Marakwet|Embu|Garissa|Homa Bay|Isiolo|Kajiado|Kakamega|Kericho|Kiambu|Kilifi|Kirinyaga|Kisii|Kisumu|Kitui|Kwale|Laikipia|Lamu|Machakos|Makueni|Mandera|Marsabit|Meru|Migori|Mombasa|Murangs\u0061|Nairobi County|Nakuru|Nandi|Narok|Nyamira|Nyandarua|Nyeri|Samburu|Siaya|Taita-Taveta|Tana River|Tharaka-Nithi|Trans Nzoia|Turkana|Uasin Gishu|Vihiga|Wajir|West Pokot'.split('|').map(name=>[name.toLowerCase().replace(' county',''),name]),max:130000},india:{locale:'en-IN',currency:'INR',rate:83,states:'Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Andaman and Nicobar Islands|Chandigarh|Dadra and Nagar Haveli and Daman and Diu|Delhi|Jammu and Kashmir|Ladakh|Lakshadweep|Puducherry'.split('|').map(name=>[name.toLowerCase(),name]),max:85000},peru:{locale:'es-PE',currency:'PEN',rate:3.75,states:'Amazonas|Áncash|Apurímac|Arequipa|Ayacucho|Cajamarca|Callao|Cusco|Huancavelica|Huánuco|Ica|Junín|La Libertad|Lambayeque|Lima|Loreto|Madre de Dios|Moquegua|Pasco|Piura|Puno|San Martín|Tacna|Tumbes|Ucayali'.split('|').map(name=>[name.toLowerCase(),name]),max:4000}};
const countryNames=`Afghanistan|Albania|Algeria|Andorra|Angola|Antigua and Barbuda|Argentina|Armenia|Australia|Austria|Azerbaijan|Bahamas|Bahrain|Bangladesh|Barbados|Belarus|Belgium|Belize|Benin|Bhutan|Bolivia|Bosnia and Herzegovina|Botswana|Brazil|Brunei|Bulgaria|Burkina Faso|Burundi|Cabo Verde|Cambodia|Cameroon|Canada|Central African Republic|Chad|Chile|China|Colombia|Comoros|Congo|Costa Rica|Croatia|Cuba|Cyprus|Czechia|Denmark|Djibouti|Dominica|Dominican Republic|Ecuador|Egypt|El Salvador|Equatorial Guinea|Eritrea|Estonia|Eswatini|Ethiopia|Fiji|Finland|France|Gabon|Gambia|Georgia|Germany|Ghana|Greece|Grenada|Guatemala|Guinea|Guinea-Bissau|Guyana|Haiti|Honduras|Hungary|Iceland|India|Indonesia|Iran|Iraq|Ireland|Israel|Italy|Jamaica|Japan|Jordan|Kazakhstan|Kenya|Kiribati|Kuwait|Kyrgyzstan|Laos|Latvia|Lebanon|Lesotho|Liberia|Libya|Liechtenstein|Lithuania|Luxembourg|Madagascar|Malawi|Malaysia|Maldives|Mali|Malta|Marshall Islands|Mauritania|Mauritius|Mexico|Micronesia|Moldova|Monaco|Mongolia|Montenegro|Morocco|Mozambique|Myanmar|Namibia|Nauru|Nepal|Netherlands|New Zealand|Nicaragua|Niger|Nigeria|North Korea|North Macedonia|Norway|Oman|Pakistan|Palau|Panama|Papua New Guinea|Paraguay|Peru|Philippines|Poland|Portugal|Qatar|Romania|Russia|Rwanda|Saint Kitts and Nevis|Saint Lucia|Saint Vincent and the Grenadines|Samoa|San Marino|Sao Tome and Principe|Saudi Arabia|Senegal|Serbia|Seychelles|Sierra Leone|Singapore|Slovakia|Slovenia|Solomon Islands|Somalia|South Africa|South Korea|South Sudan|Spain|Sri Lanka|Sudan|Suriname|Sweden|Switzerland|Syria|Tajikistan|Tanzania|Thailand|Timor-Leste|Togo|Tonga|Trinidad and Tobago|Tunisia|Turkey|Turkmenistan|Tuvalu|Uganda|Ukraine|United Arab Emirates|United Kingdom|United States|Uruguay|Uzbekistan|Vanuatu|Vatican City|Venezuela|Vietnam|Yemen|Zambia|Zimbabwe`.split('|');
const countryFilter=document.getElementById('country-filter'),stateFilter=document.getElementById('state-filter'),feeRange=document.getElementById('fee-range'),feeValue=document.getElementById('fee-value'),feeMin=document.getElementById('fee-min'),feeMax=document.getElementById('fee-max'),summary=document.getElementById('filter-summary'),emptyState=document.getElementById('empty-state');
countryFilter.innerHTML='<option value="all">All countries</option>'+countryNames.sort().map(name=>`<option value="${name.toLowerCase()}">${name}</option>`).join('');
const regionCurrencies={AE:['AED',3.6725],AU:['AUD',1.53],BD:['BDT',117],BH:['BHD',.376],BR:['BRL',5.8],CA:['CAD',1.42],CH:['CHF',.9],CN:['CNY',7.2],EG:['EGP',50.5],EU:['EUR',.92],GB:['GBP',.79],HK:['HKD',7.8],ID:['IDR',16300],IN:['INR',83],JP:['JPY',150],KE:['KES',129],KR:['KRW',1340],KW:['KWD',.307],LK:['LKR',300],MY:['MYR',4.45],NG:['NGN',1550],NZ:['NZD',1.66],OM:['OMR',.385],PE:['PEN',3.75],PH:['PHP',58],PK:['PKR',279],QA:['QAR',3.64],SA:['SAR',3.75],SG:['SGD',1.34],TH:['THB',35],TR:['TRY',36],US:['USD',1],VN:['VND',25300],ZA:['ZAR',18.3]};
function getViewerCurrency(){const locale=navigator.language||'en-US',zone=Intl.DateTimeFormat().resolvedOptions().timeZone,zoneRegions={'Asia/Dubai':'AE','Asia/Kolkata':'IN','Africa/Nairobi':'KE','Asia/Tokyo':'JP','Europe/London':'GB','Europe/Paris':'EU','America/New_York':'US','America/Los_Angeles':'US','Australia/Sydney':'AU'};let region=zoneRegions[zone];if(!region)try{region=new Intl.Locale(locale).region}catch{}const[currency,rate]=regionCurrencies[region]||['USD',1];return{locale,currency,rate,region}}
const viewer=getViewerCurrency();
const formatCurrency=amount=>new Intl.NumberFormat(viewer.locale,{style:'currency',currency:viewer.currency,maximumFractionDigits:0}).format(amount);
function setCurrencyLabels(){document.querySelectorAll('[data-usd]').forEach(el=>{const amount=formatCurrency(Number(el.dataset.usd)*viewer.rate);if(el.classList.contains('remaining-amount'))el.innerHTML=`${amount} <small>to go</small>`;else el.textContent=`${amount} ${el.classList.contains('funded-amount')?'funded':'goal'}`})}
function renderStudents(){const country=countryFilter.value,state=stateFilter.value,maxFee=Number(feeRange.value)/viewer.rate;let count=0;document.querySelectorAll('.student-card').forEach(card=>{const visible=(country==='all'||card.dataset.country===country)&&(state==='all'||card.dataset.state===state)&&Number(card.dataset.fee)<=maxFee;card.hidden=!visible;if(visible)count++});feeValue.textContent=formatCurrency(Number(feeRange.value));const locationNote=viewer.region?` · amounts in ${viewer.currency} for your location`:'';summary.textContent=count?`Showing ${count} verified student${count===1?'':'s'} · fees up to ${formatCurrency(Number(feeRange.value))}${locationNote}`:'No matching students found';emptyState.hidden=count!==0}
function stateOptions(states){stateFilter.innerHTML='<option value="all">All states / regions</option>'+states.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');stateFilter.disabled=false}
async function updateStates(){const country=countryFilter.value;if(country==='all'){stateFilter.innerHTML='<option value="all">Select a country first</option>';stateFilter.disabled=true;return}stateFilter.innerHTML='<option value="all">Loading…</option>';stateFilter.disabled=true;try{const r=await fetch('https://countriesnow.space/api/v0.1/countries/states',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({country:countryFilter.options[countryFilter.selectedIndex].text})});const d=await r.json();const s=(d.data?.states||[]).map(x=>[x.name.toLowerCase(),x.name]);stateFilter.innerHTML='<option value="all">All states / regions</option>'+s.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');stateFilter.disabled=false}catch{stateFilter.innerHTML='<option value="all">Unavailable</option>';stateFilter.disabled=true}renderStudents()}
function setFilters(){const maxFee=1000*viewer.rate;feeRange.max=maxFee;feeRange.step=Math.max(1,Math.round(maxFee/40));feeRange.value=maxFee;feeMin.textContent=formatCurrency(0);feeMax.textContent=formatCurrency(maxFee);updateStates()}
countryFilter.addEventListener('change',()=>{setFilters();setCurrencyLabels();renderStudents()});stateFilter.addEventListener('change',renderStudents);feeRange.addEventListener('input',renderStudents);setFilters();setCurrencyLabels();renderStudents();
async function refreshExchangeRate(){if(viewer.currency==='USD')return;try{const r=await fetch(`https://api.frankfurter.app/latest?from=USD&to=${viewer.currency}`);const d=await r.json();if(d.rates?.[viewer.currency]){viewer.rate=d.rates[viewer.currency];setFilters();setCurrencyLabels();renderStudents()}}catch{}}
refreshExchangeRate();
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.filters .active').classList.remove('active');b.classList.add('active');}));

const AB = SUPABASE_URL.replace(/\/+$/, '') + '/auth/v1';
const authHeaders = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' };
async function authFetch(path, method = 'GET', body = null) {
    const h = new Headers(authHeaders);
    if (body) h.set('Content-Type', 'application/json');
    const res = await fetch(AB + path, { method, headers: h, body: body ? JSON.stringify(body) : null });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
}
const supabaseReady = !SUPABASE_URL.startsWith('YOUR_') && !SUPABASE_ANON_KEY.startsWith('YOUR_');
const supabase = {
    auth: {
        async getUser() {
            const res = await fetch(AB + '/user', { headers: authHeaders });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) return { data: { session: null }, error: data.message || 'HTTP ' + res.status };
            return { data: { session: { user: data, access_token: data.access_token } }, error: null };
        },
        async signInWithPassword({ email, password }) {
            return authFetch('/token?grant_type=password', 'POST', { email, password });
        },
        async signUp({ email, password, options }) {
            const body = { email, password };
            if (options && options.data) body.data = options.data;
            if (options && options.emailRedirectTo) body.emailRedirectTo = options.emailRedirectTo;
            return authFetch('/signup', 'POST', body);
        },
        async verifyOtp({ email, token, type }) {
            return authFetch('/verify', 'POST', { email, token, type });
        },
        async signInWithOAuth({ provider, options }) {
            const url = AB.replace('/auth/v1', '') + '/auth/v1/authorize?provider=' + provider + '&redirect_to=' + encodeURIComponent(options && options.redirectTo ? options.redirectTo : window.location.origin + window.location.pathname);
            window.location.href = url;
            return { error: null };
        },
        async resend({ type, email }) {
            return authFetch('/resend', 'POST', { type, email });
        }
    }
};
