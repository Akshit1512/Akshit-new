const planets = [
  {
    name: "Mercury",
    className: "mercury",
    description: "The smallest planet and the closest planet to the Sun.",
    year: "88 Earth days",
    distance: "57.9 million km",
  },
  {
    name: "Venus",
    className: "venus",
    description: "A hot, cloudy world with a thick atmosphere.",
    year: "225 Earth days",
    distance: "108.2 million km",
  },
  {
    name: "Earth",
    className: "earth",
    description: "Our home planet, and the only world known to support life.",
    year: "365 days",
    distance: "149.6 million km",
  },
  {
    name: "Mars",
    className: "mars",
    description: "The red planet, with the largest volcano in the solar system.",
    year: "687 Earth days",
    distance: "227.9 million km",
  },
  {
    name: "Jupiter",
    className: "jupiter",
    description: "The largest planet, famous for its Great Red Spot.",
    year: "11.9 Earth years",
    distance: "778.6 million km",
  },
  {
    name: "Saturn",
    className: "saturn",
    description: "A gas giant surrounded by a spectacular ring system.",
    year: "29.5 Earth years",
    distance: "1.4 billion km",
  },
  {
    name: "Uranus",
    className: "uranus",
    description: "An ice giant that rotates almost on its side.",
    year: "84 Earth years",
    distance: "2.9 billion km",
  },
  {
    name: "Neptune",
    className: "neptune",
    description: "A distant, windy ice giant and the farthest planet from the Sun.",
    year: "165 Earth years",
    distance: "4.5 billion km",
  },
];

const solarSystem = document.querySelector(".solar-system");
const orbitContainer = document.querySelector("#orbits");
const cardsContainer = document.querySelector("#planet-cards");
const detailPanel = document.querySelector("#planet-detail");
const toggleButton = document.querySelector("#toggle-orbits");
const speedControl = document.querySelector("#speed-control");
const speedOutput = document.querySelector("#speed-output");

function createPlanetElement(planet, isCard = false) {
  const element = document.createElement(isCard ? "article" : "div");
  element.className = isCard ? "card" : `orbit orbit-${planet.className}`;
  element.dataset.planet = planet.className;

  if (isCard) {
    element.setAttribute("role", "button");
    const planetShape = document.createElement("div");
    planetShape.className = `card-planet ${planet.className}`;

    if (planet.className === "saturn") {
      const ring = document.createElement("span");
      ring.className = "small-ring";
      ring.setAttribute("aria-hidden", "true");
      planetShape.append(ring);
    }

    const heading = document.createElement("h3");
    heading.textContent = planet.name;
    const description = document.createElement("p");
    description.textContent = planet.description;
    element.append(planetShape, heading, description);
  } else {
    const body = document.createElement("div");
    body.className = `planet ${planet.className}`;
    body.setAttribute("role", "button");
    body.setAttribute("tabindex", "0");
    body.setAttribute("aria-label", `Show details for ${planet.name}`);
    body.dataset.planet = planet.className;
    body.title = planet.name;

    if (planet.className === "earth") {
      body.textContent = "🌍";
    }
    if (planet.className === "saturn") {
      const ring = document.createElement("span");
      ring.className = "ring";
      ring.setAttribute("aria-hidden", "true");
      body.append(ring);
    }
    element.append(body);
  }

  element.setAttribute("aria-label", planet.name);
  element.tabIndex = isCard ? 0 : -1;
  return element;
}

function renderPlanets() {
  const orbitFragment = document.createDocumentFragment();
  const cardFragment = document.createDocumentFragment();

  planets.forEach((planet) => {
    orbitFragment.append(createPlanetElement(planet));
    cardFragment.append(createPlanetElement(planet, true));
  });

  orbitContainer.replaceChildren(orbitFragment);
  cardsContainer.replaceChildren(cardFragment);
}

function selectPlanet(className) {
  const planet = planets.find((item) => item.className === className);
  if (!planet) return;

  const selectableElements = [
    ...solarSystem.querySelectorAll("[data-planet]"),
    ...cardsContainer.querySelectorAll("[data-planet]"),
  ];

  selectableElements.forEach((element) => {
    const selected = element.dataset.planet === className;
    element.classList.toggle("is-selected", selected);
    if (element.classList.contains("planet") || element.classList.contains("card")) {
      element.setAttribute("aria-pressed", String(selected));
    }
  });

  detailPanel.replaceChildren();
  const heading = document.createElement("h2");
  heading.textContent = planet.name;
  const description = document.createElement("p");
  description.textContent = planet.description;
  const facts = document.createElement("p");
  facts.textContent = `Year: ${planet.year} | Distance from Sun: ${planet.distance}`;
  detailPanel.append(heading, description, facts);
  detailPanel.hidden = false;
}

function setOrbitsPaused(paused) {
  solarSystem.classList.toggle("is-paused", paused);
  toggleButton.textContent = paused ? "Resume orbits" : "Pause orbits";
  toggleButton.setAttribute("aria-pressed", String(paused));
}

renderPlanets();
selectPlanet("earth");

solarSystem.addEventListener("click", (event) => {
  const planet = event.target.closest("[data-planet]");
  if (planet) selectPlanet(planet.dataset.planet);
});

solarSystem.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".planet")) {
    event.preventDefault();
    selectPlanet(event.target.closest("[data-planet]").dataset.planet);
  }
});

cardsContainer.addEventListener("click", (event) => {
  const card = event.target.closest("[data-planet]");
  if (card) {
    selectPlanet(card.dataset.planet);
    solarSystem.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

cardsContainer.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".card")) {
    event.preventDefault();
    selectPlanet(event.target.dataset.planet);
    solarSystem.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

toggleButton.addEventListener("click", () => {
  setOrbitsPaused(!solarSystem.classList.contains("is-paused"));
});

speedControl.addEventListener("input", () => {
  const speed = Number(speedControl.value);
  solarSystem.style.setProperty("--orbit-speed", String(speed));
  speedOutput.value = `${speed}x`;
  speedOutput.textContent = `${speed}x`;
});
