let currentWidget = null;

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
}

// WIDGET CONTROL
function showWidget(id) {
  document
    .querySelectorAll(".widget")
    .forEach((w) => (w.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

// CLOCKS
const zones = [
  { name: "New York", zone: "America/New_York" },
  { name: "Chicago", zone: "America/Chicago" },
  { name: "Denver", zone: "America/Denver" },
  { name: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "London", zone: "Europe/London" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
];

function updateClocks() {
  const container = document.getElementById("clockContainer");
  container.innerHTML = "";

  zones.forEach((z) => {
    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: z.zone,
      hour12: false,
    });

    const div = document.createElement("div");
    div.textContent = `${z.name}: ${time}`;
    container.appendChild(div);
  });
}
setInterval(updateClocks, 1000);

// WEATHER
const API_KEY = "YOUR_API_KEY_HERE";
let currentTempF = null;
let useF = true;

function updateLocal() {
  document.getElementById("localTime").textContent =
    new Date().toLocaleString();
}
setInterval(updateLocal, 1000);

async function getWeather(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
  );

  const data = await res.json();

  currentTempF = data.main.temp;

  updateTemperatureDisplay();

  document.getElementById("wind").textContent =
    `Wind Speed: ${data.wind.speed} mph`;
}

function updateTemperatureDisplay() {
  if (currentTempF === null) return;

  if (useF) {
    document.getElementById("temperature").textContent =
      `Temp: ${currentTempF.toFixed(1)} °F`;
  } else {
    const c = ((currentTempF - 32) * 5) / 9;
    document.getElementById("temperature").textContent =
      `Temp: ${c.toFixed(1)} °C`;
  }
}

function toggleTempUnit() {
  useF = !useF;
  updateTemperatureDisplay();
}

// LOCATION
navigator.geolocation.getCurrentPosition((pos) => {
  getWeather(pos.coords.latitude, pos.coords.longitude);
});

// CALCULATOR
const buttons = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "+",
  "-",
  "*",
  "/",
  ".",
  "=",
  "Clear",
];

const calcContainer = document.querySelector(".calc-buttons");

buttons.forEach((b) => {
  const btn = document.createElement("button");
  btn.textContent = b;

  btn.onclick = () => {
    let display = document.getElementById("calcDisplay");

    if (b === "=") display.value = eval(display.value);
    else if (b === "Clear") display.value = "";
    else display.value += b;
  };

  calcContainer.appendChild(btn);
});

// STOPWATCH
let time = 0;
let interval;

function startStopwatch() {
  clearInterval(interval);
  interval = setInterval(() => {
    time++;
    let h = String(Math.floor(time / 3600)).padStart(2, "0");
    let m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    let s = String(time % 60).padStart(2, "0");
    document.getElementById("stopwatchDisplay").textContent = `${h}:${m}:${s}`;
  }, 1000);
}

function stopStopwatch() {
  clearInterval(interval);
}

function resetStopwatch() {
  clearInterval(interval);
  time = 0;
  document.getElementById("stopwatchDisplay").textContent = "00:00:00";
}

// MEMO PAD
const memo = document.getElementById("memo");

memo.value = localStorage.getItem("memo") || "";

memo.addEventListener("input", () => {
  localStorage.setItem("memo", memo.value);
});
