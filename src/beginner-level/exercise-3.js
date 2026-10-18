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


import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  text,
} from "@clack/prompts";

console.clear();
intro("Cuenta regresiva de lanzamiento");

const userNumberStr = await text({
  message: "Ingresa un número:",
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

for (let i = userNumber; i > 0; i--) {
  log.step(`${i} segundos restantes...`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

outro("¡Despegue!");
