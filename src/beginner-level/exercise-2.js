/**
 * ┌──────────────────────────────────────────────────────────┐
 * │                  COBRO DEL PARQUEADERO                   │
 * └──────────────────────────────────────────────────────────┘
 *
 * Descripción:
 *   Calcula el costo del parqueadero según las horas de
 *   estacionamiento y aplica descuentos para coders de Riwi.
 *
 * Instrucciones:
 *   1. Solicitar al usuario:
 *      • El número de horas estacionado.
 *      • Si es coder de Riwi (sí / no).
 *
 *   2. Calcular el costo del estacionamiento:
 *      • Primera hora       → $3.000.
 *      • Cada hora adicional → $2.000.
 *
 *   3. Aplicar la tarifa máxima:
 *      • Si el total supera $20.000, cobrar $20.000.
 *
 *   4. Aplicar el descuento:
 *      • Si es coder de Riwi, descontar el 15 % del
 *        valor final.
 *
 *   5. Mostrar el total a pagar.
 *
 */

import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  outro,
  text,
} from "@clack/prompts";

console.clear(); // Limpiamos la consola para que la interacción se vea ordenada
intro("Cálculo del cobro del parqueadero"); // intro() para mostrar el título del programa

// pedimos las horas al usuario; siempre llega como texto (string)
const parkedHoursInput = await text({
  message: "¿Cuántas horas estuvo estacionado el vehículo?",
  placeholder: "Ej. 3",
  // validate() se ejecuta mientras el usuario escribe: si devuelve un texto,
  // se muestra como error y no lo deja continuar con ese valor
  validate: (value) => {
    const hours = Number(value);

    // value?.trim() quita los espacios; si queda vacío o no es un número, es inválido
    if (!value?.trim() || Number.isNaN(hours) || !Number.isInteger(hours)) {
      return "Ingresa un número entero de horas (por ejemplo, 3).";
    }

    if (hours < 0) return "El tiempo de estacionamiento no puede ser negativo.";
  },
});

// Validamos si el usuario no canceló la entrada
if (isCancel(parkedHoursInput)) {
  cancel("Cobro de parqueadero cancelado.");
  process.exit(0); // Terminamos el programa.
}

// preguntamos si es coder de la comunidad de Riwi
const isRiwiCoder = await confirm({
  message: "¿Eres coder de la comunidad de Riwi?",
  initialValue: true, // La opción "Sí" queda marcada por defecto.
});

// Validamos si el usuario no canceló la entrada
if (isCancel(isRiwiCoder)) {
  cancel("Cobro de parqueadero cancelado.");
  process.exit(0); // Terminamos el programa.
}

const parkedHours = Number(parkedHoursInput);

// precios y porcentaje de descuento para coders
const FIRST_HOUR_FEE = 3_000;
const ADDITIONAL_HOUR_FEE = 2_000;
const MAX_PARKING_FEE = 20_000;
const RIWI_CODER_DISCOUNT_FACTOR = 0.85; // 0,85 es lo mismo que quitar el 15 %

// da formato de pesos colombianos al número (ej. $ 2.550)
const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

log.step("Calculando el costo total del parqueadero...");

if (parkedHours <= 0) {
  outro("El tiempo registrado es de 0 horas. No se genera ningún cobro.");
} else {
  // primera hora a $3.000 y cada hora extra a $2.000, sin pasar de $20.000
  const subtotal = FIRST_HOUR_FEE + (parkedHours - 1) * ADDITIONAL_HOUR_FEE;
  const cappedSubtotal = Math.min(subtotal, MAX_PARKING_FEE);

  // si es coder, aplicamos el descuento del 15 %
  const totalToPay = isRiwiCoder
    ? cappedSubtotal * RIWI_CODER_DISCOUNT_FACTOR
    : cappedSubtotal;

  if (isRiwiCoder) {
    log.info("Descuento de coder de Riwi aplicado (15 %)");
  }

  outro(`Total a pagar: ${currencyFormatter.format(totalToPay)}`);
}
