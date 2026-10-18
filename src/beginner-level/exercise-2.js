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
intro("Cobro de parqueadero");

const hoursStr = await text({
  message: "¿Cuántas horas estuvo estacionado el vehículo en las instalaciones?:",
  placeholder: "Ej. 3 o 1",
  validate: (value) => {
    const num = Number(value);

    // Comprueba si está vacío, si no es un número o si no es un entero
    if (!value || Number.isNaN(num) || !Number.isInteger(num))
      return "Necesitamos un número entero válido de horas.";

    if (num < 0) return "El tiempo de estancia no puede ser negativo.";
  },
});

if (isCancel(hoursStr)) {
  cancel("Operación cancelada por el usuario.");
  process.exit(0);
}


const isCoder = await confirm({
  message: "¿Haces parte de la comunidad de coders de Riwi?:",
  initialValue: true, // Opción por defecto (Sí)
});

if (isCancel(isCoder)) {
  cancel("Operación cancelada por el usuario.");
  process.exit(0);
}

const hours = Number(hoursStr);

const baseFee = 3_000;
const additionalHourlyRate = 2_000;
const discount = 1 - 0.15;

log.step("Calculando tarifa óptima y beneficios...");

if (hours <= 0) {
  outro("El tiempo registrado es de 0 horas. No se genera ningún cobro.");
} else if (hours === 1) {
  const finalPayment = isCoder ? baseFee * discount : baseFee;

  if (isCoder) {
    log.info("Descuento de coder aplicado exitosamente");
  }

  outro(`Tienes que pagar $${finalPayment}`);
} else {
  const overtime = hours - 1;
  const additionalFee = overtime * additionalHourlyRate;
  const calculatedPayment = baseFee + additionalFee;

  if (isCoder) {
    log.info("Descuento de coder aplicado exitosamente");
  }

  // Si el cálculo supera el tope de 20.000, se cobra el tope de 20.000,
  // de lo contrario se cobra el valor calculado.
  const payment = calculatedPayment >= 20_000 ? 20_000 : calculatedPayment;
  const finalPayment = isCoder ? payment * discount : payment;

  outro(`Tienes que pagar $${finalPayment}`);
}
