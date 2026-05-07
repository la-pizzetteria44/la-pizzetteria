export function initFilters(root: HTMLElement) {
  const section = root.id; // 👈 clé magique
    const items = root.querySelectorAll<HTMLElement>(".items-list__item");
  const params = new URLSearchParams(window.location.search);

  const state = {
    category: params.get(`${section}_category`) || "all",
    tag: params.get(`${section}_tag`) || "all"
  };

  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]");

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

function updateURL(state: any, section: string) {
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