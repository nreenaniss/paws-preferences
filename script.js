const TOTAL_CATS = 10;

const container = document.getElementById("card-container");
const result = document.getElementById("result");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");

let currentIndex = 0;
let likedCats = [];

function createCard(index) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.backgroundImage =
    `url(https://cataas.com/cat?width=320&height=440&${Date.now() + index})`;

  const likeLabel = document.createElement("div");
  likeLabel.className = "like";
  likeLabel.textContent = "LIKE";

  const nopeLabel = document.createElement("div");
  nopeLabel.className = "nope";
  nopeLabel.textContent = "NOPE";

  card.appendChild(likeLabel);
  card.appendChild(nopeLabel);

  let startX = 0;
  let currentX = 0;
  let dragging = false;

  card.addEventListener("pointerdown", e => {
    dragging = true;
    startX = e.clientX;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (!dragging) return;

    currentX = e.clientX;
    const diff = currentX - startX;

    card.style.transform =
      `translateX(${diff}px) rotate(${diff * 0.05}deg)`;

    likeLabel.style.opacity = diff > 0 ? Math.min(diff / 100, 1) : 0;
    nopeLabel.style.opacity = diff < 0 ? Math.min(-diff / 100, 1) : 0;
  });

  card.addEventListener("pointerup", () => {
    dragging = false;
    const diff = currentX - startX;

    if (diff > 120) swipeRight(card);
    else if (diff < -120) swipeLeft(card);
    else resetCard(card);
  });

  return card;
}

function swipeRight(card) {
  card.style.transition = "transform 0.4s ease";
  card.style.transform = "translateX(1000px) rotate(30deg)";
  saveLike(card);
}

function swipeLeft(card) {
  card.style.transition = "transform 0.4s ease";
  card.style.transform = "translateX(-1000px) rotate(-30deg)";
  removeCard(card);
}

function resetCard(card) {
  card.style.transition = "transform 0.3s ease";
  card.style.transform = "";
  setTimeout(() => card.style.transition = "", 300);
}

function saveLike(card) {
  const img = card.style.backgroundImage.slice(5, -2);
  likedCats.push(img);
  removeCard(card);
}

function removeCard(card) {
  setTimeout(() => {
    card.remove();
    currentIndex++;

    if (currentIndex === TOTAL_CATS) {
      showResult();
    }
  }, 400);
}

function showResult() {
  result.classList.remove("hidden");
  likeCount.textContent = likedCats.length;

  likedCats.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    likedCatsDiv.appendChild(img);
  });
}

// Load cards (stacked)
for (let i = TOTAL_CATS - 1; i >= 0; i--) {
  container.appendChild(createCard(i));
}
