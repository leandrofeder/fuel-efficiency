/* ====================================================================
   PLANNER SEMANAL SAUDÁVEL - LÓGICA
   
   Módulos:
   - CONFIG: dados e configurações
   - UTILS: funções utilitárias
   - STATE: gerenciar estado
   - UI: interação com DOM
   - INIT: inicialização
   ==================================================================== */

/* ========================================
   1. CONFIGURAÇÃO
   ======================================== */
const CONFIG = {
    breakfastOptions: [
        { name: "Ovos mexidos (2 un.) + Pão integral (1 fatia)", ingredients: ["Ovos", "Pão integral", "Azeite"], proteins: ["ovo"] },
        { name: "Iogurte natural (1 pote) + Aveia (2 col. sopa) + Banana", ingredients: ["Iogurte natural", "Aveia", "Banana"], proteins: ["laticinio"] },
        { name: "Crepioca (2 col. sopa) + Queijo branco (1 fatia)", ingredients: ["Goma de tapioca", "Ovos", "Queijo branco"], proteins: ["ovo", "laticinio"] },
        { name: "Vitamina de Leite (1 copo) + Mamão + Aveia", ingredients: ["Leite", "Mamão", "Aveia"], proteins: ["laticinio"] },
        { name: "Cuscuz de milho (pequeno) + Ovo (1 un.)", ingredients: ["Farinha de milho", "Ovo"], proteins: ["ovo"] },
        { name: "Pão integral + Pasta de amendoim + Café", ingredients: ["Pão integral", "Pasta de amendoim", "Café"], proteins: ["vegetariano"] },
        { name: "Tapioca (2 col. sopa) + Queijo minas + Orégano", ingredients: ["Goma de tapioca", "Queijo minas"], proteins: ["laticinio"] },
        { name: "Mingau de aveia (3 col. sopa) + Canela", ingredients: ["Aveia", "Leite", "Canela"], proteins: ["laticinio"] },
        { name: "Salada de frutas + Iogurte natural", ingredients: ["Frutas variadas", "Iogurte natural"], proteins: ["laticinio"] },
        { name: "Torrada integral + Abacate + Limão", ingredients: ["Pão integral", "Abacate", "Limão"], proteins: ["vegetariano"] },
        { name: "Ovos cozidos (2 un.) + Tomate + Orégano", ingredients: ["Ovos", "Tomate", "Orégano"], proteins: ["ovo"] },
        { name: "Iogurte + Granola + Morango", ingredients: ["Iogurte natural", "Granola", "Morango"], proteins: ["laticinio"] },
        { name: "Tapioca + Ovo mexido + Queijo minas", ingredients: ["Goma de tapioca", "Ovos", "Queijo minas"], proteins: ["ovo", "laticinio"] },
        { name: "Vitamina de Leite + Banana + Sementes", ingredients: ["Leite", "Banana", "Pasta de amendoim"], proteins: ["laticinio", "vegetariano"] },
        { name: "Pão integral + Queijo branco + Café", ingredients: ["Pão integral", "Queijo branco", "Café"], proteins: ["laticinio"] },
        { name: "Mingau de aveia + Banana", ingredients: ["Aveia", "Leite", "Banana"], proteins: ["laticinio"] },
        { name: "Crepioca + Peito de peru (2 fatias)", ingredients: ["Goma de tapioca", "Ovos", "Peito de peru"], proteins: ["ovo", "frango"] },
        { name: "Ovos mexidos + Queijo cottage + Cenoura", ingredients: ["Ovos", "Queijo cottage", "Cenoura"], proteins: ["ovo", "laticinio"] },
        { name: "Iogurte + Sementes de chia + Pera", ingredients: ["Iogurte natural", "Sementes de chia", "Pera"], proteins: ["laticinio", "vegetariano"] },
        { name: "Pão integral + Ricota + Manjericão", ingredients: ["Pão integral", "Ricota", "Manjericão"], proteins: ["laticinio"] },
        { name: "Cuscuz de milho + Queijo branco + Azeite", ingredients: ["Farinha de milho", "Queijo branco", "Azeite"], proteins: ["laticinio"] }
    ],

    lunchOptions: [
        { name: "Frango grelhado + Arroz integral + Feijão + Salada", ingredients: ["Frango", "Arroz integral", "Feijão", "Alface", "Tomate"], proteins: ["frango"] },
        { name: "Carne moída refogada + Batata cozida + Brócolis", ingredients: ["Carne bovina magra", "Batata", "Brócolis"], proteins: ["bovina"] },
        { name: "Omelete (2 ovos) com Legumes + Arroz", ingredients: ["Ovos", "Tomate", "Arroz"], proteins: ["ovo"] },
        { name: "Frango desfiado + Macarrão integral + Azeite", ingredients: ["Frango desfiado", "Macarrão integral", "Azeite"], proteins: ["frango"] },
        { name: "Lentilha + Arroz + Couve refogada", ingredients: ["Lentilha", "Arroz", "Couve"], proteins: ["vegetariano"] },
        { name: "Bife de porco magro + Purê de abóbora + Salada", ingredients: ["Carne suína magra", "Abóbora", "Pepino"], proteins: ["porco"] },
        { name: "Frango desfiado + Batata doce cozida + Cenoura", ingredients: ["Frango", "Batata-doce", "Cenoura"], proteins: ["frango"] },
        { name: "Quinoa + Grão-de-bico + Pimentão e Cebola", ingredients: ["Quinoa", "Grão-de-bico", "Pimentão", "Cebola"], proteins: ["vegetariano"] },
        { name: "Peixe (Tilápia) assado + Arroz + Legumes", ingredients: ["Tilápia", "Arroz", "Brócolis", "Cenoura"], proteins: ["peixe"] },
        { name: "Sanduíche natural com Queijo cottage + Peito de peru", ingredients: ["Pão integral", "Queijo cottage", "Peito de peru", "Alface"], proteins: ["laticinio", "frango"] },
        { name: "Frango desfiado + Arroz + Feijão + Cenoura", ingredients: ["Frango", "Arroz", "Feijão", "Cenoura"], proteins: ["frango"] },
        { name: "Carne moída + Macarrão integral + Molho de tomate", ingredients: ["Carne bovina magra", "Macarrão integral", "Molho de tomate"], proteins: ["bovina"] },
        { name: "Omelete + Queijo branco + Batata doce cozida", ingredients: ["Ovos", "Queijo branco", "Batata-doce"], proteins: ["ovo", "laticinio"] },
        { name: "Ovo cozido picado + Salada mista + Azeite", ingredients: ["Ovo", "Alface", "Tomate", "Pepino", "Azeite", "Limão"], proteins: ["ovo"] },
        { name: "Lentilha + Quinoa cozida + Brócolis no vapor", ingredients: ["Lentilha", "Quinoa", "Brócolis"], proteins: ["vegetariano"] },
        { name: "Bife de frango grelhado + Purê de batata + Couve", ingredients: ["Frango", "Batata", "Couve"], proteins: ["frango"] },
        { name: "Carne bovina + Arroz integral + Feijão + Abóbora", ingredients: ["Carne bovina magra", "Arroz integral", "Feijão", "Abóbora"], proteins: ["bovina"] },
        { name: "Peixe (Tilápia) cozido + Batata cozida + Legumes", ingredients: ["Tilápia", "Batata", "Cenoura", "Brócolis"], proteins: ["peixe"] },
        { name: "Frango desfiado + Pão integral + Queijo cottage", ingredients: ["Frango", "Pão integral", "Queijo cottage", "Alface"], proteins: ["frango", "laticinio"] },
        { name: "Grão-de-bico + Arroz + Tomate cebola refogados", ingredients: ["Grão-de-bico", "Arroz", "Tomate", "Cebola"], proteins: ["vegetariano"] }
    ],

    snackOptions: [
        { name: "Fruta (Maçã/Pera) + Castanhas (5 un.)", ingredients: ["Maçã", "Castanhas"], proteins: ["vegetariano"] },
        { name: "Iogurte natural (1 pote) + Linhaça", ingredients: ["Iogurte natural", "Sementes variadas"], proteins: ["laticinio"] },
        { name: "Ovo cozido (1 un.) + Sal", ingredients: ["Ovo"], proteins: ["ovo"] },
        { name: "Queijo minas/branco + Tomate + Orégano", ingredients: ["Queijo minas", "Tomate", "Orégano"], proteins: ["laticinio"] },
        { name: "Pão integral + Ricota amassada", ingredients: ["Pão integral", "Ricota"], proteins: ["laticinio"] },
        { name: "Cenoura/Pepino + Homus", ingredients: ["Cenoura", "Homus"], proteins: ["vegetariano"] },
        { name: "Banana (1 un.) + Pasta de amendoim", ingredients: ["Banana", "Pasta de amendoim"], proteins: ["vegetariano"] },
        { name: "Vitamina: Leite vegetal + Fruta", ingredients: ["Leite vegetal", "Banana"], proteins: ["vegetariano"] },
        { name: "Wrap integral + Frango desfiado", ingredients: ["Wrap integral", "Frango desfiado"], proteins: ["frango"] },
        { name: "Pudim de chia + Leite de coco", ingredients: ["Sementes de chia", "Leite de coco"], proteins: ["vegetariano"] },
        { name: "Pão integral + Ovo cozido + Café", ingredients: ["Pão integral", "Ovo", "Café"], proteins: ["ovo"] },
        { name: "Iogurte + Aveia + Mel", ingredients: ["Iogurte natural", "Aveia", "Mel"], proteins: ["laticinio"] },
        { name: "Banana (1 un.) + Queijo minas", ingredients: ["Banana", "Queijo minas"], proteins: ["laticinio"] },
        { name: "Ricota + Tomate + Orégano", ingredients: ["Ricota", "Tomate", "Orégano"], proteins: ["laticinio"] },
        { name: "Pepino + Queijo cottage", ingredients: ["Pepino", "Queijo cottage"], proteins: ["laticinio"] },
        { name: "Wrap integral + Queijo branco", ingredients: ["Wrap integral", "Queijo branco"], proteins: ["laticinio"] },
        { name: "Vitamina: Leite + Morango", ingredients: ["Leite", "Morango"], proteins: ["laticinio"] },
        { name: "Ovo mexido + Pão integral", ingredients: ["Ovo", "Pão integral"], proteins: ["ovo"] },
        { name: "Iogurte + Castanhas", ingredients: ["Iogurte natural", "Castanhas"], proteins: ["laticinio", "vegetariano"] },
        { name: "Pão integral + Peito de peru", ingredients: ["Pão integral", "Peito de peru"], proteins: ["frango"] }
    ],

    categoryKeywords: {
        proteinas: ["frango", "carne", "ovo", "peixe", "queijo", "iogurte", "ricota", "peito de peru", "cottage"],
        graos: ["pão", "tapioca", "arroz", "feijão", "lentilha", "grão-de-bico", "aveia", "macarrão", "quinoa"],
        legumes: ["brócolis", "couve", "alface", "cenoura", "abóbora", "batata-doce", "batata", "tomate", "pepino", "pimentão"],
        frutas: ["banana", "maçã", "limão", "mamão", "abacate", "frutas variadas", "morango", "pera"],
        temperos: ["azeite", "sal", "orégano", "canela", "cebola", "alho"],
        outros: ["leite", "café", "pasta de amendoim", "castanhas", "sementes", "homus", "wrap integral", "leite vegetal", "leite de coco"]
    },

    defaultUnitByIngredient: {
        "Frango": { qty: 1, unit: "kg" },
        "Carne bovina magra": { qty: 0.8, unit: "kg" },
        "Tilápia": { qty: 0.5, unit: "kg" },
        "Ovos": { qty: 12, unit: "un." },
        "Ovo": { qty: 6, unit: "un." },
        "Iogurte natural": { qty: 6, unit: "un." },
        "Queijo branco": { qty: 300, unit: "g" },
        "Queijo minas": { qty: 300, unit: "g" },
        "Queijo cottage": { qty: 200, unit: "g" },
        "Peito de peru": { qty: 150, unit: "g" },
        "Pão integral": { qty: 2, unit: "pac" },
        "Goma de tapioca": { qty: 500, unit: "g" },
        "Farinha de milho": { qty: 500, unit: "g" },
        "Arroz integral": { qty: 1, unit: "kg" },
        "Arroz": { qty: 1, unit: "kg" },
        "Feijão": { qty: 500, unit: "g" },
        "Lentilha": { qty: 300, unit: "g" },
        "Grão-de-bico": { qty: 300, unit: "g" },
        "Aveia": { qty: 250, unit: "g" },
        "Macarrão integral": { qty: 250, unit: "g" },
        "Quinoa": { qty: 200, unit: "g" },
        "Brócolis": { qty: 1, unit: "maço" },
        "Couve": { qty: 1, unit: "maço" },
        "Alface": { qty: 1, unit: "maço" },
        "Cenoura": { qty: 3, unit: "un." },
        "Abóbora": { qty: 300, unit: "g" },
        "Batata-doce": { qty: 2, unit: "un." },
        "Batata": { qty: 2, unit: "un." },
        "Tomate": { qty: 4, unit: "un." },
        "Banana": { qty: 6, unit: "un." },
        "Maçã": { qty: 5, unit: "un." },
        "Limão": { qty: 3, unit: "un." },
        "Leite": { qty: 1, unit: "L" },
        "Leite vegetal": { qty: 1, unit: "L" },
        "Café": { qty: 200, unit: "g" },
        "Pasta de amendoim": { qty: 200, unit: "g" },
        "Castanhas": { qty: 100, unit: "g" }
    }
};

/* ========================================
   2. UTILIDADES
   ======================================== */
const UTILS = {
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    normalizeIngredientName(name) {
        return name.trim();
    },

    classifyIngredient(name) {
        const low = name.toLowerCase();
        for (const [cat, keys] of Object.entries(CONFIG.categoryKeywords)) {
            for (const k of keys) {
                if (low.includes(k.toLowerCase())) return cat;
            }
        }
        return "outros";
    },

    findOptionByName(name, list) {
        return list.find(opt => opt.name.toLowerCase().includes(name.trim().toLowerCase()));
    },

    getProteinLabel(protein) {
        const labels = {
            "frango": "Frango",
            "bovina": "Carne bovina",
            "peixe": "Peixe",
            "ovo": "Ovo",
            "laticinio": "Laticínios",
            "vegetariano": "Vegetarianas",
            "porco": "Carne suína"
        };
        return labels[protein] || protein;
    }
};

/* ========================================
   3. ESTADO DA APLICAÇÃO
   ======================================== */
const STATE = {
    currentSelections: { breakfast: [], lunch: [], snack: [] },

    getProteinsList() {
        const set = new Set();
        for (const mt of["breakfast", "lunch", "snack"]) {
            for (const opt of this.currentSelections[mt]) {
                if (!opt) continue;
                for (const p of opt.proteins) set.add(p);
            }
        }
        return Array.from(set);
    },

    setMeal(mealType, dayIndex, option) {
        if (!this.currentSelections[mealType]) this.currentSelections[mealType] = [];
        this.currentSelections[mealType][dayIndex] = option;
    },

    getMeal(mealType, dayIndex) {
        return this.currentSelections[mealType] ? .[dayIndex];
    }
};

/* ========================================
   4. INTERFACE DO USUÁRIO
   ======================================== */
const UI = {
    getOptionByMealType(mealType) {
        const map = {
            "breakfast": CONFIG.breakfastOptions,
            "lunch": CONFIG.lunchOptions,
            "snack": CONFIG.snackOptions
        };
        return map[mealType] || [];
    },

    chooseReplacement(mealType, currentOpt) {
        const pool = this.getOptionByMealType(mealType);
        const proteinsNow = STATE.getProteinsList();
        const candidates = pool.filter(o => o.name !== currentOpt.name);

        const preferred = candidates.filter(o =>
            o.proteins.some(p => proteinsNow.includes(p))
        );

        return preferred.length > 0 ? UTILS.randomChoice(preferred) : UTILS.randomChoice(candidates);
    },

    handleSwap(mealType, dayIndex) {
        const currentOpt = STATE.getMeal(mealType, dayIndex);
        const newOpt = this.chooseReplacement(mealType, currentOpt);

        STATE.setMeal(mealType, dayIndex, newOpt);

        const section = document.querySelector(`.meal-section[data-meal-type="${mealType}"]`);
        if (!section) return;

        const dayCards = Array.from(section.querySelectorAll(".day-card"));
        const card = dayCards[dayIndex];
        if (card) {
            const mealTextEl = card.querySelector(".day-meal");
            if (mealTextEl) mealTextEl.textContent = newOpt.name;
        }

        this.updateIngredientsAndProteins();
    },

    updateIngredientsAndProteins() {
        const proteins = STATE.getProteinsList();
        const proteinsReadable = proteins.map(p => UTILS.getProteinLabel(p)).join(", ") || "—";

        const proteinasEl = document.getElementById("proteinas-da-semana");
        if (proteinasEl) {
            proteinasEl.innerHTML = `🍗 Proteínas da semana: <strong>${proteinsReadable}</strong>`;
        }

        this.renderShoppingList();
    },

    renderShoppingList() {
        const aggregate = {};
        for (const mt of["breakfast", "lunch", "snack"]) {
            for (const opt of STATE.currentSelections[mt]) {
                if (!opt) continue;
                for (let ing of opt.ingredients) {
                    ing = UTILS.normalizeIngredientName(ing);
                    aggregate[ing] = (aggregate[ing] || 0) + 1;
                }
            }
        }

        const categories = { proteinas: {}, graos: {}, legumes: {}, frutas: {}, temperos: {}, outros: {} };
        for (const [ing, count] of Object.entries(aggregate)) {
            const cat = UTILS.classifyIngredient(ing);
            categories[cat][ing] = count;
        }

        this.renderCategoryLists(categories);
    },

    renderCategoryLists(categories) {
        const buildListLines = (obj) => {
            const lines = [];
            for (const [ing, count] of Object.entries(obj)) {
                const norm = ing.replace(/\s+/g, ' ').trim();
                let suggested = CONFIG.defaultUnitByIngredient[norm];

                if (!suggested) {
                    for (const k of Object.keys(CONFIG.defaultUnitByIngredient)) {
                        if (norm.toLowerCase().includes(k.toLowerCase())) {
                            suggested = CONFIG.defaultUnitByIngredient[k];
                            break;
                        }
                    }
                }

                let qtyLabel = "";
                if (suggested) {
                    let total = suggested.qty * count;
                    if (typeof total === "number") {
                        total = total < 1 && total > 0 ? Math.ceil(total) : Math.round(total * 10) / 10;
                    }
                    qtyLabel = `${total} ${suggested.unit}`;
                } else {
                    qtyLabel = `${count}x`;
                }

                lines.push({ name: norm, qty: qtyLabel });
            }
            lines.sort((a, b) => a.name.localeCompare(b.name));
            return lines;
        };

        const renderList = (ulId, list) => {
            const ul = document.getElementById(ulId);
            if (!ul) return;
            ul.innerHTML = "";
            for (const it of(list.length ? list : [{ name: "—", qty: "" }])) {
                const li = document.createElement("li");
                li.innerHTML = `<span class="item-name">${it.name}</span><span class="item-qty">${it.qty}</span>`;
                ul.appendChild(li);
            }
        };

        renderList("cat-proteinas", buildListLines(categories.proteinas));
        renderList("cat-graos", buildListLines(categories.graos));
        renderList("cat-legumes", buildListLines(categories.legumes));
        renderList("cat-frutas", buildListLines(categories.frutas));
        renderList("cat-temperos", buildListLines(categories.temperos));
        renderList("cat-outros", buildListLines(categories.outros));
    }
};

/* ========================================
   5. INICIALIZAÇÃO
   ======================================== */
const INIT = {
    setupEventListeners() {
        const mealSections = document.querySelectorAll(".meal-section");
        mealSections.forEach(section => {
            const mealType = section.dataset.mealType;
            const dayCards = section.querySelectorAll(".day-card");

            dayCards.forEach((card, idx) => {
                const mealTextEl = card.querySelector(".day-meal");
                const swapBtn = card.querySelector(".swap-btn");

                const displayedText = mealTextEl.textContent.trim();
                const pool = UI.getOptionByMealType(mealType);
                let opt = UTILS.findOptionByName(displayedText, pool) || UTILS.randomChoice(pool);

                STATE.setMeal(mealType, idx, opt);
                mealTextEl.textContent = opt.name;

                if (swapBtn) {
                    swapBtn.addEventListener("click", () => {
                        UI.handleSwap(mealType, idx);
                    });
                }
            });
        });
    },

    initialize() {
        this.setupEventListeners();
        UI.updateIngredientsAndProteins();
    }
};

// Inicializar quando documento estiver pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => INIT.initialize());
} else {
    INIT.initialize();
}