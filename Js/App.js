if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered! Scope:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}
