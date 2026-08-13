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
// Global Private Aviation Database (Continents -> Countries -> Cities)
const aviationDatabase = [
    {
        continent: "North America",
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

// Function to render the global database into your Catering/Explore views
function renderAviationDirectory() {
    const container = document.getElementById('catering-content-list');
    if (!container) return;

    let html = '';
    aviationDatabase.forEach(cont => {
        html += `<div class="mb-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">`;
        html += `<h3 class="text-2xl font-bold text-amber-400 mb-4">${cont.continent}</h3>`;
        
        cont.countries.forEach(country => {
            html += `<div class="ml-4 mb-4">`;
            html += `<h4 class="text-lg font-semibold text-slate-200 mb-2">${country.name}</h4>`;
            html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
            
            country.cities.forEach(city => {
                html += `<div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl">`;
                html += `<h5 class="font-bold text-amber-300 mb-1">${city.name}</h5>`;
                html += `<p class="text-xs text-slate-400 mb-2">Key FBOs / Airports:</p>`;
                html += `<ul class="text-xs space-y-1 text-slate-300">`;
                city.hubs.forEach(hub => {
                    html += `<li class="flex items-center space-x-1"><span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span><span>${hub}</span></li>`;
                });
                html += `</ul></div>`;
            });
            
            html += `</div></div>`;
        });
        html += `</div>`;
    });

    container.innerHTML = html;
}

// Auto-run directory builder when page loads
window.addEventListener('DOMContentLoaded', () => {
    renderAviationDirectory();
});
