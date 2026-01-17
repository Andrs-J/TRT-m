const SHEET_ID = "1_k26vVuaX1vmKN6-cY3-33YAn0jVAsgIM7vLm0YrMyE";
const SHEET_NAME = "Sheet1";
const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

const $ = (id) => document.getElementById(id);

function updateClock() {
  if ($("clock")) {
    $("clock").innerText = new Date().toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
  }
}

function updateDate() {
  if ($("currentDate")) {
    $("currentDate").innerText = new Date().toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
}

async function fetchActivities() {
  const activitiesSection = $("activities");
  const message = $("message");
  const lastUpdated = $("lastUpdated");

  if (activitiesSection) activitiesSection.innerHTML = "";
  if (message) message.textContent = "Henter aktiviteter...";

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (lastUpdated) {
      lastUpdated.textContent = new Date().toLocaleTimeString("da-DK");
    }

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "activity-card";

      const time = document.createElement("div");
      time.className = "time";
      time.textContent = `${item.Tid} - ${item.Slut}`;
      card.appendChild(time);

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = item.Aktivitet;
      card.appendChild(title);

      const status = document.createElement("div");
      status.className = `status ${item.Status || "Afventer"}`;
      status.textContent = item.Status || "Afventer";
      card.appendChild(status);

      activitiesSection.appendChild(card);
    });

    if (message) message.textContent = "";
  } catch (err) {
    console.error(err);
    if (message) message.textContent = "Kunne ikke hente aktiviteter.";
  }
}

// Start loops
updateClock();
updateDate();
setInterval(updateClock, 1000);
fetchActivities();
setInterval(fetchActivities, 60000);
