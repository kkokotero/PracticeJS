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

import {
  cancel,
  intro,
  isCancel,
  outro,
  text,
} from "@clack/prompts";

console.clear();
intro("Riwi Coder");

const userNumberStr = await text({
  message: "Ingresa un número entero positivo:",
  placeholder: "Ej. 5",
  validate: (value) => {
    const num = Number(value);

    if (!value || Number.isNaN(num) || !Number.isInteger(num))
      return "Necesitamos un número entero válido.";

    if (num <= 0) return "El numero debe ser mayor a 0.";
  },
});

if (isCancel(userNumberStr)) {
  cancel("Operación cancelada por el usuario.");
  process.exit(0);
}

const userNumber = Number(userNumberStr);
let resultSecuence = "";

for (let i = 1; i <= userNumber; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    resultSecuence += " RiwiCoder ";
    continue;
  }

  if (i % 5 === 0) {
    resultSecuence += " Coder ";
    continue;
  }

  if (i % 3 === 0) {
    resultSecuence += " Riwi ";
    continue;
  }

  resultSecuence += ` ${i} `;
}

outro(resultSecuence);
