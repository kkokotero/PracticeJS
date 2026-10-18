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

console.clear(); // Limpiamos la consola para que la interacción se vea ordenada
intro("Cuenta regresiva para el lanzamiento"); // intro() para mostrar el título del programa

// pedimos un dato al usuario y lo devuelve como texto (string)
const secondsInput = await text({
  message: "¿Desde qué número comienza la cuenta regresiva?",
  placeholder: "Ej. 5",
  // validate() se ejecuta mientras el usuario escribe: si devuelve un texto,
  // se muestra como error y no lo deja continuar con ese valor
  validate: (value) => {
    const seconds = Number(value);

    // value?.trim() quita los espacios; si queda vacío o no es un número, es inválido
    if (!value?.trim() || Number.isNaN(seconds) || !Number.isInteger(seconds)) {
      return "Ingresa un número entero válido (por ejemplo, 5).";
    }

    if (seconds <= 0) return "El número debe ser mayor que 0.";
  },
});

// Validamos si el usuario no canceló la entrada
if (isCancel(secondsInput)) {
  cancel("Cuenta regresiva cancelada.");
  process.exit(0); // Terminamos el programa.
}

const totalSeconds = Number(secondsInput);

// contamos hacia atrás, esperando un segundo entre cada número
for (let secondsLeft = totalSeconds; secondsLeft > 0; secondsLeft--) {
  log.step(`${secondsLeft} segundos restantes...`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

outro("¡Despegue!");
