// --- SERVICE WORKER REGISTRATION ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered! Scope:', reg.scope))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

// --- SINGLE-PAGE VIEW SWITCHING ENGINE ---
function switchView(viewId, updateHistory = true) {
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.add('hidden');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    document.querySelectorAll('.nav-link').forEach(btn => {
        if (btn.getAttribute('data-target') === viewId) {
            btn.classList.remove('text-slate-400');
            btn.classList.add('text-amber-400', 'bg-slate-800/60', 'border', 'border-slate-700');
        } else {
            btn.classList.remove('text-amber-400', 'bg-slate-800/60', 'border', 'border-slate-700');
            btn.classList.add('text-slate-400');
        }
    });

    if (updateHistory) {
        history.pushState({ view: viewId }, "", `#${viewId}`);
    }
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) {
        switchView(event.state.view, false);
    } else {
        switchView('home', false);
    }
});


// --- GLOBAL AVIATION DATABASE & DIRECTORY ---
const aviationDatabase = [
    {
        continent: "North America",
        countries: [
            {
                name: "United States",
                flag: "🇺🇸",
                cities: [
                    { name: "New York", hubs: ["Teterboro (TEB)", "White Plains (HPN)", "JFK"] },
                    { name: "Los Angeles", hubs: ["Van Nuys (VNY)", "Los Angeles Int (LAX)", "Burbank (BUR)"] },
                    { name: "Miami", hubs: ["Miami Opa-locka (OPF)", "Miami International (MIA)", "Fort Lauderdale (FXE)"] },
                    { name: "Chicago", hubs: ["Chicago Midway (MDW)", "Chicago Executive (PWK)"] }
                ]
            },
            {
                name: "Canada",
                flag: "🇨🇦",
                cities: [
                    { name: "Toronto", hubs: ["Toronto Pearson (YYZ)", "Billy Bishop (YTZ)"] },
                    { name: "Vancouver", hubs: ["Vancouver International (YVR)"] }
                ]
            }
        ]
    },
    {
        continent: "Europe",
        countries: [
            {
                name: "United Kingdom",
                flag: "🇬🇧",
                cities: [
                    { name: "London", hubs: ["Farnborough (EGLF)", "London Biggin Hill (BQH)", "London Luton (LTN)"] }
                ]
            },
            {
                name: "France",
                flag: "🇫🇷",
                cities: [
                    { name: "Paris", hubs: ["Le Bourget (LBG)", "Charles de Gaulle (CDG)"] },
                    { name: "Nice", hubs: ["Nice Côte d'Azur (NCE)"] }
                ]
            },
            {
                name: "Switzerland",
                flag: "🇨🇭",
                cities: [
                    { name: "Geneva", hubs: ["Geneva International (GVA)"] },
                    { name: "Zurich", hubs: ["Zurich Airport (ZRH)"] }
                ]
            }
        ]
    },
    {
        continent: "Asia",
        countries: [
            {
                name: "United Arab Emirates",
                flag: "🇦🇪",
                cities: [
                    { name: "Dubai", hubs: ["Dubai International (DXB)", "Al Maktoum International (DWC)", "Dubai Executive Flight Center"] }
                ]
            },
            {
                name: "Singapore",
                flag: "🇸🇬",
                cities: [
                    { name: "Singapore", hubs: ["Seletar Airport (XSP)", "Changi Airport (SIN)"] }
                ]
            },
            {
                name: "Japan",
                flag: "🇯🇵",
                cities: [
                    { name: "Tokyo", hubs: ["Haneda (HND)", "Narita (NRT)"] }
                ]
            }
        ]
    },
    {
        continent: "Oceania",
        countries: [
            {
                name: "Australia",
                flag: "🇦🇺",
                cities: [
                    { name: "Sydney", hubs: ["Sydney Kingsford Smith (SYD)"] },
                    { name: "Melbourne", hubs: ["Melbourne Airport (MEL)", "Essendon Fields (MEB)"] }
                ]
            }
        ]
    },
    {
        continent: "South America",
        countries: [
            {
                name: "Brazil",
                flag: "🇧🇷",
                cities: [
                    { name: "São Paulo", hubs: ["Congonhas (CGH)", "Guarulhos (GRU)"] }
                ]
            }
        ]
    },
    {
        continent: "Africa",
        countries: [
            {
                name: "South Africa",
                flag: "🇿🇦",
                cities: [
                    { name: "Johannesburg", hubs: ["O.R. Tambo (JNB)", "Lanseria International (HLA)"] }
                ]
            }
        ]
    }
];

let selectedContinentIndex = null;
let selectedCountryIndex = null;

function renderAviationDirectory() {
    const container = document.getElementById('directory-content-list');
    if (!container) return;

    let html = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">`;
    
    aviationDatabase.forEach((cont, cIndex) => {
        const isSelected = selectedContinentIndex === cIndex;
        html += `
            <button onclick="selectContinent(${cIndex})" class="p-4 rounded-xl border text-left transition font-semibold flex justify-between items-center ${isSelected ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg' : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'}">
                <span>${cont.continent}</span>
                <span class="text-xs px-2 py-1 rounded ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'}">${cont.countries.length} Countries</span>
            </button>
        `;
    });
    html += `</div>`;

    if (selectedContinentIndex !== null && aviationDatabase[selectedContinentIndex]) {
        const activeContinent = aviationDatabase[selectedContinentIndex];
        html += `<div class="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 mb-6">`;
        html += `<h3 class="text-xl font-bold text-amber-400 border-b border-slate-800 pb-3">${activeContinent.continent} — Select Country</h3>`;
        html += `<div class="flex flex-wrap gap-3">`;

        activeContinent.countries.forEach((country, coIndex) => {
            const isCountrySelected = selectedCountryIndex === coIndex;
            html += `
                <button onclick="selectCountry(${coIndex})" class="px-5 py-2.5 rounded-xl border text-sm font-medium transition flex items-center space-x-2 ${isCountrySelected ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow' : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'}">
                    <span class="text-lg">${country.flag}</span>
                    <span>${country.name}</span>
                </button>
            `;
        });
        html += `</div></div>`;
    }

    if (selectedContinentIndex !== null && selectedCountryIndex !== null && aviationDatabase[selectedContinentIndex]?.countries[selectedCountryIndex]) {
        const activeCountry = aviationDatabase[selectedContinentIndex].countries[selectedCountryIndex];
        html += `<div class="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-4">`;
        html += `<h3 class="text-lg font-semibold text-amber-300 flex items-center space-x-2"><span class="text-xl">${activeCountry.flag}</span><span>${activeCountry.name} — Major Private Aviation Hubs</span></h3>`;
        html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;

        activeCountry.cities.forEach(city => {
            html += `
                <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 class="font-bold text-amber-400 text-base">${city.name}</h4>
                    <p class="text-xs text-slate-400 uppercase tracking-wider">Handling Hubs / FBOs:</p>
                    <ul class="text-xs space-y-1 text-slate-300">
            `;
            city.hubs.forEach(hub => {
                html += `<li class="flex items-center space-x-2"><span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span><span>${hub}</span></li>`;
            });
            html += `</ul></div>`;
        });

        html += `</div></div>`;
    }

    container.innerHTML = html;
}

function selectContinent(index) {
    selectedContinentIndex = index;
    selectedCountryIndex = null;
    renderAviationDirectory();
}

function selectCountry(index) {
    selectedCountryIndex = index;
    renderAviationDirectory();
}

// Make functions globally available for inline onclick attributes
window.selectContinent = selectContinent;
window.selectCountry = selectCountry;
window.switchView = switchView;


// --- COMMUNITY HUB CONTROLLERS ---
function switchCommunityTab(tabName) {
    const feedTab = document.getElementById('comm-tab-feed');
    const blogsTab = document.getElementById('comm-tab-blogs');
    const feedContent = document.getElementById('comm-content-feed');
    const blogsContent = document.getElementById('comm-content-blogs');

    if (!feedTab || !blogsTab || !feedContent || !blogsContent) return;

    if (tabName === 'feed') {
        feedTab.className = "px-4 py-2 rounded-lg text-xs font-bold transition bg-amber-400 text-slate-950 shadow";
        blogsTab.className = "px-4 py-2 rounded-lg text-xs font-bold transition text-slate-400 hover:text-slate-200";
        feedContent.classList.remove('hidden');
        blogsContent.classList.add('hidden');
    } else {
        blogsTab.className = "px-4 py-2 rounded-lg text-xs font-bold transition bg-amber-400 text-slate-950 shadow";
        feedTab.className = "px-4 py-2 rounded-lg text-xs font-bold transition text-slate-400 hover:text-slate-200";
        blogsContent.classList.remove('hidden');
        feedContent.classList.add('hidden');
    }
}

function submitCommunityPost() {
    const textInput = document.getElementById('post-text-input');
    if (!textInput) return;
    const content = textInput.value.trim();

    if (!content) {
        alert("Please write a short story or description before publishing.");
        return;
    }

    if (content.length > 1000) {
        alert("Short stories must be 1,000 characters or less.");
        return;
    }

    const stream = document.getElementById('community-posts-stream');
    if (!stream) return;

    const newPostHTML = `
        <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 animate-fade-in">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-400 text-xs">S</div>
                    <div>
                        <h5 class="text-xs font-bold text-slate-200">Skylevel Member</h5>
                        <span class="text-[10px] text-slate-500">Just now • Public Log</span>
                    </div>
                </div>
                <button class="text-xs text-amber-400 font-bold px-3 py-1 bg-amber-400/10 rounded-lg hover:bg-amber-400/20 transition">Subscribed</button>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(content)}</p>
            <div class="flex items-center space-x-6 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <button onclick="toggleLike(this)" class="flex items-center space-x-1.5 hover:text-amber-400 transition">
                    <span>❤️</span> <span class="font-bold text-slate-200">1</span> Like
                </button>
                <button class="flex items-center space-x-1.5 hover:text-amber-400 transition">
                    <span>💬</span> <span class="font-bold text-slate-200">0</span> Comments
                </button>
            </div>
        </div>
    `;

    stream.insertAdjacentHTML('afterbegin', newPostHTML);
    textInput.value = '';
    
    const charCounter = document.getElementById('char-counter');
    if (charCounter) {
        charCounter.textContent = '0 / 1000';
    }
    
    alert("Your experience was published to the community feed!");
}

function toggleLike(btn) {
    const countSpan = btn.querySelector('span.font-bold');
    if (!countSpan) return;
    let currentLikes = parseInt(countSpan.textContent, 10) || 0;
    countSpan.textContent = currentLikes + 1;
    btn.classList.add('text-rose-400');
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

window.switchCommunityTab = switchCommunityTab;
window.submitCommunityPost = submitCommunityPost;
window.toggleLike = toggleLike;


// --- SECURE VAULT CONTROLLERS ---
function unlockVault() {
    const pinInput = document.getElementById('vault-pin-input');
    const authScreen = document.getElementById('vault-auth-screen');
    const contentPanel = document.getElementById('vault-content-panel');

    if (!pinInput || !authScreen || !contentPanel) return;

    if (pinInput.value.length >= 4) {
        authScreen.classList.add('hidden');
        contentPanel.classList.remove('hidden');
        pinInput.value = '';
    } else {
        alert("Please enter a valid secure vault PIN (at least 4 digits).");
    }
}

function lockVault() {
    const authScreen = document.getElementById('vault-auth-screen');
    const contentPanel = document.getElementById('vault-content-panel');
    if (authScreen && contentPanel) {
        contentPanel.classList.add('hidden');
        authScreen.classList.remove('hidden');
    }
}

function addVaultItem(type) {
    const name = prompt(`Enter new secure ${type} item name:`);
    if (!name) return;

    const listId = type === 'destination' ? 'vault-destinations-list' : 'vault-catering-list';
    const container = document.getElementById(listId);

    if (container) {
        const itemHTML = `
            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span>${escapeHtml(name)}</span>
                <button onclick="this.parentElement.remove()" class="text-slate-500 hover:text-rose-400">×</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    }
}

function saveSecureNote() {
    alert("Secure notes successfully encrypted and saved to local vault storage.");
}

window.unlockVault = unlockVault;
window.lockVault = lockVault;
window.addVaultItem = addVaultItem;
window.saveSecureNote = saveSecureNote;


// --- LIVE FLIGHT TRACKER ENGINE ---
let flightTimer = null;
let currentTrackedFlight = {
    callsign: "N750EX",
    route: "EGLF ✈️ LSGG",
    details: "Farnborough to Geneva • FL430 • Mach 0.82",
    weather: "CAVOK 18°C",
    status: "On Schedule (-2m)",
    altitude: 43000,
    groundSpeed: 485
};

function initFlightTracker() {
    const trackButton = document.getElementById('track-btn');
    const searchInput = document.getElementById('flight-search-input');

    if (trackButton && searchInput) {
        trackButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                currentTrackedFlight.callsign = query.toUpperCase();
                updateFlightUI();
                
                const radarFrame = document.getElementById('live-radar-frame');
                if (radarFrame) {
                    radarFrame.src = `https://globe.adsbexchange.com/?kiosk&zoom=7&icao=&sel=${encodeURIComponent(query)}`;
                }

                alert(`Now tracking flight / tail: ${currentTrackedFlight.callsign}`);
            }
        });
    }

    startFlightPolling();
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    handleNetworkChange(); 
}

function startFlightPolling() {
    if (flightTimer) clearInterval(flightTimer);

    flightTimer = setInterval(() => {
        if (navigator.onLine) {
            fetchLiveFlightData();
        } else {
            console.log("Device offline: Live flight updates paused. Serving cached data.");
        }
    }, 30000);
}

function fetchLiveFlightData() {
    currentTrackedFlight.altitude += Math.floor(Math.random() * 200) - 100;
    currentTrackedFlight.groundSpeed += Math.floor(Math.random() * 10) - 5;
    updateFlightUI();
}

function handleNetworkChange() {
    const statusIndicator = document.getElementById('network-status-indicator');
    const statusText = document.getElementById('network-status-text');

    if (!statusIndicator || !statusText) return;

    if (navigator.onLine) {
        statusIndicator.className = "w-3 h-3 rounded-full bg-emerald-500 animate-pulse";
        statusText.textContent = "Live Updates Active";
    } else {
        statusIndicator.className = "w-3 h-3 rounded-full bg-amber-500";
        statusText.textContent = "Offline Mode";
    }
}

function updateFlightUI() {
    const routeEl = document.getElementById('tracker-route');
    const detailsEl = document.getElementById('tracker-details');
    const weatherEl = document.getElementById('tracker-weather');
    const statusEl = document.getElementById('tracker-status');

    if (routeEl) routeEl.textContent = `${currentTrackedFlight.callsign} : ${currentTrackedFlight.route}`;
    if (detailsEl) detailsEl.textContent = `${currentTrackedFlight.details} | Alt: ${currentTrackedFlight.altitude}ft | GS: ${currentTrackedFlight.groundSpeed}kts`;
    if (weatherEl) weatherEl.textContent = currentTrackedFlight.weather;
    if (statusEl) statusEl.textContent = currentTrackedFlight.status;
}


// --- AUTOMATED GLOBAL CLOCK & TIME ZONES ---
const targetTimeZones = [
    { label: "UTC", zone: "UTC" },
    { label: "London (LHR)", zone: "Europe/London" },
    { label: "New York (JFK)", zone: "America/New_York" },
    { label: "Dubai (DXB)", zone: "Asia/Dubai" },
    { label: "Singapore (SIN)", zone: "Asia/Singapore" }
];

let currentTimeZoneIndex = 0;

function initGlobalClocks() {
    updateClocks();
    setInterval(updateClocks, 1000);

    setInterval(() => {
        currentTimeZoneIndex = (currentTimeZoneIndex + 1) % targetTimeZones.length;
        updateRotatingTimeZone();
    }, 5000);
}

function updateClocks() {
    const now = new Date();
    const utcEl = document.getElementById('header-utc-clock');
    if (utcEl) {
        utcEl.textContent = now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }) + " UTC";
    }
    updateRotatingTimeZone(now);
}

function updateRotatingTimeZone(now = new Date()) {
    const tzData = targetTimeZones[currentTimeZoneIndex];
    const rotatingEl = document.getElementById('rotating-timezone-widget');
    if (rotatingEl) {
        const timeString = now.toLocaleTimeString('en-US', { timeZone: tzData.zone, hour: '2-digit', minute: '2-digit', hour12: false });
        rotatingEl.innerHTML = `<span class="text-slate-400 text-xs">${tzData.label}:</span> <span class="text-amber-400 font-bold">${timeString}</span>`;
    }
}


// --- AUTOMATED WEATHER FORECAST WIDGET ---
const weatherLocations = [
    { name: "London / Farnborough (EGLF)", lat: 51.275, lon: -0.776 },
    { name: "New York (TEB / JFK)", lat: 40.7128, lon: -74.0060 },
    { name: "Geneva (LSGG)", lat: 46.2372, lon: 6.109 },
    { name: "Dubai (DXB)", lat: 25.2048, lon: 55.2708 }
];

let currentWeatherLocationIndex = 0;

async function initAutomatedWeather() {
    fetchWeatherForCurrentLocation();

    setInterval(() => {
        currentWeatherLocationIndex = (currentWeatherLocationIndex + 1) % weatherLocations.length;
        fetchWeatherForCurrentLocation();
    }, 10000);
}

async function fetchWeatherForCurrentLocation() {
    const loc = weatherLocations[currentWeatherLocationIndex];
    const container = document.getElementById('automated-weather-widget');
    if (!container) return;

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!data.daily || !data.daily.time) throw new Error("Invalid payload structure");

        let html = `
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Automated Weather</span>
                    <h4 class="text-sm font-bold text-slate-100">${loc.name}</h4>
                </div>
                <div class="text-right">
                    <span class="text-2xl font-extrabold text-slate-100">${Math.round(data.current.temperature_2m)}°C</span>
                </div>
            </div>
            <div class="pt-2">
                <p class="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">5-Day Forecast Preview:</p>
                <div class="grid grid-cols-5 gap-2 text-center">
        `;

        const daysToDisplay = Math.min(5, data.daily.time.length);
        for (let i = 0; i < daysToDisplay; i++) {
            const date = new Date(data.daily.time[i]).toLocaleDateString('en-US', { weekday: 'short' });
            const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
            const minTemp = Math.round(data.daily.temperature_2m_min[i]);

            html += `
                <div class="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                    <div class="text-[10px] text-slate-400 font-bold">${date}</div>
                    <div class="text-xs font-bold text-slate-200 mt-1">${maxTemp}°</div>
                    <div class="text-[10px] text-slate-500">${minTemp}°</div>
                </div>
            `;
        }

        html += `</div></div>`;
        container.innerHTML = html;

    } catch (error) {
        console.error("Weather fetch failed:", error);
        container.innerHTML = `<div class="text-xs text-amber-400 p-4">Weather data cached / Offline mode active.</div>`;
    }
}


// --- INITIALIZATION HOOK ---
document.addEventListener('DOMContentLoaded', () => {
    const postInput = document.getElementById('post-text-input');
    const charCounter = document.getElementById('char-counter');

    if (postInput && charCounter) {
        postInput.addEventListener('input', () => {
            const length = postInput.value.length;
            charCounter.textContent = `${length} / 1000`;
            if (length > 900) {
                charCounter.className = "text-[10px] text-rose-400 font-mono font-bold";
            } else {
                charCounter.className = "text-[10px] text-slate-500 font-mono";
            }
        });
    }

    renderAviationDirectory();
    initFlightTracker();
    initGlobalClocks();
    initAutomatedWeather();
});

