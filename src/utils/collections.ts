export const pizzas = Object.values(
  import.meta.glob('../content/pizzas/*.json', { eager: true })
).map((p: any) => p.default)
 .sort((a, b) => a.name.localeCompare(b.name));

export const drinks = Object.values(
  import.meta.glob('../content/drinks/*.json', { eager: true })
).map((p: any) => p.default)
 .sort((a, b) => a.name.localeCompare(b.name));

export const desserts = Object.values(
  import.meta.glob('../content/desserts/*.json', { eager: true })
).map((p: any) => p.default)
 .sort((a, b) => a.name.localeCompare(b.name));

export const platters = Object.values(
  import.meta.glob('../content/platters/*.json', { eager: true })
).map((p: any) => p.default)
 .sort((a, b) => a.name.localeCompare(b.name));

export const specialties = Object.values(
  import.meta.glob('../content/specialties/*.json', { eager: true })
).map((p: any) => p.default)
 .sort((a, b) => a.name.localeCompare(b.name));