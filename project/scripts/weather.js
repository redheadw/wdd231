"use strict";

// Change these to your city’s coordinates:
const LAT = 39.8017;
const LON = -89.6436;

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

async function loadWeather() {
  const status = document.querySelector("#weatherStatus");
  const box = document.querySelector("#weatherBox");
  const temp = document.querySelector("#temp");
  const condition = document.querySelector("#condition");
  const humidity = document.querySelector("#humidity");

  if (!status || !box || !temp || !condition || !humidity) return;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit`;

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Weather request failed: ${resp.status}`);
    const data = await resp.json();

    const c = data.current;
    temp.textContent = `${Math.round(c.temperature_2m)}`;
    humidity.textContent = `${c.relative_humidity_2m}`;
    condition.textContent = `${weatherCodeToText(c.weather_code)}`;

    status.hidden = true;
    box.hidden = false;
  } catch (err) {
    status.textContent = "Weather unavailable. Please try again later.";
  }
}

loadWeather();
