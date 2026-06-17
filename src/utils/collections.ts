/*
  Este archivo contiene funciones reutilizables para trabajar con colecciones.
  Una colección es, en este caso, un array de objetos.
  Por ejemplo:
  - lista de pacientes
  - lista de clínicas
  - lista de citas
  - lista de reclamaciones de facturación
  Estas funciones son genéricas.
  Eso significa que pueden funcionar con distintos tipos de datos,
  no solo con una entidad concreta de HealthCore.
*/
/*
  Filtra una colección según una condición.
*/
export function filterItems<T>(
  items: T[],
  condition: (item: T) => boolean
): T[] {
  return items.filter(condition);
}
/*
  Ordena una colección por una propiedad concreta.
*/
export function sortByProperty<T>(
  items: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    if (valueA < valueB) {
      return order === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });
}
/*
  Agrupa una colección por una propiedad.
*/
export function groupByProperty<T>(
  items: T[],
  key: keyof T
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/*
  Obtiene el primer elemento de una colección.
  Si el array está vacío, devuelve undefined.
*/
export function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

/*
  Obtiene el último elemento de una colección.
  Si el array está vacío, devuelve undefined.
*/
export function getLastItem<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}
/*
  Comprueba si una colección está vacía.
*/
export function isEmptyCollection<T>(items: T[]): boolean {
  return items.length === 0;
}