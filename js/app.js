// Register Service Worker for PWA Offline Capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered! Scope:', reg.scope))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// Single-Page View Switching Engine with Browser History Back-Button Support
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
            btn.classList.add('text-amber-400');
        } else {
            btn.classList.remove('text-amber-400');
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

// Global Aviation Database with Country Flags
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
    const container = document.getElementById('catering-content-list');
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

    if (selectedContinentIndex !== null) {
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

    if (selectedContinentIndex !== null && selectedCountryIndex !== null) {
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

window.addEventListener('DOMContentLoaded', () => {
    renderAviationDirectory();
});
