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
}

// Global Private Aviation Database (Continents -> Countries -> Cities)
const aviationDatabase = [
    {
        continent: "North America",
        id: "na",
        countries: [
            {
                name: "United States",
                cities: [
                    { name: "New York", hubs: ["Teterboro (TEB)", "White Plains (HPN)", "JFK"] },
                    { name: "Los Angeles", hubs: ["Van Nuys (VNY)", "Los Angeles Int (LAX)", "Burbank (BUR)"] },
                    { name: "Miami", hubs: ["Miami Opa-locka (OPF)", "Miami International (MIA)", "Fort Lauderdale (FXE)"] },
                    { name: "Chicago", hubs: ["Chicago Midway (MDW)", "Chicago Executive (PWK)"] }
                ]
            },
            {
                name: "Canada",
                cities: [
                    { name: "Toronto", hubs: ["Toronto Pearson (YYZ)", "Billy Bishop (YTZ)"] },
                    { name: "Vancouver", hubs: ["Vancouver International (YVR)"] }
                ]
            }
        ]
    },
    {
        continent: "Europe",
        id: "eu",
        countries: [
            {
                name: "United Kingdom",
                cities: [
                    { name: "London", hubs: ["Farnborough (EGLF)", "London Biggin Hill (BQH)", "London Luton (LTN)"] }
                ]
            },
            {
                name: "France",
                cities: [
                    { name: "Paris", hubs: ["Le Bourget (LBG)", "Charles de Gaulle (CDG)"] },
                    { name: "Nice", hubs: ["Nice Côte d'Azur (NCE)"] }
                ]
            },
            {
                name: "Switzerland",
                cities: [
                    { name: "Geneva", hubs: ["Geneva International (GVA)"] },
                    { name: "Zurich", hubs: ["Zurich Airport (ZRH)"] }
                ]
            }
        ]
    },
    {
        continent: "Asia",
        id: "as",
        countries: [
            {
                name: "United Arab Emirates",
                cities: [
                    { name: "Dubai", hubs: ["Dubai International (DXB)", "Al Maktoum International (DWC)", "Dubai Executive Flight Center"] }
                ]
            },
            {
                name: "Singapore",
                cities: [
                    { name: "Singapore", hubs: ["Seletar Airport (XSP)", "Changi Airport (SIN)"] }
                ]
            },
            {
                name: "Japan",
                cities: [
                    { name: "Tokyo", hubs: ["Haneda (HND)", "Narita (NRT)"] }
                ]
            }
        ]
    },
    {
        continent: "Oceania",
        id: "oc",
        countries: [
            {
                name: "Australia",
                cities: [
                    { name: "Sydney", hubs: ["Sydney Kingsford Smith (SYD)"] },
                    { name: "Melbourne", hubs: ["Melbourne Airport (MEL)", "Essendon Fields (MEB)"] }
                ]
            }
        ]
    },
    {
        continent: "South America",
        id: "sa",
        countries: [
            {
                name: "Brazil",
                cities: [
                    { name: "São Paulo", hubs: ["Congonhas (CGH)", "Guarulhos (GRU)"] }
                ]
            }
        ]
    },
    {
        continent: "Africa",
        id: "af",
        countries: [
            {
                name: "South Africa",
                cities: [
                    { name: "Johannesburg", hubs: ["O.R. Tambo (JNB)", "Lanseria International (HLA)"] }
                ]
            }
        ]
    }
];

let selectedContinentIndex = null;
let selectedCountryIndex = null;

// Render uniform interactive directory
function renderAviationDirectory() {
    const container = document.getElementById('catering-content-list');
    if (!container) return;

    let html = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">`;
    
    // Step 1: Render Uniform Continent Buttons
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

    // Step 2: Render Countries for Selected Continent
    if (selectedContinentIndex !== null) {
        const activeContinent = aviationDatabase[selectedContinentIndex];
        html += `<div class="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 mb-6">`;
        html += `<h3 class="text-xl font-bold text-amber-400 border-b border-slate-800 pb-3">${activeContinent.continent} — Select Country</h3>`;
        html += `<div class="flex flex-wrap gap-3">`;

        activeContinent.countries.forEach((country, coIndex) => {
            const isCountrySelected = selectedCountryIndex === coIndex;
            html += `
                <button onclick="selectCountry(${coIndex})" class="px-5 py-2.5 rounded-xl border text-sm font-medium transition ${isCountrySelected ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow' : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'}">
                    ${country.name}
                </button>
            `;
        });
        html += `</div></div>`;
    }

    // Step 3: Render Cities & Hubs for Selected Country
    if (selectedContinentIndex !== null && selectedCountryIndex !== null) {
        const activeCountry = aviationDatabase[selectedContinentIndex].countries[selectedCountryIndex];
        html += `<div class="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl space-y-4">`;
        html += `<h3 class="text-lg font-semibold text-amber-300">${activeCountry.name} — Major Private Aviation Hubs</h3>`;
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
    selectedCountryIndex = null; // Reset country selection when changing continent
    renderAviationDirectory();
}

function selectCountry(index) {
    selectedCountryIndex = index;
    renderAviationDirectory();
}

// Auto-run directory builder when page loads
window.addEventListener('DOMContentLoaded', () => {
    renderAviationDirectory();
});
