/**
 * ┌──────────────────────────────────────────────────────────┐
 * │                        RIWICODER                         │
 * └──────────────────────────────────────────────────────────┘
 *
 * Descripción:
 *   Implementa una versión del clásico FizzBuzz para practicar
 *   ciclos, condicionales y el operador módulo (%).
 *
 * Instrucciones:
 *   1. Solicitar al usuario un número entero N.
 *
 *   2. Recorrer los números desde 1 hasta N, inclusive.
 *
 *   3. Evaluar cada número según las siguientes condiciones:
 *      • Múltiplo de 3 y 5 → Mostrar "RiwiCoder".
 *      • Múltiplo de 3     → Mostrar "Riwi".
 *      • Múltiplo de 5     → Mostrar "Coder".
 *      • En cualquier otro caso, mostrar el número.
 *
 *   4. Mostrar cada resultado en una línea diferente.
 *
 * Nota:
 *   La condición de múltiplos de 3 y 5 debe evaluarse primero
 *   para evitar que sea reemplazada por las condiciones
 *   individuales.
 *
 */

import { cancel, intro, isCancel, outro, text } from "@clack/prompts";

console.clear(); // Limpiamos la consola para que la interacción se vea ordenada
intro("Secuencia RiwiCoder"); // intro() para mostrar el título del programa

// pedimos un dato al usuario y lo devuelve como texto (string)
const limitInput = await text({
  message: "¿Hasta qué número quieres generar la secuencia?",
  placeholder: "Ej. 15",
  // validate() se ejecuta mientras el usuario escribe: si devuelve un texto,
  // se muestra como error y no lo deja continuar con ese valor
  validate: (value) => {
    const limit = Number(value);

    // value?.trim() quita los espacios; si queda vacío o no es un número, es inválido
    if (!value?.trim() || Number.isNaN(limit) || !Number.isInteger(limit)) {
      return "Ingresa un número entero válido (por ejemplo, 15).";
    }

    if (limit <= 0) return "El número debe ser mayor que 0.";
  },
});

// Validamos si el usuario no canceló la entrada
if (isCancel(limitInput)) {
  cancel("Generación de la secuencia cancelada.");
  process.exit(0); // Terminamos el programa.
}

const limit = Number(limitInput);
const results = []; // lista con cada resultado

// recorremos del 1 hasta el límite y guardamos cada resultado
for (let currentNumber = 1; currentNumber <= limit; currentNumber++) {
  // el símbolo % da el resto de una división: si es 0, el número es múltiplo
  if (currentNumber % 3 === 0 && currentNumber % 5 === 0) {
    results.push("RiwiCoder"); // de 3 y de 5 a la vez
  } else if (currentNumber % 3 === 0) {
    results.push("Riwi"); // de 3
  } else if (currentNumber % 5 === 0) {
    results.push("Coder"); // de 5
  } else {
    results.push(String(currentNumber)); // si no es múltiplo, mostramos el número
  }
}

// mostramos un resultado por línea
outro(results.join("\n"));
