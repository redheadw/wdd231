"use strict";

// Owasso, OK 
const LAT = 36.2695;
const LON = -95.8547;

function weatherCodeToText(code) {
  const map = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Showers",
    82: "Violent showers",
    95: "Thunderstorm"
  };
  return map[code] ?? "Conditions unavailable";
}

function formatDay(isoDateString) {
  const d = new Date(`${isoDateString}T12:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

async function loadWeather() {
  const status = document.querySelector("#weatherStatus");
  const box = document.querySelector("#weatherBox");
  const temp = document.querySelector("#temp");
  const condition = document.querySelector("#condition");
  const humidity = document.querySelector("#humidity");

  const forecastWrap = document.querySelector("#forecast");
  const day1 = document.querySelector("#day1");
  const day2 = document.querySelector("#day2");
  const day3 = document.querySelector("#day3");
  const t1 = document.querySelector("#t1");
  const t2 = document.querySelector("#t2");
  const t3 = document.querySelector("#t3");

  if (!status) return;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code` +
      `&daily=temperature_2m_max` +
      `&temperature_unit=fahrenheit&timezone=auto&forecast_days=3`;

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Weather request failed: ${resp.status}`);
    const data = await resp.json();

    // Current
    if (data.current && temp && humidity && condition && box) {
      temp.textContent = `${Math.round(data.current.temperature_2m)}`;
      humidity.textContent = `${data.current.relative_humidity_2m}`;
      condition.textContent = weatherCodeToText(data.current.weather_code);

      status.hidden = true;
      box.hidden = false;
    }

    // 3-day forecast 
    const times = data.daily?.time;
    const maxTemps = data.daily?.temperature_2m_max;

    if (
      forecastWrap &&
      Array.isArray(times) &&
      Array.isArray(maxTemps) &&
      times.length >= 3 &&
      maxTemps.length >= 3 &&
      day1 && day2 && day3 && t1 && t2 && t3
    ) {
      day1.textContent = formatDay(times[0]);
      day2.textContent = formatDay(times[1]);
      day3.textContent = formatDay(times[2]);

      t1.textContent = Math.round(maxTemps[0]);
      t2.textContent = Math.round(maxTemps[1]);
      t3.textContent = Math.round(maxTemps[2]);

      forecastWrap.hidden = false;
    }
  } catch (err) {
    status.textContent = "Weather unavailable. Please try again later.";
  
  }
}

loadWeather();
