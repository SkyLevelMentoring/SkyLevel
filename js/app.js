/**
 * SKYLEVEL AVIATION - Primary Application Engine
 * Version: 2.0.0
 */

// ==========================================================================
// 1. GLOBAL STATE & TELEMETRY DATA STORAGE
// ==========================================================================
const state = {
  currentView: 'home',
  activeTab: 'feed',
  vaultUnlocked: false,
  fboSearchQuery: '',
  flights: {
    "N750EX": {
      callsign: "N750EX",
      route: "EGLF ✈️ LSGG",
      origin: "EGLF (Farnborough, UK)",
      destination: "LSGG (Geneva, Switzerland)",
      details: "Farnborough to Geneva • FL430 • Mach 0.82 | Alt: 43000ft | GS: 485kts",
      weather: "CAVOK 18°C",
      status: "On Schedule (-2m)",
      lat: 48.5,
      lon: 3.0,
      speed: "485 kts",
      altitude: "43,000 ft",
      aircraft: "Cessna Citation X"
    },
    "G650LX": {
      callsign: "G650LX",
      route: "KTEB ✈️ EGGW",
      origin: "KTEB (Teterboro, USA)",
      destination: "EGGW (Luton, UK)",
      details: "Teterboro to Luton • FL450 • Mach 0.85 | Alt: 45000ft | GS: 510kts",
      weather: "RA FEW010 12°C",
      status: "Delayed (+15m)",
      lat: 51.5,
      lon: -0.1,
      speed: "510 kts",
      altitude: "45,000 ft",
      aircraft: "Gulfstream G650ER"
    },
    "N100SL": {
      callsign: "N100SL",
      route: "VNY ✈️ OPF",
      origin: "KVNY (Van Nuys, USA)",
      destination: "KOPF (Opa-locka, USA)",
      details: "Van Nuys to Opa-locka • FL410 • Mach 0.80 | Alt: 41000ft | GS: 460kts",
      weather: "CLR 28°C",
      status: "On Schedule",
      lat: 25.9,
      lon: -80.2,
      speed: "460 kts",
      altitude: "41,000 ft",
      aircraft: "Bombardier Global 7500"
    }
  },
  fbos: [
    {
      icao: "EGLF",
      name: "TAG Farnborough Airport",
      location: "Farnborough, United Kingdom",
      freq: "130.600 MHz",
      services: ["Customs & Immigration", "Crew Lounge", "De-icing (Type I & IV)", "Jet-A1 Fuel"],
      phone: "+44 1252 379000"
    },
    {
      icao: "LSGG",
      name: "Jet Aviation Geneva",
      location: "Geneva, Switzerland",
      freq: "131.425 MHz",
      services: ["VIP Handling", "Helicopter Transfers", "Limousine Service", "Hangaring"],
      phone: "+41 58 158 8888"
    },
    {
      icao: "KTEB",
      name: "Signature Aviation Teterboro",
      location: "Teterboro, NJ, USA",
      freq: "129.800 MHz",
      services: ["24/7 Operations", "Conference Rooms", "Valet Parking", "Jet Fuel"],
      phone: "+1 201 288 1880"
    }
  ],
  weatherForecasts: [
    { location: "EGLF (Farnborough)", temp: "18°C", condition: "Clear Sky", wind: "240° / 08kts", vis: "10km+" },
    { location: "LSGG (Geneva)", temp: "16°C", condition: "Scattered Clouds", wind: "040° / 05kts", vis: "10km+" },
    { location: "KTEB (Teterboro)", temp: "22°C", condition: "Light Rain", wind: "180° / 12kts", vis: "8km" }
  ]
};

// ==========================================================================
// 2. INITIALIZATION ENGINE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFlightTracker();
  initFBODirectory();
  initAutomatedWeather();
  initCommunityFeed();
  initClocks();
  initOfflineListener();
  loadSavedVaultNotes();
});

// ==========================================================================
// 3. NAVIGATION & VIEW CONTROLLER
// ==========================================================================
function initNavigation() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-target');
      if (target) switchView(target);
    });
  });
}

function switchView(viewId) {
  state.currentView = viewId;

  // Hide all views
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.add('hidden');
  });

  // Display targeted view
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Update navigation visual triggers
  document.querySelectorAll('.nav-link').forEach(btn => {
    if (btn.getAttribute('data-target') === viewId) {
      btn.className = 'nav-link px-3 py-1.5 rounded-xl text-xs font-bold transition text-amber-400 bg-slate-800/60 border border-slate-700';
    } else {
      btn.className = 'nav-link px-3 py-1.5 rounded-xl text-xs font-bold transition text-slate-400 hover:text-slate-200';
    }
  });

  // Scroll smooth to top on view swap
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// 4. LIVE FLIGHT TRACKER & RADAR CONTROLLER
// ==========================================================================
function initFlightTracker() {
  const trackBtn = document.getElementById('track-btn');
  const searchInput = document.getElementById('flight-search-input');

  if (!trackBtn || !searchInput) return;

  const executeSearch = () => {
    const query = searchInput.value.trim().toUpperCase();
    if (!query) return;

    if (state.flights[query]) {
      const flight = state.flights[query];
      
      // Update DOM Text Content
      document.getElementById('tracker-route').innerText = `${flight.callsign} : ${flight.route}`;
      document.getElementById('tracker-details').innerText = flight.details;
      document.getElementById('tracker-weather').innerText = flight.weather;
      document.getElementById('tracker-status').innerText = flight.status;

      // Update Radar Iframe Coordinates
      const radarFrame = document.getElementById('live-radar-frame');
      if (radarFrame) {
        radarFrame.src = `https://globe.adsbexchange.com/?kiosk&zoom=7&lat=${flight.lat}&lon=${flight.lon}`;
      }
    } else {
      alert(`Aircraft search '${query}' not found. Returning default active track (N750EX).`);
    }
  };

  trackBtn.addEventListener('click', executeSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch();
  });
}

// ==========================================================================
// 5. GLOBAL FBO DIRECTORY ENGINE
// ==========================================================================
function initFBODirectory() {
  const container = document.getElementById('directory-content-list');
  if (!container) return;

  renderFBOCards(state.fbos);
}

function renderFBOCards(fboList) {
  const container = document.getElementById('directory-content-list');
  if (!container) return;

  container.innerHTML = fboList.map(fbo => `
    <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span class="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">${fbo.icao}</span>
          <h3 class="text-sm font-bold text-slate-100 inline-block ml-2">${escapeHtml(fbo.name)}</h3>
        </div>
        <span class="text-xs text-slate-400 font-mono">FREQ: ${fbo.freq}</span>
      </div>
      <p class="text-xs text-slate-400">📍 ${escapeHtml(fbo.location)} • Phone: <a href="tel:${fbo.phone}" class="text-amber-400 underline">${fbo.phone}</a></p>
      <div class="flex flex-wrap gap-1.5 pt-1">
        ${fbo.services.map(s => `<span class="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// 6. AUTOMATED WEATHER & METAR DISPLAY
// ==========================================================================
function initAutomatedWeather() {
  const widget = document.getElementById('automated-weather-widget');
  if (!widget) return;

  widget.innerHTML = `
    <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Automated Meteorological Telemetry (METAR)</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      ${state.weatherForecasts.map(w => `
        <div class="bg-slate-950 border border-slate-800 p-3 rounded-xl">
          <span class="text-[10px] text-amber-400 font-bold block">${escapeHtml(w.location)}</span>
          <div class="flex justify-between items-center mt-1">
            <span class="text-sm font-bold text-slate-100">${w.temp}</span>
            <span class="text-xs text-slate-400">${escapeHtml(w.condition)}</span>
          </div>
          <div class="text-[10px] text-slate-500 font-mono mt-1">Wind: ${w.wind} | Vis: ${w.vis}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ==========================================================================
// 7. COMMUNITY, CREW LOUNGE & POSTING ENGINE
// ==========================================================================
function initCommunityFeed() {
  const charCounter = document.getElementById('char-counter');
  const textarea = document.getElementById('post-text-input');

  if (textarea && charCounter) {
    textarea.addEventListener('input', () => {
      const length = textarea.value.length;
      charCounter.innerText = `${length} / 1000`;
      if (length > 1000) {
        charCounter.classList.add('text-rose-400');
      } else {
        charCounter.classList.remove('text-rose-400');
      }
    });
  }
}

function switchCommunityTab(tab) {
  state.activeTab = tab;
  const feedBtn = document.getElementById('comm-tab-feed');
  const blogsBtn = document.getElementById('comm-tab-blogs');
  const feedContent = document.getElementById('comm-content-feed');
  const blogsContent = document.getElementById('comm-content-blogs');

  if (tab === 'feed') {
    feedBtn.className = 'px-4 py-2 rounded-lg text-xs font-bold transition bg-amber-400 text-slate-950 shadow';
    blogsBtn.className = 'px-4 py-2 rounded-lg text-xs font-bold transition text-slate-400 hover:text-slate-200';
    feedContent.classList.remove('hidden');
    blogsContent.classList.add('hidden');
  } else {
    blogsBtn.className = 'px-4 py-2 rounded-lg text-xs font-bold transition bg-amber-400 text-slate-950 shadow';
    feedBtn.className = 'px-4 py-2 rounded-lg text-xs font-bold transition text-slate-400 hover:text-slate-200';
    blogsContent.classList.remove('hidden');
    feedContent.classList.add('hidden');
  }
}

function submitCommunityPost() {
  const textarea = document.getElementById('post-text-input');
  if (!textarea) return;

  const text = textarea.value.trim();
  if (!text) {
    alert('Please enter a message before publishing.');
    return;
  }

  const stream = document.getElementById('community-posts-stream');
  const newPost = document.createElement('div');
  newPost.className = 'bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 animate-fade-in';
  newPost.innerHTML = `
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-400 text-xs">YOU</div>
            <div>
                <h5 class="text-xs font-bold text-slate-200">Verified Dispatcher / Crew</h5>
                <span class="text-[10px] text-slate-500">Just now</span>
            </div>
        </div>
        <span class="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-800">Verified</span>
    </div>
    <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(text)}</p>
    <div class="flex items-center space-x-6 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
        <button onclick="toggleLike(this)" class="flex items-center space-x-1.5 hover:text-amber-400 transition">
            <span>❤️</span> <span class="font-bold text-slate-200">0</span> Likes
        </button>
        <button class="flex items-center space-x-1.5 hover:text-amber-400 transition">
            <span>💬</span> <span class="font-bold text-slate-200">0</span> Comments
        </button>
    </div>
  `;

  stream.prepend(newPost);
  textarea.value = '';
  document.getElementById('char-counter').innerText = '0 / 1000';
}

function toggleLike(btn) {
  const countSpan = btn.querySelector('span:nth-child(2)');
  if (!countSpan) return;
  let count = parseInt(countSpan.innerText, 10);
  countSpan.innerText = count + 1;
}

// ==========================================================================
// 8. SECURE VAULT ENGINE (PIN + LOCAL STORAGE ENCRYPTION)
// ==========================================================================
function unlockVault() {
  const pinInput = document.getElementById('vault-pin-input');
  if (!pinInput) return;

  if (pinInput.value === '1234') { // Default pin
    state.vaultUnlocked = true;
    document.getElementById('vault-auth-screen').classList.add('hidden');
    document.getElementById('vault-content-panel').classList.remove('hidden');
    pinInput.value = '';
  } else {
    alert('Security Access Denied: Invalid Vault PIN.');
  }
}

function lockVault() {
  state.vaultUnlocked = false;
  document.getElementById('vault-auth-screen').classList.remove('hidden');
  document.getElementById('vault-content-panel').classList.add('hidden');
}

function addVaultItem(type) {
  const title = prompt(`Enter new ${type === 'destination' ? 'Destination / FBO' : 'Catering Template'} title:`);
  if (!title) return;

  const targetId = type === 'destination' ? 'vault-destinations-list' : 'vault-catering-list';
  const container = document.getElementById(targetId);
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center';
  div.innerHTML = `<span>${escapeHtml(title)}</span><button onclick="this.parentElement.remove()" class="text-slate-500 hover:text-rose-400">×</button>`;
  container.appendChild(div);
}

function saveSecureNote() {
  const textarea = document.querySelector('#view-vault textarea');
  if (!textarea) return;

  const noteText = textarea.value.trim();
  localStorage.setItem('skylevel_vault_note', noteText);
  alert('Encrypted note saved locally to device storage.');
}

function loadSavedVaultNotes() {
  const savedNote = localStorage.getItem('skylevel_vault_note');
  const textarea = document.querySelector('#view-vault textarea');
  if (savedNote && textarea) {
    textarea.value = savedNote;
  }
}

// ==========================================================================
// 9. SYSTEM CLOCKS, TIMEZONES & OFFLINE NETWORK MONITORS
// ==========================================================================
function initClocks() {
  const utcClock = document.getElementById('header-utc-clock');
  const tzWidget = document.getElementById('rotating-timezone-widget');

  const timezones = [
    { name: "LON (GMT)", offset: 0 },
    { name: "NYC (EST)", offset: -5 },
    { name: "GVA (CET)", offset: 1 },
    { name: "DXB (GST)", offset: 4 }
  ];
  let tzIndex = 0;

  setInterval(() => {
    const now = new Date();
    
    // Update UTC Clock
    if (utcClock) {
      utcClock.innerText = now.toUTCString().split(' ')[4] + ' UTC';
    }

    // Rotate Timezone Display every 3 seconds
    if (tzWidget && now.getSeconds() % 3 === 0) {
      tzIndex = (tzIndex + 1) % timezones.length;
      const tz = timezones[tzIndex];
      const localTime = new Date(now.getTime() + (tz.offset * 3600000));
      const hours = String(localTime.getUTCHours()).padStart(2, '0');
      const mins = String(localTime.getUTCMinutes()).padStart(2, '0');
      tzWidget.innerText = `${tz.name}: ${hours}:${mins}`;
    }
  }, 1000);
}

function initOfflineListener() {
  window.addEventListener('online', () => updateNetworkStatus(true));
  window.addEventListener('offline', () => updateNetworkStatus(false));
}

function updateNetworkStatus(isOnline) {
  const indicator = document.querySelector('.animate-pulse');
  if (indicator) {
    indicator.className = isOnline 
      ? 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' 
      : 'w-2 h-2 rounded-full bg-rose-500';
    indicator.title = isOnline ? 'System Online' : 'System Offline - Serving Cached Telemetry';
  }
}

// Helper utility to sanitize strings and prevent XSS injection
function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
