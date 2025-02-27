export function createStars() {
  console.log('✨ Initializing starry background...');

  // Prevent multiple overlays from being created
  if (document.querySelector('.stars-overlay')) {
    console.log('⚠️ Star overlay already exists. Skipping creation.');
    return;
  }

  let starsContainer = document.createElement('div');
  starsContainer.classList.add('stars-overlay');
  document.body.appendChild(starsContainer);
  console.log('🌌 Stars overlay added to the DOM.');

  for (let i = 0; i < 75; i++) {
    let star = document.createElement('div');
    star.classList.add('star');

    // More stars toward the top
    star.style.top = Math.pow(Math.random(), 2) * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';

    // Random twinkle duration (between 2s and 6s)
    const twinkleDuration = Math.random() * 4 + 2;
    star.style.setProperty('--twinkle-duration', `${twinkleDuration}s`);

    starsContainer.appendChild(star);
  }

  console.log(
    '🌠 Created 75 stars with random positions and twinkle durations.'
  );

  // Return container so it can be cleaned up
  return starsContainer;
}
