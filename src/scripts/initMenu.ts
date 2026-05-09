import { initFilters } from './filterEngine';

const menus = document.querySelectorAll('[data-menu]');

if (menus.length) {
  menus.forEach((root) => {
    initFilters(root as HTMLElement);
  });
}