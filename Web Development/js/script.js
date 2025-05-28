// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      // Don't unobserve to allow re-animation when scrolling back up
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px' // Start animation slightly before element comes into view
});

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});
