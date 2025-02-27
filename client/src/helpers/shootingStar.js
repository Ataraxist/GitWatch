export function startShootingStars() {
  function createShootingStar() {
    let star = document.createElement('div');
    star.classList.add('shooting-star');

    // Random starting position near the top right
    star.style.top = Math.random() * 10 + 'vh';
    star.style.left = Math.random() * 100 + 'vw';

    document.body.appendChild(star);

    // Remove the star after animation completes
    setTimeout(() => {
      star.remove();
    }, 1500);
  }

  // DarkMode Required!
  if (document.body.classList.contains('dark-mode')) {
    let shootingStarInterval = setInterval(() => {
      if (Math.random() < 0.5) {
        createShootingStar();
      }
    }, Math.random() * 5000 + 1000);

    // Apparently I need the "ID" for cleanup or my console log complains
    return shootingStarInterval;
  }

  return null; // If dark mode isn't active, return null
}
