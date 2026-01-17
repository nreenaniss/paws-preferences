const cats = [
  "https://placekitten.com/400/600",
  "https://placekitten.com/401/600",
  "https://placekitten.com/402/600",
  "https://placekitten.com/403/600",
  "https://placekitten.com/404/600",
  "https://placekitten.com/405/600",
  "https://placekitten.com/406/600",
  "https://placekitten.com/407/600",
  "https://placekitten.com/408/600",
  "https://placekitten.com/409/600"
];

const container = document.getElementById("card-container");
const progress = document.getElementById("progress");
const results = document.getElementById("results");
const likedCatsEl = document.getElementById("liked-cats");
const restartBtn = document.getElementById("restart");

let index = 0;
let liked = [];

function updateProgress() {
  progress.textContent = `${index + 1} / ${cats.length}`;
}

function createCard(src) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = src;

  const like = document.createElement("div");
  like.className = "label like";
  like.textContent = "LIKE";

  const nope = document.createElement("div");
  nope.className = "label nope";
  nope.textContent = "NOPE";

  card.append(img, like, nope);
  container.appendChild(card);

  let startX = 0;
  let currentX = 0;

  function start(e) {
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    card.style.transition = "none";
  }

  function move(e) {
    currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX / 10}deg)`;

    like.style.opacity = currentX > 60 ? 1 : 0;
    nope.style.opacity = currentX < -60 ? 1 : 0;
  }

  function end() {
    if (currentX > 120) swipe(true);
    else if (currentX < -120) swipe(false);
    else reset();
  }

  function swipe(isLike) {
    card.style.transition = "0.3s";
    card.style.transform = `translateX(${isLike ? 500 : -500}px) rotate(${isLike ? 20 : -20}deg)`;

    if (isLike) liked.push(src);

    setTimeout(() => {
      container.removeChild(card);
      index++;
      next();
    }, 300);
  }

  function reset() {
    card.style.transition = "0.3s";
    card.style.transform = "translateX(0)";
    like.style.opacity = 0;
    nope.style.opacity = 0;
  }

  card.addEventListener("mousedown", start);
  card.addEventListener("mousemove", e => startX && move(e));
  card.addEventListener("mouseup", end);
  card.addEventListener("mouseleave", () => startX && end());

  card.addEventListener("touchstart", start);
  card.addEventListener("touchmove", move);
  card.addEventListener("touchend", end);
}

function next() {
  if (index >= cats.length) {
    container.style.display = "none";
    progress.style.display = "none";
    results.style.display = "block";

    likedCatsEl.innerHTML = "";
    liked.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      likedCatsEl.appendChild(img);
    });
    return;
  }

  updateProgress();
  createCard(cats[index]);
}

restartBtn.onclick = () => {
  index = 0;
  liked = [];
  container.innerHTML = "";
  container.style.display = "block";
  progress.style.display = "block";
  results.style.display = "none";
  next();
};

next();
