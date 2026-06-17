/*
  Este archivo contiene funciones de búsqueda para colecciones.
  Vamos a implementar dos tipos de búsqueda:

  1. Búsqueda lineal:
     Recorre el array desde el principio hasta el final.
     Es útil cuando el array NO está ordenado.

  2. Búsqueda binaria:
     Divide el array en mitades.
     Es más rápida, pero solo funciona correctamente si el array está ordenado.
*/
/*
  Tipo auxiliar para limitar los valores que podemos comparar.
  La búsqueda binaria necesita comparar valores usando mayor que y menor que.
  Por eso permitimos strings y numbers.

*/
type SearchValue = string | number;

/*
  Búsqueda lineal.
*/
export function linearSearch<T>(
  items: T[],
  condition: (item: T) => boolean
): T | undefined {
  return items.find(condition);
}
/*
  Búsqueda lineal que devuelve la posición del elemento.
*/
export function linearSearchIndex<T>(
  items: T[],
  condition: (item: T) => boolean
): number {
  return items.findIndex(condition);
}
/*
  Función auxiliar para comparar dos valores.
*/
function compareValues(valueA: SearchValue, valueB: SearchValue): number {
  if (valueA < valueB) {
    return -1;
  }
  if (valueA > valueB) {
    return 1;
  }
  return 0;
}
/*
  Búsqueda binaria.
  Importante:
  Esta función solo funciona correctamente si el array está ordenado
  por el mismo valor que estamos buscando.
*/
export function binarySearch<T>(
  items: T[],
  getValue: (item: T) => SearchValue,
  target: SearchValue
): T | undefined {
  let left = 0;
  let right = items.length - 1;
  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const currentItem = items[middle];
    const currentValue = getValue(currentItem);
    const comparison = compareValues(currentValue, target);
    if (comparison === 0) {
      return currentItem;
    }
    if (comparison < 0) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }
  return undefined;
}
/*
  Búsqueda binaria que devuelve la posición del elemento.
  Funciona igual que binarySearch, pero devuelve el índice
  en lugar del objeto completo.
*/
export function binarySearchIndex<T>(
  items: T[],
  getValue: (item: T) => SearchValue,
  target: SearchValue
): number {
  let left = 0;
  let right = items.length - 1;
  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const currentItem = items[middle];
    const currentValue = getValue(currentItem);
    const comparison = compareValues(currentValue, target);

    if (comparison === 0) {
      return middle;
    }

    if (comparison < 0) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }
  return -1;
}