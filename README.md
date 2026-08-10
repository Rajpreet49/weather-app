# WEATHERLY

WEATHERLY is a minimal, static client-side weather lookup web app. It uses the OpenWeatherMap Current Weather API and is built with plain HTML, CSS, and vanilla JavaScript so it can be hosted on GitHub Pages.

Files
- `index.html` — main UI
- `styles.css` — minimal responsive styling
- `script.js` — client-side logic and API calls

Usage
1. Obtain a free API key from OpenWeatherMap: https://openweathermap.org/api
2. Open `index.html` in your browser (or deploy to GitHub Pages).
3. Enter a City and Country (free text, e.g. "Paris" and "FR"), paste your API key, then click "Get Weather".

Notes
- This is a purely client-side demo. Do not embed secret API keys in public sites for production use — consider a proxy or server-side solution for real projects.
- The UI handles empty inputs, network errors, and invalid locations with friendly messages.

License
This project is provided as-is for demo and learning purposes.