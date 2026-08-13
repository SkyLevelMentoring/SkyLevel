// Register Service Worker for PWA Offline Capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered! Scope:', reg.scope))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// Single-Page View Switching Engine
function switchView(viewId) {
    // Hide all view sections
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.add('hidden');
    });

    // Show the selected target view
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Update active and inactive styling on navigation buttons
    document.querySelectorAll('.nav-link').forEach(btn => {
        if (btn.getAttribute('data-target') === viewId) {
            btn.classList.remove('text-slate-400');
            btn.classList.add('text-amber-400');
        } else {
            btn.classList.remove('text-amber-400');
            btn.classList.add('text-slate-400');
        }
    });
}
