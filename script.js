const TOTAL_CATS = 10;
const container = document.getElementById("card-container");
const result = document.getElementById("result");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");

let currentIndex = 0;
let likedCats = [];

// Create swipe card (POINTER EVENTS)
function createCard(index) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.backgroundImage =
    `url(https://cataas.com/cat?width=300&height=400&${Date.now() + index})`;

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  card.addEventListener("pointerdown", e => {
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
    card.style.transition = "none"; // disable snap while dragging
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (!isDragging) return;
    currentX = e.clientX;
    const diff = currentX - startX;

    // Move + rotate card
    card.style.transform =
      `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
  });

  card.addEventListener("pointerup", e => {
    if (!isDragging) return;
    isDragging = false;
    card.releasePointerCapture(e.pointerId);
    handleSwipe(currentX - startX);
  });

  card.addEventListener("pointercancel", resetCard);

  function handleSwipe(diff) {
    card.style.transition = "transform 0.3s ease";

    if (diff > 120) {
      // LIKE animation
      card.style.transform = "translateX(500px) rotate(30deg)";
      setTimeout(() => like(card), 300);
    } else if (diff < -120) {
      // DISLIKE animation
      card.style.transform = "translateX(-500px) rotate(-30deg)";
      setTimeout(() => dislike(card), 300);
    } else {
      // Snap back
      resetCard();
    }
  }

  function resetCard() {
    card.style.transition = "transform 0.3s ease";
    card.style.transform = "translateX(0) rotate(0)";
  }

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

// Show result
function showResult() {
  result.classList.remove("hidden");
  likeCount.textContent = likedCats.length;

  likedCats.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    likedCatsDiv.appendChild(img);
  });
}

// Load cards (stack)
for (let i = TOTAL_CATS - 1; i >= 0; i--) {
  container.appendChild(createCard(i));
}

