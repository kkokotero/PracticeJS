/**
 * ┌──────────────────────────────────────────────────────────┐
 * │              CUENTA REGRESIVA DE LANZAMIENTO             │
 * └──────────────────────────────────────────────────────────┘
 *
 * Descripción:
 *   Realiza una cuenta regresiva en consola para simular
 *   el lanzamiento de un proyecto.
 *
 * Instrucciones:
 *   1. Solicitar al usuario un número entero N.
 *
 *   2. Validar el número ingresado:
 *      • Si N es menor o igual a 0, mostrar:
 *        "Número no válido".
 *
 *   3. Si el número es válido:
 *      • Mostrar los números desde N hasta 1.
 *      • Imprimir cada número en una línea diferente.
 *
 *   4. Al finalizar la cuenta regresiva, mostrar:
 *      "¡Despegue!".
 *
 */

import { cancel, intro, isCancel, log, outro, text } from "@clack/prompts";

console.clear();
intro("Cuenta regresiva para el lanzamiento");

const secondsInput = await text({
  message: "¿Desde qué número comienza la cuenta regresiva?",
  placeholder: "Ej. 5",
  validate: (value) => {
    const seconds = Number(value);

    if (!value?.trim() || Number.isNaN(seconds) || !Number.isInteger(seconds)) {
      return "Ingresa un número entero válido (por ejemplo, 5).";
    }

    if (seconds <= 0) return "El número debe ser mayor que 0.";
  },
});

if (isCancel(secondsInput)) {
  cancel("Cuenta regresiva cancelada.");
  process.exit(0);
}

const totalSeconds = Number(secondsInput);

for (let secondsLeft = totalSeconds; secondsLeft > 0; secondsLeft--) {
  log.step(`${secondsLeft} segundos restantes...`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

outro("¡Despegue!");
