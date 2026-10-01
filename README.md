# Gastito

App de gastos (en construcción) pensada para portfolio: navegación, persistencia local, API, notificaciones e IA. Este repo arranca por el diferencial: **una mini librería de UI con Storybook**.

## Mini librería (`src/ui`)

Primitivos reutilizables con tokens centralizados (`theme`) y stories:

- `Text`
- `Button` (primary, secondary, ghost, loading, disabled)
- `TextField` (label, error, teclado numérico)
- `Card`
- `Chip`

Gastito va a importar desde `@/ui`. Todavía no hay pantallas de gastos.

## Cómo ver los componentes

```bash
npm install
npm run storybook
```

Abrí [http://localhost:6006](http://localhost:6006). No hace falta emulador: Storybook corre en el navegador con React Native Web.

Expo queda listo para más adelante (`npm start`).

## Por qué está separado

Las stories documentan estados (loading, error, disabled) antes de armar flujos de producto. La app va a ser un consumidor de esta librería, no al revés.
