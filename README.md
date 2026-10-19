# PracticeJS

Colección de ejercicios de JavaScript para practicar, organizados por nivel.

---

## Requisitos

- [Node.js](https://nodejs.org/) **18 o superior** (se usan módulos ES, `import` y `await` de nivel superior).
- Instalar dependencias:

```bash
npm install
```

> El proyecto declara `"type": "module"`, así que todos los archivos `.js` son módulos ES.

---

## Nivel beginner — puntos resueltos

### 1 · Clasificador de temperatura

`src/beginner-level/exercise-1.js`

- [x] Solicita la temperatura en grados Celsius.
- [x] Valida la entrada mientras se escribe: rechaza el valor vacío y los que no son números.
- [x] Clasifica el clima:
  - Menor a 10 °C → `Hace frío, lleva chaqueta`
  - De 10 a 24 °C → `Clima templado`
  - 25 °C o más → `Hace calor, hidrátate`
- [x] Maneja la cancelación del usuario (Ctrl+C) con un mensaje y salida limpia.

### 2 · Cobro del parqueadero

`src/beginner-level/exercise-2.js`

- [x] Solicita el número de horas estacionado y si la persona es coder de Riwi.
- [x] Valida las horas: entero, no negativo y no vacío.
- [x] Calcula el cobro: primera hora `$3.000` y cada hora adicional `$2.000`.
- [x] Aplica la tarifa máxima de `$20.000`.
- [x] Aplica el descuento del `15 %` cuando la persona es coder de Riwi.
- [x] Formatea el total en pesos colombianos (`Intl.NumberFormat`).
- [x] Resuelve el caso especial de `0` horas (no genera cobro).
- [x] Maneja la cancelación en cada pregunta.

### 3 · Cuenta regresiva de lanzamiento

`src/beginner-level/exercise-3.js`

- [x] Solicita un número entero `N`.
- [x] Valida que sea entero y mayor que `0`.
- [x] Muestra la cuenta desde `N` hasta `1`, un número por línea y con un segundo de espera entre cada uno.
- [x] Al terminar, muestra `¡Despegue!`.
- [x] Maneja la cancelación de la entrada.

### 4 · RiwiCoder (FizzBuzz)

`src/beginner-level/exercise-4.js`

- [x] Solicita un número entero `N` (mayor que `0`, validado).
- [x] Recorre desde `1` hasta `N`, inclusive.
- [x] Evalúa cada número con el operador módulo (`%`):
  - Múltiplo de 3 y 5 → `RiwiCoder` (se evalúa primero para que no lo tape otra condición)
  - Múltiplo de 3 → `Riwi`
  - Múltiplo de 5 → `Coder`
  - En otro caso → el número
- [x] Muestra cada resultado en una línea diferente.
- [x] Maneja la cancelación de la entrada.

### 5 · Adivina el número

`src/beginner-level/exercise-5.js`

- [x] Define un número secreto al azar entre `1` y `20`.
- [x] Da un máximo de `5` intentos.
- [x] Valida que el intento sea un entero y que esté dentro del rango posible.
- [x] Da pistas (`El número secreto es mayor/menor`) y achica el rango con cada intento.
- [x] Si acierta, muestra `¡Ganaste en X intentos!` (con singular/plural correcto).
- [x] Si se agotan los intentos, muestra `Perdiste, el número era X`.
- [x] Maneja la cancelación durante el juego.

### 6 · Validar una contraseña segura

`src/beginner-level/exercise-6.js`

- [x] Solicita una contraseña.
- [x] Recorre la cadena carácter por carácter mediante un ciclo.
- [x] Cuenta los números y las letras mayúsculas encontradas.
- [x] Valida las tres reglas:
  - Longitud mínima de `8` caracteres
  - Al menos un número
  - Al menos una letra mayúscula
- [x] Si cumple todo, muestra `Contraseña segura`.
- [x] Si algo falta, indica exactamente qué reglas debe corregir.
- [x] Maneja la cancelación de la entrada.

### Extra · Control de Lanzamiento (experimento)

`src/beginner-level/experiments/exercise-3.js`

Versión interactiva (TUI) del ejercicio 3, hecha con [`neo-blessed`](https://www.npmjs.com/package/neo-blessed).

- [x] Diálogo para elegir el número inicial de la cuenta regresiva.
- [x] Escena con cohete ASCII, cielo, estrellas y partículas animadas.
- [x] Fases de la misión: espera → cuenta regresiva → despegue → ascenso.
- [x] Contador grande con barra de progreso en la esquina superior derecha.
- [x] Guía de teclas flotante en la esquina inferior derecha.
- [x] Teclas: `R` reiniciar, `Q` / `Esc` / `Ctrl+C` salir.
- [x] Requiere una terminal de al menos `80x24`.

---

## Convenciones del código

- Comentarios en español, pensados para quien está aprendiendo.
- Cada ejercicio pide los datos con `@clack/prompts` y valida lo que escribe el usuario antes de continuar.
- La cancelación (`isCancel`) se maneja siempre con un mensaje y `process.exit(0)`.

---

## Documentos

Los enunciados originales están en la carpeta `docs/`:

- `Ejercicios_JS_Condicionales_y_Ciclos_Nivel_Bajo.pdf` (nivel beginner)
- `Ejercicios_JS_Condicionales_y_Ciclos_Nivel_Medio.pdf`
- `Ejercicios_JS_Condicionales_y_Ciclos_Nivel_Pro.pdf`
