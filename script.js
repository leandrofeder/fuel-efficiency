/* ====================================================================
   PLANNER SEMANAL SAUDÁVEL - LÓGICA COM DADOS EXTERNOS
   
   Módulos:
   - LOADER: carregar dados JSON
   - CONFIG: dados em memória
   - UTILS: funções utilitárias
   - STATE: gerenciar estado
   - UI: interação com DOM
   - INIT: inicialização
   ==================================================================== */

let CONFIG = {
    breakfastOptions: [],
    lunchOptions: [],
    snackOptions: [],
    categoryKeywords: {},
    defaultUnitByIngredient: {},
    proteinLabels: {},
    selectedProteins: new Set(),
    mealTypeLabels: {
        breakfast: "Café da Manhã",
        lunch: "Almoço",
        snack: "Lanche da Tarde"
    }
};

/* ========================================
   0.5. NOTIFICAÇÕES CUSTOMIZADAS
   ======================================== */
const NOTIFY = {
    show(title, message) {
        const modal = document.getElementById("notification-modal");
        const titleEl = document.getElementById("modal-title");
        const messageEl = document.getElementById("modal-message");
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        if (modal) modal.classList.remove("hidden");
    },

    warning(message) {
        this.show("⚠️ Aviso", message);
    }
};

/* ========================================
   1. LOADER - Carregar dados JSON
   ======================================== */
const LOADER = {
    async loadJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Erro ao carregar ${path}`);
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar ${path}:`, error);
            return null;
        }
    },

    async initialize() {
        const [breakfast, lunch, snack, config] = await Promise.all([
            this.loadJSON('data/breakfast.json'),
            this.loadJSON('data/lunch.json'),
            this.loadJSON('data/snack.json'),
            this.loadJSON('data/config.json')
        ]);

        if (breakfast) CONFIG.breakfastOptions = breakfast;
        if (lunch) CONFIG.lunchOptions = lunch;
        if (snack) CONFIG.snackOptions = snack;
        if (config) {
            CONFIG.categoryKeywords = config.categoryKeywords;
            CONFIG.defaultUnitByIngredient = config.defaultUnitByIngredient;
            CONFIG.proteinLabels = config.proteinLabels;
        }

        return CONFIG;
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

    getProteinLabel(proteinKey) {
        return CONFIG.proteinLabels[proteinKey] || proteinKey;
    },

    filterBySelectedProteins(options) {
        if (CONFIG.selectedProteins.size === 0) return options;
        
        return options.filter(opt => 
            opt.proteins.some(p => CONFIG.selectedProteins.has(p))
        );
    }
};

/* ========================================
   3. GERENCIADOR DE ESTADO
   ======================================== */
const STATE = {
    currentSelections: { breakfast: [], lunch: [], snack: [] },

    getProteinsList() {
        const set = new Set();
        for (const mt of ["breakfast", "lunch", "snack"]) {
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
        return this.currentSelections[mealType]?.[dayIndex];
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
        
        const options = map[mealType] || [];
        return UTILS.filterBySelectedProteins(options);
    },

    chooseReplacement(mealType, currentOpt) {
        const pool = this.getOptionByMealType(mealType);
        const candidates = pool.filter(o => o.name !== currentOpt.name);

        if (candidates.length === 0) return null;
        return UTILS.randomChoice(candidates);
    },

    handleSwap(mealType, dayIndex) {
        const currentOpt = STATE.getMeal(mealType, dayIndex);
        if (!currentOpt) return;

        const newOpt = this.chooseReplacement(mealType, currentOpt);
        if (!newOpt) {
            const mealLabel = CONFIG.mealTypeLabels[mealType] || mealType;
            NOTIFY.warning(`Não temos opção de ${mealLabel} com as proteínas selecionadas.`);
            return;
        }

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

        const proteinasEl = document.querySelector(".prep-section h3");
        if (proteinasEl) {
            const summary = CONFIG.selectedProteins.size > 0 
                ? `${Array.from(CONFIG.selectedProteins).map(p => UTILS.getProteinLabel(p)).join(", ")}`
                : "Selecione as proteínas desejadas";
            proteinasEl.textContent = `🍗 Proteínas Desejadas: ${summary}`;
        }

        this.renderShoppingList();
    },

    renderShoppingList() {
        const aggregate = {};
        const allMeals = [
            ...STATE.currentSelections.breakfast,
            ...STATE.currentSelections.lunch,
            ...STATE.currentSelections.snack
        ];

        for (const meal of allMeals) {
            if (!meal) continue;
            for (const ing of meal.ingredients) {
                const normalized = UTILS.normalizeIngredientName(ing);
                aggregate[normalized] = (aggregate[normalized] || 0) + 1;
            }
        }

        const categories = {
            proteinas: {}, graos: {}, legumes: {}, frutas: {}, temperos: {}, outros: {}
        };

        for (const [ing, count] of Object.entries(aggregate)) {
            const cat = UTILS.classifyIngredient(ing);
            categories[cat][ing] = count;
        }

        const buildListLines = (ingMap) => {
            const lines = {};
            for (const ing of Object.keys(ingMap)) {
                const cfg = CONFIG.defaultUnitByIngredient[ing];
                if (cfg) {
                    const totalQty = cfg.qty * (ingMap[ing] || 0);
                    lines[ing] = `${totalQty} ${cfg.unit}`;
                } else {
                    lines[ing] = `${ingMap[ing]} x`;
                }
            }
            return lines;
        };

        const renderList = (elementId, listLines) => {
            const ul = document.getElementById(elementId);
            if (!ul) return;
            ul.innerHTML = "";

            if (Object.keys(listLines).length === 0) {
                const li = document.createElement("li");
                li.innerHTML = '<span class="item-name">—</span><span class="item-qty"></span>';
                ul.appendChild(li);
                return;
            }

            for (const [ing, qty] of Object.entries(listLines)) {
                const li = document.createElement("li");
                li.innerHTML = `<span class="item-name">${ing}</span><span class="item-qty">${qty}</span>`;
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
    setupProteinSelector() {
        const checkboxes = document.querySelectorAll(".protein-checkbox");
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    CONFIG.selectedProteins.add(checkbox.value);
                } else {
                    CONFIG.selectedProteins.delete(checkbox.value);
                }
                this.refreshAllMeals();
                UI.updateIngredientsAndProteins();
            });
        });
    },

    refreshAllMeals() {
        const mealSections = document.querySelectorAll(".meal-section");
        mealSections.forEach(section => {
            const mealType = section.dataset.mealType;
            const availableMeals = UI.getOptionByMealType(mealType);

            if (availableMeals.length === 0) {
                const mealLabel = CONFIG.mealTypeLabels[mealType] || mealType;
                NOTIFY.warning(`Não temos opção de ${mealLabel} com as proteínas selecionadas.`);
                return;
            }

            const dayCards = Array.from(section.querySelectorAll(".day-card"));
            dayCards.forEach((card, idx) => {
                const currentMeal = STATE.getMeal(mealType, idx);
                const mealTextEl = card.querySelector(".day-meal");

                if (!currentMeal || !availableMeals.some(m => m.name === currentMeal.name)) {
                    const randomMeal = UTILS.randomChoice(availableMeals);
                    STATE.setMeal(mealType, idx, randomMeal);
                    mealTextEl.textContent = randomMeal.name;
                }
            });
        });
    },

    setupEventListeners() {
        const mealSections = document.querySelectorAll(".meal-section");
        mealSections.forEach(section => {
            const mealType = section.dataset.mealType;
            const dayCards = section.querySelectorAll(".day-card");

            dayCards.forEach((card, idx) => {
                const mealTextEl = card.querySelector(".day-meal");
                const swapBtn = card.querySelector(".swap-btn");

                const foundPool = UI.getOptionByMealType(mealType);
                if (foundPool.length === 0) return;

                const displayedText = mealTextEl.textContent.trim();
                let opt = UTILS.findOptionByName(displayedText, foundPool) || UTILS.randomChoice(foundPool);

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

    async initialize() {
        await LOADER.initialize();
        this.setupProteinSelector();
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
