export function createStars() {
  // Prevent multiple overlays from being created
  if (document.querySelector('.stars-overlay')) return;

  let starsContainer = document.createElement('div');
  starsContainer.classList.add('stars-overlay');
  document.body.appendChild(starsContainer);

  for (let i = 0; i < 75; i++) {
    let star = document.createElement('div');
    star.classList.add('star');

    // More stars toward the top
    star.style.top = Math.pow(Math.random(), 2) * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';

    // Random twinkle duration (between 2s and 6s)
    star.style.setProperty('--twinkle-duration', `${Math.random() * 4 + 2}s`);

    starsContainer.appendChild(star);
  }

  // Return container so it can be cleaned up
  return starsContainer;
}
