/**
 * ┌──────────────────────────────────────────────────────────┐
 * │               CLASIFICADOR DE TEMPERATURA                │
 * └──────────────────────────────────────────────────────────┘
 *
 * Descripción:
 *   Clasifica la temperatura del día y muestra un mensaje
 *   según las condiciones climáticas.
 *
 * Instrucciones:
 *   1. Solicitar al usuario la temperatura en grados Celsius.
 *   2. Evaluar la temperatura ingresada:
 *
 *      • Menor a 10 °C  → "Hace frío, lleva chaqueta".
 *      • De 10 a 24 °C  → "Clima templado".
 *      • 25 °C o más    → "Hace calor, hidrátate".
 *
 *   3. Si el valor ingresado no es un número válido,
 *      mostrar un mensaje de error.
 *
 */

import { cancel, intro, isCancel, outro, text } from "@clack/prompts";

console.clear(); // Limpiamos la consola para que la interacción se vea ordenada
intro("Clasificador de temperatura"); // intro() para mostrar el título del programa

// pedimos un dato al usuario y lo devuelve como texto (string)
const temperatureInput = await text({
  message: "¿Cuál es la temperatura actual en grados Celsius (°C)?",
  placeholder: "Ej. 21",
  // validate() se ejecuta mientras el usuario escribe: si devuelve un texto,
  // se muestra como error y no lo deja continuar con ese valor
  validate: (value) => {
    // value?.trim() quita los espacios; si queda vacío o no es un número, es inválido
    if (!value?.trim() || Number.isNaN(Number(value))) {
      return "Ingresa un valor numérico válido (por ejemplo, 22 o -4).";
    }
  },
});

// Validamos si el usuario no canceló la entrada
if (isCancel(temperatureInput)) {
  cancel("Consulta de temperatura cancelada.");
  process.exit(0); // Terminamos el programa.
}

// Convertimos el texto a número para poder compararlo con < y >=
const temperatureCelsius = Number(temperatureInput);

// Clasificamos la temperatura
if (temperatureCelsius < 10) {
  outro("Hace frío, lleva chaqueta");
} else if (temperatureCelsius < 25) {
  outro("Clima templado");
} else {
  outro("Hace calor, hidrátate");
}
