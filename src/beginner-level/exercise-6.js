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

console.clear();
intro("Validar contraseña segura");

const userPassword = await text({
  message: `Ingresa una contraseña:`,
  placeholder: "Ej. Asd.123*",
});

if (isCancel(userPassword)) {
  cancel("Operación cancelada por el usuario.");
  process.exit(0);
}

let numberCount = 0;
let capitalLetterCount = 0;

for (const character of userPassword.split("")) {
  if (/^[0-9]$/.test(character)) {
    numberCount++;
    continue;
  }

  if (/^[A-Z]$/.test(character)) {
    capitalLetterCount++;
  }
}

if (userPassword.length >= 8 && numberCount > 0 && capitalLetterCount > 0) {
  outro("Contraseña segura");
} else {
  if (numberCount <= 0) {
    log.warning("No tienes ningun numero en la contraseña");
  }

  if (capitalLetterCount <= 0) {
    log.warning("No tienes ninguna mayuscula en la contraseña");
  }

  if (userPassword.length < 8) {
    log.warning("La contraseña debe tener mas de 8 caracteres");
  }

  outro("Contraseña insegura");
}
