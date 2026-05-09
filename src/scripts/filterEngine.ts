export function initFilters(root: HTMLElement) {
  const section = root.id; // 👈 clé magique
    const items = root.querySelectorAll<HTMLElement>(".items-list__item");
  const params = new URLSearchParams(window.location.search);

  const state = {
    category: params.get(`${section}_category`) || "all",
    tag: params.get(`${section}_tag`) || "all",
    base: "all"
  };

  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]");
  const baseSelect = root.querySelector("#base-filter");

    if (baseSelect) {
    baseSelect.addEventListener("change", () => {
        state.base = baseSelect.value;
        applyFilters(root, items, state);
    });
    }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter!;
        console.log("Clicked filter:", filter);
      const isCategory = button.closest(".filters-main");

      if (isCategory) {
        state.category = filter;
        state.tag = "all";
      } else {
        state.tag = state.tag === filter ? "all" : filter;
      }

      updateURL(state, section);
      updateUI(root, state);
      applyFilters(root, items, state);
    });
  });

  // 🔥 init au chargement
  updateUI(root, state);
  applyFilters(root, items, state);
}

// ---------------------

function applyFilters(  root: HTMLElement,
  items: NodeListOf<HTMLElement>,
  state: any) {
    let visibleCount = 0;
    const filter = normalize(state.tag);
    items.forEach(item => {
        const tags = item.dataset.tags?.split(",").map((t) => normalize(t)) ?? [];
        const category = item.dataset.category;

    let show = true;

    if (state.base && state.base !== "all") {
        const base = item.dataset.base;

        // 👉 ignore les items sans base (boissons etc)
        if (base && base !== "none") {
            show = show && base === state.base;
        }
    }
        
    if (state.category !== "all") {
      show = show && category === state.category;
    }

    if (state.tag !== "all") {
      show = show && tags.includes(filter);
    }

    item.style.display = show ? "flex" : "none";
    if (show) visibleCount++;
  });
  const noResults = root.querySelector(".no-results");
  if (noResults) {
    (noResults as HTMLElement).hidden = visibleCount > 0;
  }
}

// ---------------------

function updateUI(root: HTMLElement, state: any) {
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]");

  buttons.forEach(btn => {
    btn.classList.remove("active");

    const filter = btn.dataset.filter!;
    const isCategory = btn.closest(".filters-main");

    if (
      (isCategory && state.category === filter) ||
      (!isCategory && state.tag === filter)
    ) {
      btn.classList.add("active");
    }
  });
}

// ---------------------

function updateURL(state: any, section: string, hasBaseFilter = false) {
  const params = new URLSearchParams(window.location.search);

  if (state.category !== "all") {
    params.set(`${section}_category`, state.category);
  } else {
    params.delete(`${section}_category`);
  }

  if (state.tag !== "all") {
    params.set(`${section}_tag`, state.tag);
  } else {
    params.delete(`${section}_tag`);
  }

  if (hasBaseFilter && state.base !== "all") {
    params.set(`${section}_base`, state.base);
  } else {
    params.delete(`${section}_base`);
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}


function normalize(str: string) {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
//  V1
// export function initFilters(root: HTMLElement) {
//   const section = root.id; // 👈 clé magique
//   const items = root.querySelectorAll<HTMLElement>(".items-list__item");
//   const params = new URLSearchParams(window.location.search);

//   const state = {
//     category: params.get(`${section}_category`) || "all",
//     tag: params.get(`${section}_tag`) || "all",
//     base: params.get(`${section}_base`) || "all"
//   };

//   const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]");

//   // ---------------------
//   // 🎯 Gestion des boutons (catégorie + tag)
//   // ---------------------
//   buttons.forEach(button => {
//     button.addEventListener("click", () => {
//       const filter = button.dataset.filter!;
//       const isCategory = button.closest(".filters-main");

//       if (isCategory) {
//         state.category = filter;
//         state.tag = "all";
//       } else {
//         state.tag = state.tag === filter ? "all" : filter;
//       }

//       updateURL(state, section);
//       updateUI(root, state);
//       applyFilters(root, items, state);
//     });
//   });

//   // ---------------------
//   // 🆕 Gestion du SELECT (base)
//   // ---------------------
//   const baseSelect = root.querySelector<HTMLSelectElement>("#base-filter");

//   if (baseSelect) {
//     baseSelect.value = state.base;

//     baseSelect.addEventListener("change", () => {
//       state.base = baseSelect.value;

//       updateURL(state, section);
//       applyFilters(root, items, state);
//     });
//   }

//   // ---------------------
//   // 🚀 Init au chargement
//   // ---------------------
//   updateUI(root, state);
//   applyFilters(root, items, state);
// }


// function applyFilters(
//   root: HTMLElement,
//   items: NodeListOf<HTMLElement>,
//   state: any
// ) {
//   let visibleCount = 0;
//   const filter = normalize(state.tag);

//   items.forEach(item => {
//     const tags =
//       item.dataset.tags?.split(",").map(t => normalize(t)) ?? [];
//     const category = item.dataset.category;
//     const base = item.dataset.base;

//     let show = true;

//     if (state.category !== "all") {
//       show = show && category === state.category;
//     }

//     if (state.tag !== "all") {
//       show = show && tags.includes(filter);
//     }

//     if (state.base !== "all") {
//       show = show && base === state.base;
//     }

//     item.style.display = show ? "flex" : "none";
//     if (show) visibleCount++;
//   });

//   const noResults = root.querySelector(".no-results");
//   if (noResults) {
//     (noResults as HTMLElement).hidden = visibleCount > 0;
//   }
// }


// function updateUI(root: HTMLElement, state: any) {
//   const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]");

//   buttons.forEach(btn => {
//     btn.classList.remove("active");

//     const filter = btn.dataset.filter!;
//     const isCategory = btn.closest(".filters-main");

//     if (
//       (isCategory && state.category === filter) ||
//       (!isCategory && state.tag === filter)
//     ) {
//       btn.classList.add("active");
//     }
//   });
// }

// // ---------------------

// function updateURL(state: any, section: string) {
//   const params = new URLSearchParams(window.location.search);

//   if (state.category !== "all") {
//     params.set(`${section}_category`, state.category);
//   } else {
//     params.delete(`${section}_category`);
//   }

//   if (state.tag !== "all") {
//     params.set(`${section}_tag`, state.tag);
//   } else {
//     params.delete(`${section}_tag`);
//   }

//   if (state.base !== "all") {
//     params.set(`${section}_base`, state.base);
//   } else {
//     params.delete(`${section}_base`);
//   }

//   const query = params.toString();
//   const newUrl = query
//     ? `${window.location.pathname}?${query}`
//     : window.location.pathname;

//   window.history.replaceState({}, "", newUrl);
// }

// // ---------------------

// function normalize(str: string) {
//   return str
//     .toLowerCase()
//     .trim()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "");
// }

// -------

// export function initFilters(root: HTMLElement) {
//   const section = root.id;
//   const items = root.querySelectorAll<HTMLElement>(".items-list__item");
//   const params = new URLSearchParams(window.location.search);

//   const state = {
//     category: params.get(`${section}_category`) || "all",
//     tag: params.get(`${section}_tag`) || "all",
//     base: params.get(`${section}_base`) || "all"
//   };

//   const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]");

//   // ---------------------
//   // 🎯 Boutons
//   // ---------------------
//   buttons.forEach(button => {
//     button.addEventListener("click", () => {
//       const filter = button.dataset.filter!;
//       const isCategory = button.closest(".filters-main");

//       if (isCategory) {
//         state.category = filter;
//         state.tag = "all";
//       } else {
//         state.tag = state.tag === filter ? "all" : filter;
//       }

//       updateURL(state, section);
//       updateUI(root, state);
//       applyFilters(root, items, state);
//     });
//   });

//   // ---------------------
//   // 🆕 Select BASE
//   // ---------------------
//   const baseSelect = document.querySelector<HTMLSelectElement>("#base-filter");

//   if (baseSelect) {
//     state.base = state.base || "all";
//     baseSelect.value = state.base;

//     baseSelect.addEventListener("change", () => {
//       state.base = baseSelect.value;

//       updateURL(state, section);
//       applyFilters(root, items, state);
//     });
//   }

//   // ---------------------
//   // 🚀 Init
//   // ---------------------
//   updateUI(root, state);
//   applyFilters(root, items, state);
// }

// // ---------------------

// function applyFilters(
//   root: HTMLElement,
//   items: NodeListOf<HTMLElement>,
//   state: any
// ) {
//   let visibleCount = 0;
//   const filter = normalize(state.tag);

//   items.forEach(item => {
//     const tags = (item.dataset.tags || "")
//       .split(",")
//       .map(t => normalize(t));

//     const category = item.dataset.category || "all";
//     const base = item.dataset.base || "all";

//     let show = true;

//     // catégorie
//     if (state.category !== "all") {
//       show = show && category === state.category;
//     }

//     // tag
//     if (state.tag !== "all") {
//       show = show && tags.includes(filter);
//     }

//     // base
//     if (state.base !== "all") {
//       show = show && base === state.base;
//     }

//     item.style.display = show ? "" : "none";
//     if (show) visibleCount++;
//   });

//   const noResults = root.querySelector(".no-results");
//   if (noResults) {
//     (noResults as HTMLElement).hidden = visibleCount > 0;
//   }
// }

// // ---------------------

// function updateUI(root: HTMLElement, state: any) {
//   const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]");

//   buttons.forEach(btn => {
//     btn.classList.remove("active");

//     const filter = btn.dataset.filter!;
//     const isCategory = btn.closest(".filters-main");

//     if (
//       (isCategory && state.category === filter) ||
//       (!isCategory && state.tag === filter)
//     ) {
//       btn.classList.add("active");
//     }
//   });
// }

// // ---------------------

// function updateURL(state: any, section: string) {
//   const params = new URLSearchParams(window.location.search);

//   updateParam(params, `${section}_category`, state.category);
//   updateParam(params, `${section}_tag`, state.tag);
//   updateParam(params, `${section}_base`, state.base);

//   const query = params.toString();
//   const newUrl = query
//     ? `${window.location.pathname}?${query}`
//     : window.location.pathname;

//   window.history.replaceState({}, "", newUrl);
// }

// function updateParam(params: URLSearchParams, key: string, value: string) {
//   if (value && value !== "all") {
//     params.set(key, value);
//   } else {
//     params.delete(key);
//   }
// }

// // ---------------------

// function normalize(str: string) {
//   return str
//     .toLowerCase()
//     .trim()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "");
// }
