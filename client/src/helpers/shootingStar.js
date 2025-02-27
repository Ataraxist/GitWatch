export function startShootingStars() {
  console.log('✨ Initializing shooting star effect...');

  function createShootingStar() {
    console.log('🌠 Creating a new shooting star...');

    let star = document.createElement('div');
    star.classList.add('shooting-star');

    // Random starting position near the top right
    star.style.top = Math.random() * 10 + 'vh';
    star.style.left = Math.random() * 100 + 'vw';

    document.body.appendChild(star);

    // Remove the star after animation completes
    setTimeout(() => {
      console.log('💨 Shooting star faded out.');
      star.remove();
    }, 1100);
  }

  // Check for night mode
  if (document.body.classList.contains('dark-mode')) {
    console.log('🌙 Dark mode detected. Starting shooting stars...');

    let shootingStarInterval = setInterval(() => {
      if (Math.random() < 0.5) {
        createShootingStar();
      }
    }, Math.random() * 4000); // Adjust this for star frequency

    console.log('⏳ Shooting star interval started.');

    // Apparently I need the "ID" for cleanup or my console log complains
    return shootingStarInterval;
  }

  console.log('☀️ Dark mode not active. No shooting stars.');
  return null; // If dark mode isn't active, return null
}
