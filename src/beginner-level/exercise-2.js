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

console.clear();
intro("Cálculo del cobro del parqueadero");

const parkedHoursInput = await text({
  message: "¿Cuántas horas estuvo estacionado el vehículo?",
  placeholder: "Ej. 3",
  validate: (value) => {
    const hours = Number(value);

    // Comprueba si está vacío, si no es un número o si no es un entero
    if (!value?.trim() || Number.isNaN(hours) || !Number.isInteger(hours)) {
      return "Ingresa un número entero de horas (por ejemplo, 3).";
    }

    if (hours < 0) return "El tiempo de estacionamiento no puede ser negativo.";
  },
});

if (isCancel(parkedHoursInput)) {
  cancel("Cobro de parqueadero cancelado.");
  process.exit(0);
}

const isRiwiCoder = await confirm({
  message: "¿Eres coder de la comunidad de Riwi?",
  initialValue: true, // Opción por defecto (Sí)
});

if (isCancel(isRiwiCoder)) {
  cancel("Cobro de parqueadero cancelado.");
  process.exit(0);
}

const parkedHours = Number(parkedHoursInput);

const FIRST_HOUR_FEE = 3_000;
const ADDITIONAL_HOUR_FEE = 2_000;
const MAX_PARKING_FEE = 20_000;
const RIWI_CODER_DISCOUNT_FACTOR = 0.85; // 1 - 0.15

log.step("Calculando el costo total del parqueadero...");

if (parkedHours <= 0) {
  outro("El tiempo registrado es de 0 horas. No se genera ningún cobro.");
} else {
  // Primera hora a tarifa base y cada hora adicional a la tarifa adicional.
  const subtotal = FIRST_HOUR_FEE + (parkedHours - 1) * ADDITIONAL_HOUR_FEE;

  // Si el subtotal supera el tope, se cobra el tope.
  const cappedSubtotal = Math.min(subtotal, MAX_PARKING_FEE);

  const totalToPay = isRiwiCoder
    ? cappedSubtotal * RIWI_CODER_DISCOUNT_FACTOR
    : cappedSubtotal;

  if (isRiwiCoder) {
    log.info("Descuento de coder de Riwi aplicado (15 %)");
  }

  outro(`Total a pagar: $${totalToPay}`);
}
