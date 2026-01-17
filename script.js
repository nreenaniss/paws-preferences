const TOTAL_CATS = 10;
const container = document.getElementById("card-container");
const result = document.getElementById("result");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");

let currentIndex = 0;
let likedCats = [];

// Create a swipe card
function createCard(index) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.backgroundImage =
    `url(https://cataas.com/cat?width=300&height=400&${Date.now()+index})`;

  let startX = 0;

  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 80) like(card);
    else if (diff < -80) dislike(card);
  });

  return card;
}

// Like
function like(card) {
  const img = card.style.backgroundImage.slice(5, -2);
  likedCats.push(img);
  removeCard(card);
}

// Dislike
function dislike(card) {
  removeCard(card);
}

// Remove card and check end
function removeCard(card) {
  card.remove();
  currentIndex++;

  if (currentIndex === TOTAL_CATS) {
    showResult();
  }
}

// Show summary
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
