import { initFilters } from './filterEngine';

document.querySelectorAll('[data-menu]').forEach((root) => {
  initFilters(root as HTMLElement);
});