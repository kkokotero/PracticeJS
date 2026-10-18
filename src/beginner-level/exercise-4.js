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

/**
 * Devuelve la etiqueta que corresponde a un número según las
 * reglas de RiwiCoder (FizzBuzz).
 *
 * @param {number} number Número a evaluar.
 * @returns {string} "RiwiCoder", "Riwi", "Coder" o el número.
 */
function getRiwiCoderLabel(number) {
  if (number % 15 === 0) return "RiwiCoder"; // múltiplo de 3 y 5
  if (number % 3 === 0) return "Riwi"; // múltiplo de 3
  if (number % 5 === 0) return "Coder"; // múltiplo de 5

  return String(number);
}

console.clear();
intro("Secuencia RiwiCoder");

const limitInput = await text({
  message: "¿Hasta qué número quieres generar la secuencia?",
  placeholder: "Ej. 15",
  validate: (value) => {
    const limit = Number(value);

    if (!value?.trim() || Number.isNaN(limit) || !Number.isInteger(limit)) {
      return "Ingresa un número entero válido (por ejemplo, 15).";
    }

    if (limit <= 0) return "El número debe ser mayor que 0.";
  },
});

if (isCancel(limitInput)) {
  cancel("Generación de la secuencia cancelada.");
  process.exit(0);
}

const limit = Number(limitInput);
const results = [];

for (let currentNumber = 1; currentNumber <= limit; currentNumber++) {
  results.push(getRiwiCoderLabel(currentNumber));
}

outro(results.join("\n"));
