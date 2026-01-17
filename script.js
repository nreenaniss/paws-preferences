const TOTAL_CATS = 10;
const container = document.getElementById("card-container");
const result = document.getElementById("result");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

let currentIndex = 0;
let likedCats = [];

// Create card
function createCard(index) {
  const card = document.createElement("div");
  card.className = "card";
  const imgUrl = `https://cataas.com/cat?width=400&height=500&${Date.now()+index}`;
  card.style.backgroundImage = `url(${imgUrl})`;

  const info = document.createElement("div");
  info.className = "card-info";
  info.textContent = "Cute Cat 🐾";
  card.appendChild(info);

  let startX = 0;
  let currentX = 0;
  let dragging = false;

  const start = x => {
    startX = x;
    dragging = true;
    card.style.transition = "none";
  };

  const move = x => {
    if (!dragging) return;
    currentX = x - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;
  };

  const end = () => {
    dragging = false;
    card.style.transition = "transform 0.35s ease";

    if (currentX > 100) swipe(card, true, imgUrl);
    else if (currentX < -100) swipe(card, false);
    else card.style.transform = "translateX(0)";
  };

  // Touch
  card.addEventListener("touchstart", e => start(e.touches[0].clientX));
  card.addEventListener("touchmove", e => move(e.touches[0].clientX));
  card.addEventListener("touchend", end);

  // Mouse
  card.addEventListener("mousedown", e => start(e.clientX));
  window.addEventListener("mousemove", e => move(e.clientX));
  window.addEventListener("mouseup", end);

  return card;
}

// Swipe logic
function swipe(card, liked, imgUrl) {
  card.style.transform = `translateX(${liked ? 600 : -600}px) rotate(${liked ? 20 : -20}deg)`;
  card.style.opacity = 0;

  if (liked) likedCats.push(imgUrl);

  setTimeout(() => {
    card.remove();
    currentIndex++;
    updateProgress();
    if (currentIndex === TOTAL_CATS) showResult();
  }, 300);
}

// Progress
function updateProgress() {
  progressText.textContent = `${Math.min(currentIndex + 1, TOTAL_CATS)} / ${TOTAL_CATS}`;
  progressFill.style.width = `${(currentIndex / TOTAL_CATS) * 100}%`;
}

// Result
function showResult() {
  container.classList.add("hidden");
  result.classList.remove("hidden");
  likeCount.textContent = likedCats.length;

  likedCatsDiv.innerHTML = "";
  likedCats.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    likedCatsDiv.appendChild(img);
  });
}

// Restart
function restart() {
  currentIndex = 0;
  likedCats = [];
  container.innerHTML = "";
  result.classList.add("hidden");
  container.classList.remove("hidden");
  updateProgress();
  loadCards();
}

// Load cards
function loadCards() {
  for (let i = TOTAL_CATS - 1; i >= 0; i--) {
    container.appendChild(createCard(i));
  }
}

updateProgress();
loadCards();
