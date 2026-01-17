const TOTAL_CATS = 10;
const container = document.getElementById("card-container");
const result = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const likedCatsDiv = document.getElementById("liked-cats");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

let currentIndex = 0;
let likedCats = [];
let firstSwipe = true;

function createCard(index) {
  const card = document.createElement("div");
  card.className = "card";

  const imgUrl = `https://cataas.com/cat?width=400&height=500&${Date.now()+index}`;
  card.style.backgroundImage = `url(${imgUrl})`;

  const like = document.createElement("div");
  like.className = "label like";
  like.textContent = "LIKE";

  const nope = document.createElement("div");
  nope.className = "label nope";
  nope.textContent = "NOPE";

  card.appendChild(like);
  card.appendChild(nope);

  if (index === TOTAL_CATS - 1) {
    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "← Swipe left or right →";
    card.appendChild(hint);
  }

  let startX = 0;
  let currentX = 0;
  let dragging = false;

  function move(x) {
    currentX = x - startX;
    card.style.transform =
      `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;

    like.style.opacity = currentX > 0 ? Math.min(currentX / 100, 1) : 0;
    nope.style.opacity = currentX < 0 ? Math.min(-currentX / 100, 1) : 0;
  }

  function end() {
    dragging = false;
    card.style.transition = "transform 0.35s ease";

    if (currentX > 120) swipe(card, true, imgUrl);
    else if (currentX < -120) swipe(card, false);
    else {
      card.style.transform = "translateX(0)";
      like.style.opacity = 0;
      nope.style.opacity = 0;
    }
  }

  card.addEventListener("mousedown", e => {
    startX = e.clientX;
    dragging = true;
    card.style.transition = "none";
    document.onmousemove = e => dragging && move(e.clientX);
    document.onmouseup = () => {
      document.onmousemove = null;
      end();
    };
  });

  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    dragging = true;
    card.style.transition = "none";
  });

  card.addEventListener("touchmove", e => dragging && move(e.touches[0].clientX));
  card.addEventListener("touchend", end);

  return card;
}

function swipe(card, liked, imgUrl) {
  if (firstSwipe) firstSwipe = false;

  card.style.transform =
    `translateX(${liked ? 600 : -600}px) rotate(${liked ? 20 : -20}deg)`;
  card.style.opacity = 0;

  if (liked) likedCats.push(imgUrl);

  setTimeout(() => {
    card.remove();
    currentIndex++;
    updateProgress();
    if (currentIndex === TOTAL_CATS) showResult();
  }, 300);
}

function updateProgress() {
  progressText.textContent =
    `${Math.min(currentIndex + 1, TOTAL_CATS)} / ${TOTAL_CATS}`;
  progressFill.style.width =
    `${(currentIndex / TOTAL_CATS) * 100}%`;
}

function showResult() {
  container.classList.add("hidden");
  result.classList.remove("hidden");

  likedCatsDiv.innerHTML = "";

  if (likedCats.length === 0) {
    resultTitle.textContent = "😿 No matches this time";
  } else {
    resultTitle.textContent = `You liked ${likedCats.length} cats 💕`;
    likedCats.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      likedCatsDiv.appendChild(img);
    });
  }
}

function restart() {
  currentIndex = 0;
  likedCats = [];
  firstSwipe = true;
  container.innerHTML = "";
  result.classList.add("hidden");
  container.classList.remove("hidden");
  updateProgress();
  loadCards();
}

function loadCards() {
  for (let i = TOTAL_CATS - 1; i >= 0; i--) {
    container.appendChild(createCard(i));
  }
}

updateProgress();
loadCards();
