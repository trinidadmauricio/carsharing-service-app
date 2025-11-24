## App Móvil (React Native) — Plan de implementación

### Objetivo

Construir una app iOS/Android para El Salvador orientada a carsharing, enfocada en huéspedes (guests) y, gradualmente, anfitriones (hosts). El MVP contempla exploración de vehículos, reservas, pagos mediados por el servidor (sin SDK Stripe en la app), gestión de viajes y un proceso de KYC básico para ambos perfiles.

### Principios clave

- Sin SDK de Stripe en la app: todos los cobros, refunds y payouts se orquestan desde el servidor. La app solo inicia el flujo y consulta estados.
- KYC para host y guest: captura guiada (documentos/selfie), seguimiento del estado y requisitos mínimos antes de permitir acciones sensibles.
- MVP usable y claro: pantallas y copys pensados para conversión con precio total transparente y pasos mínimos.
- Accesibilidad y rendimiento: tamaños táctiles adecuados, contraste, soporte dark mode, cargas diferidas de imágenes.

### Stack técnico

- React Native con Expo, TypeScript.
- Navegación con Expo Router.
- Estado remoto con React Query (caché de requests, reintentos, invalidación por claves) y estado local de UI con Zustand (opcional).
- Almacenamiento seguro de tokens: `expo-secure-store`.
- Push Notifications: Expo Notifications (posterior a MVP si se requiere).

### Arquitectura de la app

- Capas:
  - UI (pantallas y componentes atom/molecule/organism).
  - Hooks de datos (React Query) por dominio: `useVehicles`, `useBooking`, `useAuth`, `useKyc`.
  - Servicios de API (clientes): funciones tipadas por endpoint.
  - Utilidades: formateo de precio, fechas, validaciones ligeras.
- Ruteo principal:
  - `(auth)/login`, `(auth)/register`, `(auth)/reset`.
  - `(tabs)/browse`, `(tabs)/trips`, `(tabs)/profile`.
  - `vehicle/[id]`, `booking/summary`, `booking/success`.

### Flujos principales

1. Autenticación

- Registro y login con email/contraseña. Persistencia de `accessToken` (memoria) y `refreshToken` (SecureStore).
- Renovación automática de token ante 401.

2. KYC (guest/host)

- Captura guiada: fotos de documento y selfie (con checklist y validación básica de calidad).
- Envío de evidencias al servidor; la app muestra estado: `pending`, `approved`, `rejected`.
- Bloqueo condicional de acciones (p. ej., confirmar pago o publicar vehículo) hasta `approved`.

3. Búsqueda y detalle de vehículo

- Listado con filtros: ubicación, fechas, precio, tipo.
- Detalle con galería, precio total estimado, políticas y reviews.

4. Reserva y pago (server-only)

- Selección de fechas → resumen con desglose (tarifa base, fee de servicio, impuestos si aplica).
- La app llama a `POST /payments/checkout`; el servidor crea el PaymentIntent/Checkout Session y devuelve una URL.
- Apertura en Custom Tab/SafariView o WebView controlada; al finalizar, deep link de retorno `carsharing://payment-result`.
- La app consulta `GET /bookings/:id` para estado final (confirmado/cancelado) actualizado por webhook del servidor.

5. Viajes

- Próximos y pasados, detalles, políticas de cancelación y contacto con host (chat web o redirección en MVP si aplica).

### Pantallas del MVP

- Auth: Login, Registro, Reset.
- Browse: listado + filtros; vista mapa (fase 1.1).
- Vehicle: detalle.
- Booking: fechas → resumen → pago externo → éxito.
- Trips: lista → detalle.
- Profile: datos, estado KYC, métodos y preferencias básicas.

### Investigación de UI/UX y diseño

- Benchmark Turo/Getaround/HyreCar: número de pasos, componentes críticos, copywriting y estados vacíos.
- Design tokens: color, tipografía, espaciado, radios, sombras; soporte dark mode.
- Componentes base: Button, Input, Select, DateRangePicker, Card, Sheet/BottomSheet, Toast, EmptyState.
- Accesibilidad: tamaño mínimo 44x44pt, contraste AA, etiquetas y hints para lectores de pantalla.

### Seguridad y privacidad

- No almacenar datos sensibles de pago; solo tokens/JWT en SecureStore.
- Validar origen del deep link y `state` al volver del pago.
- Sanitizar metadatos de imágenes enviadas al servidor (documentos/selfie).

### Configuración de entornos

- Variables por `app.config.ts`/`.env`: API_BASE_URL, DEEP_LINK_SCHEME, ENV (dev/stage/prod).
- Flags para features (remotas o locales) de UI experimental.

### Telemetría

- Sentry para errores, expo-analytics/Segment para eventos clave (view_item, begin_checkout, purchase, kyc_submit).

### Estructura sugerida del repo

```
app/
  (auth)/
  (tabs)/
  booking/
  vehicle/
components/
hooks/
services/
theme/
utils/
```

### Estrategia de pruebas (sin código, definición)

- Unitarias de utilidades (formateos, validaciones).
- E2E ligeras con Detox o Maestro (flujo login → browse → detalle → resumen → redirección pago → retorno).
- Contratos de API: garantizar que payloads y errores esperados se mapean correctamente en UI.

### Checklist de aceptación MVP (app)

- Autenticación completa y estable con refresh.
- KYC: captura, envío, estado visible y bloqueos correctos.
- Búsqueda/Detalle con precio total estimado.
- Reserva con inicio de pago por servidor y confirmación por webhook (reflejada en UI).
- Historial de viajes y detalle.
- Métricas básicas y manejo de errores amigable.

### Roadmap 1.1 (app)

- Búsqueda “map-first”, favoritos, alertas de precio/fechas.
- Fotos pre/post viaje guiadas y checklist.
- Notificaciones push transaccionales (reserva, cambios de estado, KYC).
