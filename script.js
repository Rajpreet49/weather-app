const form = document.getElementById('search-form');
const feedback = document.getElementById('feedback');
const resultEl = document.getElementById('result');
const locEl = document.getElementById('location');
const condEl = document.getElementById('condition');
const iconEl = document.getElementById('icon');
const tempEl = document.getElementById('temp');
const humEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');

function showMessage(msg, isError = true){
  feedback.textContent = msg;
  feedback.style.color = isError ? '#b91c1c' : 'var(--muted)';
}

function clearMessage(){ feedback.textContent = '' }

function showResult(){ resultEl.classList.remove('hidden') }
function hideResult(){ resultEl.classList.add('hidden') }

async function fetchWeather(q, apiKey){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${encodeURIComponent(apiKey)}`;
  const resp = await fetch(url);
  if(!resp.ok){
    const body = await resp.json().catch(()=>({}));
    const message = body && body.message ? body.message : 'Unable to fetch weather';
    throw new Error(message);
  }
  return resp.json();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessage();
  hideResult();

  const city = document.getElementById('city').value.trim();
  const country = document.getElementById('country').value.trim();
  const apiKey = document.getElementById('apikey').value.trim();

  if(!city || !country){
    showMessage('Please enter both city and country.');
    return;
  }
  if(!apiKey){
    showMessage('Please enter your OpenWeatherMap API key.');
    return;
  }

  showMessage('Looking up…', false);

  try{
    const q = `${city},${country}`;
    const data = await fetchWeather(q, apiKey);

    const location = `${data.name}${data.sys && data.sys.country ? ', ' + data.sys.country : ''}`;
    const condition = data.weather && data.weather[0] ? (data.weather[0].main + ' — ' + (data.weather[0].description || '')) : '';
    const icon = data.weather && data.weather[0] ? data.weather[0].icon : null;

    locEl.textContent = location;
    condEl.textContent = condition;
    if(icon){
      iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      iconEl.alt = data.weather[0].description || 'weather icon';
      iconEl.classList.remove('hidden');
    } else {
      iconEl.classList.add('hidden');
    }

    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    humEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${(data.wind.speed).toFixed(1)} m/s`;

    clearMessage();
    showResult();
  }catch(err){
    const msg = err?.message || 'An error occurred';
    showMessage(msg);
  }
});

// Allow pressing Enter in API key field to submit
document.getElementById('apikey').addEventListener('keyup', (e)=>{
  if(e.key === 'Enter') form.requestSubmit();
});
