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

const MAX_ATTEMPTS = 5; // intentos disponibles

// número secreto al azar entre 1 y 20
const secretNumber = Math.floor(Math.random() * 20) + 1;

let hasUserWon = false; // nos dice si la persona ya acertó

// rango en el que puede estar el secreto (se achica con cada pista)
let minPossible = 1;
let maxPossible = 20;

console.clear(); // Limpiamos la consola para que la interacción se vea ordenada
intro("Adivina el número secreto"); // intro() para mostrar el título del programa

// damos como máximo MAX_ATTEMPTS intentos
for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  console.clear();

  log.info(`El número secreto está entre ${minPossible} y ${maxPossible}`, {
    spacing: 0,
  });
  log.step(`Intento número ${attempt} de ${MAX_ATTEMPTS}`);

  // pedimos el intento del usuario; siempre llega como texto (string)
  const guessInput = await text({
    message: "¿Cuál crees que es el número secreto?",
    placeholder: "Ej. 10",
    // validate() se ejecuta mientras el usuario escribe: si devuelve un texto,
    // se muestra como error y no lo deja continuar con ese valor
    validate: (value) => {
      const guess = Number(value);

      // value?.trim() quita los espacios; si queda vacío o no es un número, es inválido
      if (!value?.trim() || Number.isNaN(guess) || !Number.isInteger(guess)) {
        return "Ingresa un número entero válido (por ejemplo, 10).";
      }

      if (guess < minPossible || guess > maxPossible) {
        return `El número debe estar entre ${minPossible} y ${maxPossible}.`;
      }
    },
  });

  // Validamos si el usuario no canceló la entrada
  if (isCancel(guessInput)) {
    cancel("Juego cancelado.");
    process.exit(0); // Terminamos el programa.
  }

  const userGuess = Number(guessInput);

  if (userGuess === secretNumber) {
    hasUserWon = true;
    outro(`¡Ganaste en ${attempt} ${attempt === 1 ? "intento" : "intentos"}!`);
    break; // ya acertó: salimos del ciclo
  }

  // damos la pista y achicamos el rango posible
  if (userGuess < secretNumber) {
    log.message("El número secreto es mayor. Intenta de nuevo.");
    minPossible = userGuess + 1;
  } else {
    log.message("El número secreto es menor. Intenta de nuevo.");
    maxPossible = userGuess - 1;
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));
}

if (!hasUserWon) {
  outro(`Perdiste, el número era ${secretNumber}`);
}
