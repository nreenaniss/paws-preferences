const TOTAL_CATS = 10;
const container = document.getElementById("card-container");
const result = document.getElementById("result");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

let currentIndex = 0;
let likedCats = [];

// Create a single card
function createCard(index) {
  const card = document.createElement("div");
  card.className = "card";

  // Generate URL and store in card dataset
  const imgUrl = `https://cataas.com/cat?width=400&height=500&${Date.now()+index}`;
  card.style.backgroundImage = `url(${imgUrl})`;
  card.dataset.img = imgUrl;

  // Like / Nope labels
  const likeLabel = document.createElement("div");
  likeLabel.className = "label like";
  likeLabel.textContent = "LIKE";

  const nopeLabel = document.createElement("div");
  nopeLabel.className = "label nope";
  nopeLabel.textContent = "NOPE";

  card.appendChild(likeLabel);
  card.appendChild(nopeLabel);

  // Dragging variables
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  // Start drag
  function start(x) {
    startX = x;
    dragging = true;
    card.style.transition = "none";

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
  }

  // Mouse move
  function onMove(e) {
    if (!dragging) return;
    currentX = e.clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;

    likeLabel.style.opacity = currentX > 0 ? Math.min(currentX / 100, 1) : 0;
    nopeLabel.style.opacity = currentX < 0 ? Math.min(-currentX / 100, 1) : 0;
  }

  // End drag
  function onEnd() {
    dragging = false;

    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    card.style.transition = "transform 0.35s ease";

    if (currentX > 120) swipe(card, true);
    else if (currentX < -120) swipe(card, false);
    else {
      card.style.transform = "translateX(0)";
      likeLabel.style.opacity = 0;
      nopeLabel.style.opacity = 0;
    }
  }

  // Mouse events
  card.addEventListener("mousedown", e => start(e.clientX));

  // Touch events
  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    dragging = true;
    card.style.transition = "none";
  });

  card.addEventListener("touchmove", e => {
    if (!dragging) return;
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;

    likeLabel.style.opacity = currentX > 0 ? Math.min(currentX / 100, 1) : 0;
    nopeLabel.style.opacity = currentX < 0 ? Math.min(-currentX / 100, 1) : 0;
  });

  card.addEventListener("touchend", () => {
    dragging = false;
    card.style.transition = "transform 0.35s ease";

    if (currentX > 120) swipe(card, true);
    else if (currentX < -120) swipe(card, false);
    else {
      card.style.transform = "translateX(0)";
      likeLabel.style.opacity = 0;
      nopeLabel.style.opacity = 0;
    }
  });

  return card;
}

// Handle swipe
function swipe(card, liked) {
  const imgUrl = card.dataset.img; // ✅ ensures correct image
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

// Update progress bar
function updateProgress() {
  progressText.textContent = `${Math.min(currentIndex + 1, TOTAL_CATS)} / ${TOTAL_CATS}`;
  progressFill.style.width = `${(currentIndex / TOTAL_CATS) * 100}%`;
}

// Show results screen
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

// Restart the app
function restart() {
  currentIndex = 0;
  likedCats = [];
  container.innerHTML = "";
  result.classList.add("hidden");
  container.classList.remove("hidden");
  updateProgress();
  loadCards();
}

// Load all cards
function loadCards() {
  for (let i = TOTAL_CATS - 1; i >= 0; i--) {
    container.appendChild(createCard(i));
  }
}

// Initialize
updateProgress();
loadCards();
