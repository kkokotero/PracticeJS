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

console.clear();
intro("Clasificador de temperatura");

const temperatureStr = await text({
  message: "¿Cuál es la temperatura actual en grados Celsius (°C)?:",
  placeholder: "21 °C",
  defaultValue: "",
  validate: (value) => {
    if (!value || Number.isNaN(Number(value))) {
      return "Por favor, ingresa un valor numérico válido (ej. 22 o -4).";
    }
  },
});

if (isCancel(temperatureStr)) {
  cancel("Consulta de temperatura cancelada.");
  process.exit(0);
}

const temperature = Number(temperatureStr);

if (temperature < 10) {
  outro("Hace frío, lleva chaqueta");
} else if (temperature >= 10 && temperature <= 24) {
  outro("Clima templado");
} else {
  outro("Hace calor, hidrátate");
}
