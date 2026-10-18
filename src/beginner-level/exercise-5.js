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

const randomNumber = Math.floor(Math.random() * 20) + 1;
const maxAttemps = 5;

let userWins = false;

// Variables para rastrear el rango dinámico
let minRange = 1;
let maxRange = 20;

console.clear();
intro("Adivina el Número");

for (let attemp = 1; attemp <= maxAttemps; attemp++) {
  console.clear();

  // Mostramos el rango dinámico actualizado después de limpiar la consola
  log.info(`El número secreto está entre ${minRange} y ${maxRange}`, {
    spacing: 0,
  });

  log.step(`Intento número ${attemp}/${maxAttemps}`);

  const userNumberStr = await text({
    message: `Ingresa un número entre ${minRange} y ${maxRange}:`,
    placeholder: "Ej. 10",
    validate: (value) => {
      const num = Number(value);

      if (!value || Number.isNaN(num) || !Number.isInteger(num))
        return "Necesitamos un número entero válido.";
    },
  });

  if (isCancel(userNumberStr)) {
    cancel("Operación cancelada por el usuario.");
    process.exit(0);
  }

  const userNumber = Number(userNumberStr);

  if (userNumber === randomNumber) {
    userWins = true;
    outro(`¡Ganaste en ${attemp} ${attemp === 1 ? "intento" : "intentos"}!`);
    break;
  }

  if (userNumber < randomNumber) {
    log.message("El número oculto es mayor");
    // Actualizamos el límite inferior del rango si el usuario se quedó corto
    if (userNumber >= minRange) {
      minRange = userNumber + 1;
    }
  } else {
    log.message("El número oculto es menor");
    // Actualizamos el límite superior del rango si el usuario se pasó
    if (userNumber <= maxRange) {
      maxRange = userNumber - 1;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));
}

if (!userWins) {
  outro(`Perdiste, el número era ${randomNumber}`);
}
