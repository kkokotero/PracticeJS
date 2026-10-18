/**
 * ┌──────────────────────────────────────────────────────────┐
 * │                     ADIVINA EL NÚMERO                    │
 * └──────────────────────────────────────────────────────────┘
 *
 * Descripción:
 *   Implementa un juego en el que el usuario debe adivinar
 *   un número secreto entre 1 y 20.
 *
 * Instrucciones:
 *   1. Definir una variable con el número secreto.
 *
 *   2. Solicitar al usuario que ingrese un número entre 1 y 20.
 *
 *   3. Comparar el número ingresado con el número secreto:
 *      • Si el secreto es mayor, indicar que es más alto.
 *      • Si el secreto es menor, indicar que es más bajo.
 *      • Si ambos números coinciden, el usuario gana.
 *
 *   4. Repetir el proceso hasta que:
 *      • El usuario adivine el número secreto.
 *      • Se agoten los 5 intentos disponibles.
 *
 *   5. Mostrar el resultado final:
 *      • Si acierta: "¡Ganaste en X intentos!".
 *      • Si pierde:  "Perdiste, el número era X".
 *
 */

import { cancel, intro, isCancel, log, outro, text } from "@clack/prompts";

const MAX_ATTEMPTS = 5;
const secretNumber = Math.floor(Math.random() * 20) + 1;

let hasUserWon = false;

// Rango de valores posibles para el número secreto.
// Se estrecha después de cada intento fallido.
let minPossible = 1;
let maxPossible = 20;

console.clear();
intro("Adivina el número secreto");

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  console.clear();

  log.info(`El número secreto está entre ${minPossible} y ${maxPossible}`, {
    spacing: 0,
  });
  log.step(`Intento número ${attempt} de ${MAX_ATTEMPTS}`);

  const guessInput = await text({
    message: "¿Cuál crees que es el número secreto?",
    placeholder: "Ej. 10",
    validate: (value) => {
      const guess = Number(value);

      if (!value?.trim() || Number.isNaN(guess) || !Number.isInteger(guess)) {
        return "Ingresa un número entero válido (por ejemplo, 10).";
      }

      if (guess < minPossible || guess > maxPossible) {
        return `El número debe estar entre ${minPossible} y ${maxPossible}.`;
      }
    },
  });

  if (isCancel(guessInput)) {
    cancel("Juego cancelado.");
    process.exit(0);
  }

  const userGuess = Number(guessInput);

  if (userGuess === secretNumber) {
    hasUserWon = true;
    outro(`¡Ganaste en ${attempt} ${attempt === 1 ? "intento" : "intentos"}!`);
    break;
  }

  if (userGuess < secretNumber) {
    log.message("El número secreto es mayor. Intenta de nuevo.");
    // Limitamos por abajo: el secreto no puede ser menor a lo ya intentado.
    minPossible = userGuess + 1;
  } else {
    log.message("El número secreto es menor. Intenta de nuevo.");
    // Limitamos por arriba: el secreto no puede ser mayor a lo ya intentado.
    maxPossible = userGuess - 1;
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));
}

if (!hasUserWon) {
  outro(`Perdiste, el número era ${secretNumber}`);
}
