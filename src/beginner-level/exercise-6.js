/**
 * ┌──────────────────────────────────────────────────────────┐
 * │              VALIDAR UNA CONTRASEÑA SEGURA               │
 * └──────────────────────────────────────────────────────────┘
 *
 * Descripción:
 *   Verifica la seguridad de una contraseña mediante la
 *   validación de su longitud, números y letras mayúsculas.
 *
 * Instrucciones:
 *   1. Solicitar al usuario una contraseña.
 *
 *   2. Recorrer la cadena carácter por carácter mediante
 *      un ciclo para identificar y contar:
 *      • Números.
 *      • Letras mayúsculas.
 *
 *   3. Validar las siguientes reglas de seguridad:
 *      • Longitud mínima de 8 caracteres.
 *      • Al menos un número.
 *      • Al menos una letra mayúscula.
 *
 *   4. Mostrar el resultado de la validación:
 *      • Si cumple todas las reglas, mostrar:
 *        "Contraseña segura".
 *      • Si no cumple alguna regla, indicar cuáles debe
 *        corregir.
 *
 */

import { cancel, intro, isCancel, log, outro, text } from "@clack/prompts";

const MIN_PASSWORD_LENGTH = 8; // mínimo de caracteres que debe tener

console.clear(); // Limpiamos la consola para que la interacción se vea ordenada
intro("Validador de contraseña segura"); // intro() para mostrar el título del programa

// pedimos la contraseña al usuario; siempre llega como texto (string)
const passwordInput = await text({
  message: "Ingresa la contraseña que quieres validar:",
  placeholder: "Ej. Asd.123*",
});

// Validamos si el usuario no canceló la entrada
if (isCancel(passwordInput)) {
  cancel("Validación de contraseña cancelada.");
  process.exit(0); // Terminamos el programa.
}

let digitCount = 0; // cantidad de números
let uppercaseCount = 0; // cantidad de mayúsculas

// revisamos la contraseña carácter por carácter y contamos
for (const currentCharacter of passwordInput) {
  if (/^[0-9]$/.test(currentCharacter)) {
    digitCount++; // es un número del 0 al 9
    continue;
  }

  if (/^[A-Z]$/.test(currentCharacter)) {
    uppercaseCount++; // es una letra mayúscula
  }
}

// revisamos las tres reglas: longitud, un número y una mayúscula
const hasMinLength = passwordInput.length >= MIN_PASSWORD_LENGTH;
const hasDigit = digitCount > 0;
const hasUppercase = uppercaseCount > 0;

if (hasMinLength && hasDigit && hasUppercase) {
  outro("Contraseña segura");
} else {
  // avisamos qué reglas le faltan
  if (!hasDigit) {
    log.warning("La contraseña debe incluir al menos un número.");
  }

  if (!hasUppercase) {
    log.warning("La contraseña debe incluir al menos una letra mayúscula.");
  }

  if (!hasMinLength) {
    log.warning(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres (tiene ${passwordInput.length}).`,
    );
  }

  outro("Contraseña insegura");
}
