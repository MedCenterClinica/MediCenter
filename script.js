document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track?.children || []);
  const prevButton = document.querySelector(".carousel-btn.prev");
  const nextButton = document.querySelector(".carousel-btn.next");
  const trackContainer = document.querySelector(".carousel-track-container");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let slideWidth = slides[0].getBoundingClientRect().width + 16;

  function visibleCount() {
    const containerWidth = trackContainer.offsetWidth;
    return Math.max(1, Math.floor(containerWidth / slideWidth));
  }

  function moveToSlide(index) {
    const visible = visibleCount();
    if (index > slides.length - visible) index = 0;
    if (index < 0) index = slides.length - visible;
    currentIndex = index;
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }

  prevButton.addEventListener("click", () => {
    moveToSlide(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    moveToSlide(currentIndex + 1);
  });

  window.addEventListener("resize", () => {
    slideWidth = slides[0].getBoundingClientRect().width + 16;
    moveToSlide(currentIndex);
  });

  // Suporte a toque (mobile)
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    track.style.transition = "none";
    track.style.transform = `translateX(${-slideWidth * currentIndex + diff}px)`;
  });

  track.addEventListener("touchend", (e) => {
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const movedBy = endX - startX;

    track.style.transition = "transform 0.5s ease";

    if (movedBy < -50) {
      moveToSlide(currentIndex + 1);
    } else if (movedBy > 50) {
      moveToSlide(currentIndex - 1);
    } else {
      moveToSlide(currentIndex);
    }
  });

  moveToSlide(currentIndex);
});
