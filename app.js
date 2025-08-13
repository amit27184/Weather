let features = [
  { name: "Clock", render: clockFeature },
  { name: "Weather", render: weatherFeature },
  { name: "Pomodoro", render: pomodoroFeature },
  { name: "Notes", render: notesFeature }
];

let currentFeature = 0;
const featureArea = document.getElementById("featureArea");

function renderFeature() {
  featureArea.innerHTML = "";
  features[currentFeature].render(featureArea);
}

document.getElementById("toggleFeature").addEventListener("click", () => {
  currentFeature = (currentFeature + 1) % features.length;
  renderFeature();
});

// --- Features ---
function clockFeature(container) {
  const clock = document.createElement("h2");
  container.appendChild(clock);
  function updateClock() {
    clock.textContent = new Date().toLocaleTimeString();
  }
  setInterval(updateClock, 1000);
  updateClock();
}

function weatherFeature(container) {
  const info = document.createElement("h2");
  info.textContent = "Fetching weather...";
  container.appendChild(info);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          const w = data.current_weather;
          info.textContent = `🌤 ${w.temperature}°C | ${w.windspeed} km/h`;
        });
    });
  } else {
    info.textContent = "Location not available.";
  }
}

function pomodoroFeature(container) {
  let time = 25 * 60;
  const display = document.createElement("h2");
  const btn = document.createElement("button");
  btn.textContent = "Start Pomodoro";
  btn.onclick = () => {
    const interval = setInterval(() => {
      time--;
      let m = Math.floor(time / 60);
      let s = time % 60;
      display.textContent = `${m}:${s.toString().padStart(2, "0")}`;
      if (time <= 0) {
        clearInterval(interval);
        alert("Pomodoro Done!");
      }
    }, 1000);
  };
  container.appendChild(display);
  container.appendChild(btn);
  display.textContent = "25:00";
}

function notesFeature(container) {
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Write your notes...";
  textarea.style.width = "100%";
  textarea.style.height = "150px";
  container.appendChild(textarea);
}

renderFeature();
