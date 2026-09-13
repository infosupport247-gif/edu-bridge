const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',(event)=>{glow.style.transform=`translate(${event.clientX-160}px,${event.clientY-160}px)`;});
const observer=new IntersectionObserver((entries)=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const stats=document.querySelector('.stats');
let counted=false;
new IntersectionObserver((entries)=>{if(!entries[0].isIntersecting||counted)return;counted=true;document.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count),start=performance.now(),duration=1300;const tick=now=>{const p=Math.min((now-start)/duration,1);el.textContent=Math.floor(target*(1-Math.pow(1-p,3))).toLocaleString();if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);});},{threshold:.4}).observe(stats);
const countries={all:{locale:'en-US',currency:'USD',rate:1,states:[],max:1000},kenya:{locale:'en-KE',currency:'KES',rate:129,states:'Baringo|Bomet|Bungoma|Busia|Elgeyo-Marakwet|Embu|Garissa|Homa Bay|Isiolo|Kajiado|Kakamega|Kericho|Kiambu|Kilifi|Kirinyaga|Kisii|Kisumu|Kitui|Kwale|Laikipia|Lamu|Machakos|Makueni|Mandera|Marsabit|Meru|Migori|Mombasa|Murang’a|Nairobi County|Nakuru|Nandi|Narok|Nyamira|Nyandarua|Nyeri|Samburu|Siaya|Taita-Taveta|Tana River|Tharaka-Nithi|Trans Nzoia|Turkana|Uasin Gishu|Vihiga|Wajir|West Pokot'.split('|').map(name=>[name.toLowerCase().replace(' county',''),name]),max:130000},india:{locale:'en-IN',currency:'INR',rate:83,states:'Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Andaman and Nicobar Islands|Chandigarh|Dadra and Nagar Haveli and Daman and Diu|Delhi|Jammu and Kashmir|Ladakh|Lakshadweep|Puducherry'.split('|').map(name=>[name.toLowerCase(),name]),max:85000},peru:{locale:'es-PE',currency:'PEN',rate:3.75,states:'Amazonas|Áncash|Apurímac|Arequipa|Ayacucho|Cajamarca|Callao|Cusco|Huancavelica|Huánuco|Ica|Junín|La Libertad|Lambayeque|Lima|Loreto|Madre de Dios|Moquegua|Pasco|Piura|Puno|San Martín|Tacna|Tumbes|Ucayali'.split('|').map(name=>[name.toLowerCase(),name]),max:4000}};
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
async function updateStates(){const country=countryFilter.value,details=settings();if(country==='all'){stateFilter.innerHTML='<option value="all">Select a country first</option>';stateFilter.disabled=true;return}if(details.states.length){stateOptions(details.states);return}stateFilter.innerHTML='<option value="all">Loading states / regions…</option>';stateFilter.disabled=true;try{const response=await fetch('https://countriesnow.space/api/v0.1/countries/states',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({country:countryFilter.options[countryFilter.selectedIndex].text})});const result=await response.json();const states=(result.data?.states||[]).map(item=>[item.name.toLowerCase(),item.name]);stateOptions(states.length?states:[['all','No regions listed']])}catch{stateFilter.innerHTML='<option value="all">Regions unavailable</option>';stateFilter.disabled=true}renderStudents()}
function setFilters(){const maxFee=1000*viewer.rate;feeRange.max=maxFee;feeRange.step=Math.max(1,Math.round(maxFee/40));feeRange.value=maxFee;feeMin.textContent=formatCurrency(0);feeMax.textContent=formatCurrency(maxFee);updateStates()}
countryFilter.addEventListener('change',()=>{setFilters();setCurrencyLabels();renderStudents()});stateFilter.addEventListener('change',renderStudents);feeRange.addEventListener('input',renderStudents);setFilters();setCurrencyLabels();renderStudents();
async function refreshExchangeRate(){if(viewer.currency==='USD')return;try{const response=await fetch(`https://api.frankfurter.app/latest?from=USD&to=${viewer.currency}`);const data=await response.json();if(data.rates?.[viewer.currency]){viewer.rate=data.rates[viewer.currency];setFilters();setCurrencyLabels();renderStudents()}}catch{}}
refreshExchangeRate();
document.querySelectorAll('.filters button').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.filters .active').classList.remove('active');button.classList.add('active');}));
// Loaded via script tags: supabase-config.js, supabase_auth.js
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';
const supabaseReady=!SUPABASE_URL.startsWith('YOUR_')&&!SUPABASE_ANON_KEY.startsWith('YOUR_');
let supabase=null;
if(supabaseReady){
    supabase=window.supabaseAuthClient||null;
}
const authModal=document.getElementById('auth-modal');
const authMessage=document.createElement('p');authMessage.className='auth-message';
const setAuthMessage=(message,type='')=>{authMessage.textContent=message;authMessage.className=`auth-message ${type}`;authModal.querySelector('.auth-screen:not([hidden])')?.append(authMessage);};
const showAuthScreen=screen=>{authModal.querySelectorAll('.auth-screen').forEach(item=>item.hidden=item.dataset.screen!==screen);authModal.dataset.screen=screen;};
const openAuth=screen=>{showAuthScreen(screen);authModal.classList.add('open');authModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';};
const closeAuth=()=>{authModal.classList.remove('open');authModal.setAttribute('aria-hidden','true');document.body.style.overflow='';};
document.querySelectorAll('.sponsor-btn').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const studentId=btn.dataset.student;
    const card=btn.closest('.student-card');
    const name=card?.querySelector('h3')?.textContent.trim()||studentId;
    const remainingData=btn.closest('.card-bottom')?.querySelector('.remaining-amount')?.dataset?.usd;
    const remaining=remainingData?formatCurrency(Number(remainingData)*viewer.rate)+' to go':btn.closest('.card-bottom')?.querySelector('.remaining-amount')?.textContent.trim()||'—';
    try{
      if(supabaseReady){
        const{data:{session}}=await supabase.auth.getUser();
        if(session){showPayment(studentId,name,remaining);return}
      }
    }catch(e){}
    openAuth('signin');
    const iv=setInterval(()=>{
      if(!document.querySelector('.auth-modal')?.classList.contains('open')){
        clearInterval(iv);
        if(supabaseReady){
          supabase.auth.getUser().then(({session})=>{
            if(session)showPayment(studentId,name,remaining);
          }).catch(()=>{});
        }
      }
    },300);
  });
});
document.addEventListener('click',e=>{
  if(e.target?.classList?.contains('payment-close')||e.target?.classList?.contains('payment-cancel')){
    const o=document.getElementById('payment-overlay');
    if(o)o.classList.remove('open');
  }
});
authModal.querySelector('.modal-close').addEventListener('click',closeAuth);
authModal.addEventListener('click',event=>{if(event.target===authModal)closeAuth();});
document.querySelectorAll('.auth-next').forEach(button=>button.addEventListener('click',()=>showAuthScreen(button.dataset.next)));
document.querySelector('[data-screen="signup"]').addEventListener('submit',async event=>{event.preventDefault();if(!supabaseReady){setAuthMessage('Add your Supabase project credentials to send emails.','error');return}const email=document.getElementById('signup-email').value,password=event.currentTarget.querySelector('input[type="password"]').value,name=event.currentTarget.querySelector('input[type="text"]').value;const{error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:`${location.origin}${location.pathname}`}});if(error){setAuthMessage(error.message,'error');return}document.getElementById('verification-email').textContent=email;showAuthScreen('verify');});
document.querySelector('[data-screen="verify"]').addEventListener('submit',async event=>{event.preventDefault();const token=document.getElementById('verification-code').value,email=document.getElementById('signup-email').value;if(token.length<6){setAuthMessage('Enter the six-digit code from your email.','error');return}if(!supabaseReady)return;const{error}=await supabase.auth.verifyOtp({email,token,type:'signup'});if(error){setAuthMessage(error.message,'error');return}document.getElementById('signin-email').value=email;showAuthScreen('complete');});
document.querySelector('[data-screen="signin"]').addEventListener('submit',async event=>{event.preventDefault();if(!supabaseReady){setAuthMessage('Add your Supabase project credentials to log in.','error');return}const email=document.getElementById('signin-email').value,password=event.currentTarget.querySelector('input[type="password"]').value;const{error}=await supabase.auth.signInWithPassword({email,password});if(error){setAuthMessage(error.message,'error');return}document.querySelector('.login-trigger').innerHTML='My account <span>✓</span>';closeAuth();});
document.querySelectorAll('.social-login').forEach(button=>button.addEventListener('click',async()=>{if(!supabaseReady){setAuthMessage('Add your Supabase project credentials to use social sign-in.','error');return}const{error}=await supabase.auth.signInWithOAuth({provider:button.dataset.provider.toLowerCase(),options:{redirectTo:`${location.origin}${location.pathname}`}});if(error)setAuthMessage(error.message,'error');}));
document.querySelector('.resend-code').addEventListener('click',async event=>{if(!supabaseReady)return;const{error}=await supabase.auth.resend({type:'signup',email:document.getElementById('signup-email').value});event.currentTarget.textContent=error?'Could not resend':'Verification code resent';});
function showPayment(studentId,name,remaining){
  const panel=document.getElementById('payment-panel');
  const content=document.getElementById('payment-content');
  const overlay=document.getElementById('payment-overlay');
  content.innerHTML=`
    <div class="payment-label">Sponsoring</div>
    <div class="payment-name">${name}</div>
    <div class="payment-amount">
      <span class="payment-label">Amount to sponsor</span>
      <span class="payment-amount-value">${remaining}</span>
    </div>
    <div class="payment-actions">
      <a class="button primary" href="https://buy.stripe.com/PLACEHOLDER" target="_blank" rel="noopener">Proceed to Payment <span>→</span></a>
      <button class="button ghost payment-close">Cancel</button>
    </div>
    <p class="payment-note">You will be redirected to a secure payment page to complete your sponsorship.</p>
  `;
  overlay.classList.add('open');
  setTimeout(()=>document.getElementById('payment').scrollIntoView({behavior:'smooth'}),120);
}
