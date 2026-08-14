// --- SERVICE WORKER REGISTRATION ---

if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {

        navigator.serviceWorker.register('/sw.js')

            .then(reg => console.log('Service Worker registered! Scope:', reg.scope))

            .catch(err => console.log('Service Worker registration failed:', err));

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

            btn.classList.add('text-amber-400');

            btn.classList.add('bg-slate-800/60', 'border', 'border-slate-700');

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

// --- GLOBAL AVIATION DIRECTORY DATABASE ---
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

                    { name: "Dubai", hubs: ["Dubai International (DXB)", "Al Maktoum International (DWC)"] }
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

                    { name: "Sydney", hubs: ["Sydney Kingsford Smith (SYD)"] }
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


// --- GLOBAL PRIVATE JET CATERING DIRECTORY DATABASE ---
const globalCateringDirectory = [
    // --- UNITED KINGDOM ---
    {
        name: "Bon Soirée Private Jet Catering",
        region: "United Kingdom",
        countryCode: "UK",
        flag: "🇬🇧",
        phone: "+44 1442 874076",
        email: "orders@bonsoiree.co.uk",
        website: "https://bonsoiree.co.uk",
        menuLink: "https://bonsoiree.co.uk/services/",
        favorite: true,
        votes: 342,
        notes: "Serves Luton, Northolt, Farnborough, Stansted, and Oxford. Exceptional bespoke luxury dining."
    },
    {
        name: "Royalblue Executive Services",
        region: "United Kingdom",
        countryCode: "UK",
        flag: "🇬🇧",
        phone: "+44 1784 242700",
        email: "ops@royalbluecatering.co.uk",
        website: "https://www.royalbluecatering.co.uk",
        menuLink: "https://www.royalbluecatering.co.uk",
        favorite: false,
        votes: 215,
        notes: "Hubs at Heathrow & Stansted. Halal and non-halal certified VIP catering menus."
    },
    {
        name: "Piazza Italiana Aero Catering",
        region: "United Kingdom",
        countryCode: "UK",
        flag: "🇬🇧",
        phone: "+44 7386 314582",
        email: "aerocatering@piazzaitaliana.co.uk",
        website: "https://piazzaitaliana.co.uk/private-jet-catering-london/",
        menuLink: "https://piazzaitaliana.co.uk/private-jet-catering-london/",
        favorite: true,
        votes: 489,
        notes: "City of London based. Italian fine dining, Slavic, Asian cuisine, and direct WhatsApp ordering."
    },

    // --- EUROPE ---
    {
        name: "Air Gourmet (France)",
        region: "Europe",
        countryCode: "France",
        flag: "🇫🇷",
        phone: "+33 1 48 68 35 45",
        email: "orders@airgourmet.fr",
        website: "https://airgourmet.fr",
        menuLink: "https://airgourmet.fr",
        favorite: true,
        votes: 310,
        notes: "Primary private jet caterer serving Le Bourget (LBG) and Charles de Gaulle (CDG)."
    },
    {
        name: "Jet Aviation Catering (Switzerland)",
        region: "Europe",
        countryCode: "Switzerland",
        flag: "🇨🇭",
        phone: "+41 58 158 1111",
        email: "zrh.catering@jetaviation.com",
        website: "https://www.jetaviation.com",
        menuLink: "https://www.jetaviation.com",
        favorite: false,
        votes: 198,
        notes: "Top-tier FBO and inflight catering provisioning across Zurich and Geneva."
    },
    {
        name: "E-Aviation First Class Catering (Germany)",
        region: "Europe",
        countryCode: "Germany",
        flag: "🇩🇪",
        phone: "+49 911 376900",
        email: "sales@e-aviation.de",
        website: "https://www.e-aviation.de",
        menuLink: "https://www.e-aviation.de/en/first-class-catering-2/",
        favorite: false,
        votes: 142,
        notes: "Hand-picked European luxury culinary partners catering executive charter flights."
    },

    // --- UNITED STATES ---
    {
        name: "Signature Jet Catering (USA - Florida)",
        region: "United States",
        countryCode: "United States",
        flag: "🇺🇸",
        phone: "+1 754 600 1968",
        email: "order@signaturejetcatering.com",
        website: "https://www.signaturejetcatering.com",
        menuLink: "https://www.signaturejetcatering.com",
        favorite: true,
        votes: 620,
        notes: "Turnkey worldwide executive inflight catering with seamless FBO and ramp handovers."
    },
    {
        name: "VIP Jet Catering (USA - Ohio)",
        region: "United States",
        countryCode: "United States",
        flag: "🇺🇸",
        phone: "+1 435 266-9581",
        email: "contact@vip-jet-catering.com",
        website: "https://www.vip-jet-catering.com",
        menuLink: "https://www.vip-jet-catering.com",
        favorite: false,
        votes: 275,
        notes: "Custom menus and 24/7 global coordination supporting US municipal and international airports."
    },

// --- COMMUNITY HUB CONTROLLERS ---
    // --- AFRICA ---
    {
        name: "ExecuJet Africa Inflight Catering (South Africa)",
        region: "Africa",
        countryCode: "South Africa",
        flag: "🇿🇦",
        phone: "+27 11 516 2300",
        email: "enquiries@execujet.co.za",
        website: "https://www.execujet.com",
        menuLink: "https://www.execujet.com",
        favorite: false,
        votes: 112,
        notes: "Premier executive aviation catering across Lanseria (HLA) and O.R. Tambo (JNB)."
    },

function switchCommunityTab(tabName) {
    // --- SOUTH AMERICA ---
    {
        name: "Air Gourmet Brazil (São Paulo)",
        region: "South America",
        countryCode: "Brazil",
        flag: "🇧🇷",
        phone: "+55 11 5093 4000",
        email: "atendimento@airgourmet.com.br",
        website: "https://airgourmet.com.br",
        menuLink: "https://airgourmet.com.br",
        favorite: false,
        votes: 134,
        notes: "Delivering gourmet executive meals directly to Congonhas (CGH) and Guarulhos (GRU)."
    },

    const feedTab = document.getElementById('comm-tab-feed');
    // --- MIDDLE EAST ---
    {
        name: "Emirates Flight Catering - Executive (UAE)",
        region: "Middle East",
        countryCode: "United Arab Emirates",
        flag: "🇦🇪",
        phone: "+971 4 208 6000",
        email: "executivedining@emiratesflightcatering.com",
        website: "https://www.emiratesflightcatering.com",
        menuLink: "https://www.emiratesflightcatering.com",
        favorite: true,
        votes: 512,
        notes: "World-class VIP aviation kitchen services across Dubai International (DXB) and DWC."
    },

    const blogsTab = document.getElementById('comm-tab-blogs');
    // --- ASIA ---
    {
        name: "LSG Sky Chefs Singapore",
        region: "Asia",
        countryCode: "Singapore",
        flag: "🇸🇬",
        phone: "+65 6542 3311",
        email: "singapore.ops@lsgskychefs.com",
        website: "https://www.lsgskychefs.com",
        menuLink: "https://www.lsgskychefs.com",
        favorite: false,
        votes: 245,
        notes: "High-precision private jet and commercial catering at Changi (SIN) and Seletar (XSP)."
    }
];

    const feedContent = document.getElementById('comm-content-feed');
let userSubmittedCateringQueue = [];

    const blogsContent = document.getElementById('comm-content-blogs');
function renderCateringDirectory(filterType = 'all', searchQuery = '') {
    const container = document.getElementById('catering-directory-grid');
    if (!container) return;

    let combinedList = [...globalCateringDirectory, ...userSubmittedCateringQueue];

    // Filter logic
    const filtered = combinedList.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.countryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.notes.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        if (filterType === 'favorites') return item.favorite;
        if (filterType === 'uk') return item.countryCode === 'UK';
        if (filterType === 'europe') return item.region === 'Europe';
        if (filterType === 'us') return item.countryCode === 'United States';
        if (filterType === 'me') return item.region === 'Middle East';
        if (filterType === 'asia') return item.region === 'Asia';
        if (filterType === 'africa') return item.region === 'Africa';
        if (filterType === 'sa') return item.region === 'South America';
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500 text-xs">No catering providers found matching your search criteria.</div>`;
        return;
    }

    if (tabName === 'feed') {
    let html = '';
    filtered.forEach((vendor, index) => {
        html += `
            <div class="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition">
                <div class="space-y-2">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="text-2xl">${vendor.flag}</span>
                            <div>
                                <span class="text-[10px] uppercase font-bold text-amber-400 tracking-wider">${vendor.region} • ${vendor.countryCode}</span>
                                <h4 class="text-base font-bold text-slate-100">${vendor.name}</h4>
                            </div>
                        </div>
                        <button onclick="toggleCateringFavorite('${vendor.name}')" class="text-xl p-1.5 rounded-lg hover:bg-slate-800 transition">
                            ${vendor.favorite ? '❤️' : '♡'}
                        </button>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed">${vendor.notes}</p>
                </div>

        feedTab.className = "px-4 py-2 rounded-lg text-xs font-bold transition bg-amber-400 text-slate-950 shadow";
                <div class="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                    <div class="flex items-center justify-between text-slate-300">
                        <span class="text-slate-500 font-semibold">Phone:</span>
                        <a href="tel:${vendor.phone}" class="text-amber-400 hover:underline font-mono">${vendor.phone}</a>
                    </div>
                    <div class="flex items-center justify-between text-slate-300">
                        <span class="text-slate-500 font-semibold">Email:</span>
                        <a href="mailto:${vendor.email}" class="text-amber-400 hover:underline truncate max-w-[180px]">${vendor.email}</a>
                    </div>
                </div>

        blogsTab.className = "px-4 py-2 rounded-lg text-xs font-bold transition text-slate-400 hover:text-slate-200";
                <div class="grid grid-cols-2 gap-2 pt-2">
                    <a href="${vendor.menuLink}" target="_blank" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-center font-bold text-xs transition flex items-center justify-center space-x-1">
                        <span>📋 Menus / Order</span>
                    </a>
                    <button onclick="openAiOrderAssistant('${vendor.name}')" class="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-center font-bold text-xs transition flex items-center justify-center space-x-1">
                        <span>🤖 AI Assistant</span>
                    </button>
                </div>
            </div>
        `;
    });

        feedContent.classList.remove('hidden');
    container.innerHTML = html;
}

        blogsContent.classList.add('hidden');
function filterCatering(type, btnElement) {
    document.querySelectorAll('.catering-filter-btn').forEach(btn => {
        btn.className = "catering-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200";
    });
    if (btnElement) {
        btnElement.className = "catering-filter-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-amber-400 text-slate-950 shadow";
    }
    const searchVal = document.getElementById('catering-search-bar').value;
    renderCateringDirectory(type, searchVal);
}

    } else {
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('catering-search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            renderCateringDirectory('all', e.target.value);
        });
    }
    renderCateringDirectory();
});

        blogsTab.className = "px-4 py-2 rounded-lg text-xs font-bold transition bg-amber-400 text-slate-950 shadow";
function toggleCateringFavorite(vendorName) {
    const target = globalCateringDirectory.find(v => v.name === vendorName) || userSubmittedCateringQueue.find(v => v.name === vendorName);
    if (target) {
        target.favorite = !target.favorite;
        renderCateringDirectory();
    }
}

        feedTab.className = "px-4 py-2 rounded-lg text-xs font-bold transition text-slate-400 hover:text-slate-200";
function submitUserCateringVendor(event) {
    event.preventDefault();
    const name = document.getElementById('new-vendor-name').value.trim();
    const region = document.getElementById('new-vendor-region').value;
    const country = document.getElementById('new-vendor-country').value.trim();
    const flag = document.getElementById('new-vendor-flag').value.trim() || '✈️';
    const phone = document.getElementById('new-vendor-phone').value.trim();
    const email = document.getElementById('new-vendor-email').value.trim();
    const website = document.getElementById('new-vendor-website').value.trim();
    const notes = document.getElementById('new-vendor-notes').value.trim();

    if (!name || !phone || !email) {
        alert("Please complete all required fields (Name, Phone, Email).");
        return;
    }

        blogsContent.classList.remove('hidden');
    const newVendor = {
        name,
        region,
        countryCode: country || region,
        flag,
        phone,
        email,
        website: website || '#',
        menuLink: website || '#',
        favorite: false,
        votes: 1,
        notes: notes || 'Community-submitted executive jet catering vendor pending full audit.'
    };

    userSubmittedCateringQueue.push(newVendor);
    alert("Vendor successfully submitted! Awaiting host review & community notes approval.");
    document.getElementById('catering-submission-form').reset();
    renderCateringDirectory();
}

        feedContent.classList.add('hidden');

// --- AI ORDER HELPER ASSISTANT MODAL ---
function openAiOrderAssistant(vendorName) {
    const modal = document.getElementById('ai-assistant-modal');
    const title = document.getElementById('ai-assistant-title');
    if (modal && title) {
        title.textContent = `SkyAgent AI Concierge — Assisting with ${vendorName}`;
        modal.classList.remove('hidden');
    }
}

function closeAiAssistant() {
    const modal = document.getElementById('ai-assistant-modal');
    if (modal) modal.classList.add('hidden');
}

function sendAiMessage() {
    const input = document.getElementById('ai-chat-input');
    const log = document.getElementById('ai-chat-log');
    if (!input || !log) return;
    const text = input.value.trim();
    if (!text) return;

    log.innerHTML += `<div class="text-right"><span class="inline-block bg-amber-400 text-slate-950 text-xs px-3 py-2 rounded-xl max-w-[80%]">${escapeHtml(text)}</span></div>`;
    input.value = '';

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        let reply = "I can assist you with compiling VIP dietary requirements, generating FBO delivery time windows, or drafting direct RFQs to this caterer. Would you like me to formulate a formal order template?";
        if (text.toLowerCase().includes('menu') || text.toLowerCase().includes('order')) {
            reply = "Certainly! I have formatted your order requirements for VIP dietary profiles (Halal/Gluten-Free options included) and can dispatch the confirmation directly to dispatch ops.";
        }
        log.innerHTML += `<div class="text-left"><span class="inline-block bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl max-w-[80%] border border-slate-700">${reply}</span></div>`;
        log.scrollTop = log.scrollHeight;
    }, 800);
}

    const postInput = document.getElementById('post-text-input');

    const charCounter = document.getElementById('char-counter');
// --- COMMUNITY HUB CONTROLLERS ---
function switchCommunityTab(tabName) {
    const feedTab = document.getElementById('comm-tab-feed');
    const blogsTab = document.getElementById('comm-tab-blogs');
    const feedContent = document.getElementById('comm-content-feed');
    const blogsContent = document.getElementById('comm-content-blogs');

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

});



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

    const newPostHTML = `

        <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3 animate-fade-in">

        <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
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

    document.getElementById('char-counter').textContent = '0 / 1000';

    alert("Your experience was published to the community feed!");

}



function toggleLike(btn) {

    const countSpan = btn.querySelector('span.font-bold');

    let currentLikes = parseInt(countSpan.textContent);

    countSpan.textContent = currentLikes + 1;

    btn.classList.add('text-rose-400');

}



function escapeHtml(text) {

    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

}





// --- SECURE VAULT CONTROLLERS ---

function unlockVault() {

    const pinInput = document.getElementById('vault-pin-input');

    if (pinInput && pinInput.value.length >= 4) {

        document.getElementById('vault-auth-screen').classList.add('hidden');

        document.getElementById('vault-content-panel').classList.remove('hidden');

        pinInput.value = '';

    } else {

        alert("Please enter a valid secure vault PIN (at least 4 digits).");

    }

}



function lockVault() {

    document.getElementById('vault-content-panel').classList.add('hidden');

    document.getElementById('vault-auth-screen').classList.remove('hidden');

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





// --- LIVE FLIGHT TRACKER ENGINE (LINKED TELEMETRY & FAST-ZOOM VIEWPORT) ---

// --- LIVE FLIGHT TRACKER ENGINE ---
let flightTimer = null;

let currentZoomLevel = 5; // Default zoomed out overview state

let currentZoomLevel = 3; 
let currentTrackedFlight = {

    callsign: "N750EX",

    route: "EGLF ✈️ LSGG",

    details: "Farnborough to Geneva • FL430 • Mach 0.82",

    details: "Farnborough to Geneva • FL430 • Mach 0.82 | Alt: 43000ft | GS: 485kts",
    weather: "CAVOK 18°C",

    status: "On Schedule (-2m)",

    altitude: 43000,

    groundSpeed: 485

};



const randomFlightPool = [

    { callsign: "N750EX", route: "EGLF ✈️ LSGG", details: "Farnborough to Geneva • FL430 • Mach 0.82", weather: "CAVOK 18°C", status: "On Schedule (-2m)", alt: 43000, gs: 485 },

    { callsign: "G-VIPX", route: "EGGW ✈️ LFMD", details: "Luton to Cannes Mandelieu • FL370 • Mach 0.78", weather: "SCT030 21°C", status: "On Time", alt: 37000, gs: 450 },

    { callsign: "N888Z", route: "KTEB ✈️ KPBI", details: "Teterboro to Palm Beach • FL410 • Mach 0.80", weather: "FEW025 28°C", status: "Airborne", alt: 41000, gs: 468 },

    { callsign: "A6-REG", route: "OMDB ✈️ OMDW", details: "Dubai to Al Maktoum • FL350 • Mach 0.76", weather: "CAVOK 36°C", status: "Climbing", alt: 35000, gs: 430 },

    { callsign: "HB-JIV", route: "LSZH ✈️ KJFK", details: "Zurich to New York JFK • FL390 • Mach 0.84", weather: "BKN015 12°C", status: "On Schedule", alt: 39000, gs: 510 }

    { callsign: "N888Z", route: "KTEB ✈️ KPBI", details: "Teterboro to Palm Beach • FL410 • Mach 0.80", weather: "FEW025 28°C", status: "Airborne", alt: 41000, gs: 468 }
];



function initFlightTracker() {

    // 1. Randomly pick a flight profile on load and sync telemetry header data
    const randomIndex = Math.floor(Math.random() * randomFlightPool.length);

    const chosen = randomFlightPool[randomIndex];



    currentTrackedFlight = {

        callsign: chosen.callsign,

        route: chosen.route,

        details: chosen.details,

        weather: chosen.weather,

        status: chosen.status,

        altitude: chosen.alt,

        groundSpeed: chosen.gs

    };

    updateFlightUI();

    reloadRadarFrame();



    // 2. Handle manual search registration/callsign input updates

    const trackButton = document.getElementById('track-btn');

    const searchInput = document.getElementById('flight-search-input');



    if (trackButton && searchInput) {

        trackButton.addEventListener('click', () => {

            const query = searchInput.value.trim();

            if (query) {

                const upperQuery = query.toUpperCase();

                

                // Link telemetry data to the searched registration/callsign

                currentTrackedFlight.callsign = upperQuery;

                currentTrackedFlight.route = `${upperQuery} ✈️ Destination Hub`;

                currentTrackedFlight.details = `Live Registration Sync • FL390 • Mach 0.80`;

                currentTrackedFlight.weather = `Synced OK`;

                currentTrackedFlight.status = `Active Track`;

                updateFlightUI();



                // Lock radar frame onto the searched flight while maintaining zoom preference

                updateFlightUI();
                reloadRadarFrame();

            }

        });

    }



    startFlightPolling();

    window.addEventListener('online', handleNetworkChange);

    window.addEventListener('offline', handleNetworkChange);

    handleNetworkChange(); 

}



function reloadRadarFrame() {

    const radarFrame = document.getElementById('live-radar-frame');

    if (radarFrame) {

        const callsign = encodeURIComponent(currentTrackedFlight.callsign);

        // Optimized URL parameters for fast loading and full zoom responsiveness

        radarFrame.src = `https://globe.adsbexchange.com/?kiosk&zoom=${currentZoomLevel}&icao=${callsign}&sel=${callsign}`;

    }

}



function zoomTracker(delta) {

    // Adjust zoom level bounds between 3 (zoomed out continent view) and 12 (tight airport view)

    currentZoomLevel = Math.max(3, Math.min(12, currentZoomLevel + delta));

    reloadRadarFrame();

}



function startFlightPolling() {

    if (flightTimer) clearInterval(flightTimer);



    flightTimer = setInterval(() => {

        if (navigator.onLine) {

            fetchLiveFlightData();

        } else {

            console.log("Device offline: Live flight updates paused.");

            currentTrackedFlight.altitude += Math.floor(Math.random() * 200) - 100;
            currentTrackedFlight.groundSpeed += Math.floor(Math.random() * 10) - 5;
            updateFlightUI();
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

        statusIndicator.className = "w-3 h-3 rounded-full bg-amber-500 animate-pulse";
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

// --- GLOBAL CLOCKS & TIME ZONES (UNIFIED MOBILE & DESKTOP) ---
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

    // Targets all matching UTC clock identifiers across mobile, tablet, and desktop headers
    document.querySelectorAll('.header-utc-clock-target').forEach(el => {
        el.textContent = now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }) + " UTC";
    });
    updateRotatingTimeZone(now);

}



function updateRotatingTimeZone(now = new Date()) {

    const tzData = targetTimeZones[currentTimeZoneIndex];

    const rotatingEl = document.getElementById('rotating-timezone-widget');

    if (rotatingEl) {

    document.querySelectorAll('.rotating-timezone-widget-target').forEach(el => {
        const timeString = now.toLocaleTimeString('en-US', { timeZone: tzData.zone, hour: '2-digit', minute: '2-digit', hour12: false });

        rotatingEl.innerHTML = `<span class="text-slate-400 text-xs">${tzData.label}:</span> <span class="text-amber-400 font-bold">${timeString}</span>`;

    }

        el.innerHTML = `<span class="text-slate-400 text-xs">${tzData.label}:</span> <span class="text-amber-400 font-bold">${timeString}</span>`;
    });
}





// --- AUTOMATED 10-DAY WEATHER FORECAST WIDGET ---

// --- AUTOMATED WEATHER FORECAST WIDGET ---
const weatherLocations = [

    { name: "London / Farnborough (EGLF)", lat: 51.275, lon: -0.776 },

    { name: "New York (TEB / JFK)", lat: 40.7128, lon: -74.0060 },

    { name: "Geneva (LSGG)", lat: 46.2372, lon: 6.109 },

    { name: "Dubai (DXB)", lat: 25.2048, lon: 55.2708 }

    { name: "Geneva (LSGG)", lat: 46.2372, lon: 6.109 }
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

        const data = await response.json();



        let html = `

            <div class="flex items-center justify-between border-b border-slate-800 pb-3">

                <div>

                    <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Automated Weather</span>

                    <h4 class="text-sm font-bold text-slate-100">${loc.name}</h4>

                </div>

                <div class="text-right">

                    <span class="text-2xl font-extrabold text-slate-100">${data.current.temperature_2m}°C</span>

                </div>

            </div>

            <div class="pt-2">

                <p class="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">10-Day Automated Forecast Preview:</p>

                <div class="grid grid-cols-5 gap-2 text-center">

        `;



        for (let i = 0; i < 5; i++) {

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

        console.error("Weather fetch failed (Offline mode active):", error);

        console.error("Weather fetch failed:", error);
        container.innerHTML = `<div class="text-xs text-amber-400 p-4">Weather data cached / Offline mode active.</div>`;

    }

}





// --- INITIALIZATION HOOK ---

document.addEventListener('DOMContentLoaded', () => {

    renderAviationDirectory();

    renderCateringDirectory();
    initFlightTracker();

    initGlobalClocks();

    initAutomatedWeather();

});
