# Plan Detallado - MVP App Móvil (Expo + React Native)

> **Documento de referencia técnica completa**  
> Este documento no se modifica durante la ejecución. Sirve como referencia técnica completa del plan de implementación.

## Objetivo

Construir una app iOS/Android para El Salvador orientada a carsharing, enfocada en huéspedes (guests) y, gradualmente, anfitriones (hosts). El MVP contempla exploración de vehículos, reservas, pagos mediados por el servidor (sin SDK Stripe en la app), gestión de viajes y un proceso de KYC básico para ambos perfiles.

## Principios clave

- Sin SDK de Stripe en la app: todos los cobros, refunds y payouts se orquestan desde el servidor. La app solo inicia el flujo y consulta estados.
- KYC para host y guest: captura guiada (documentos/selfie), seguimiento del estado y requisitos mínimos antes de permitir acciones sensibles.
- MVP usable y claro: pantallas y copys pensados para conversión con precio total transparente y pasos mínimos.
- Accesibilidad y rendimiento: tamaños táctiles adecuados, contraste, soporte dark mode, cargas diferidas de imágenes.

## Stack técnico

- **Framework**: React Native con Expo, TypeScript
- **Navegación**: Expo Router (file-based routing)
- **Estado remoto**: React Query (caché de requests, reintentos, invalidación por claves)
- **Estado local UI**: Zustand (opcional)
- **Almacenamiento seguro**: `expo-secure-store` para refreshToken
- **Push Notifications**: Expo Notifications (posterior a MVP si se requiere)

## Librerías adicionales

- `react-native-vector-icons` - Iconografía (Ionicons/Material/FA)
- `react-native-gesture-handler` - Gestos y swipe
- `react-native-reanimated` - Animaciones fluidas
- `react-native-toast-message` - Notificaciones toast
- `@react-native-community/datetimepicker` - Selector de fechas
- `expo-local-authentication` - Autenticación biométrica
- `react-native-maps` - Mapa real (fase 1.1, placeholder en MVP)

## Arquitectura de la app

### Capas

1. **UI (pantallas y componentes)**
   - Organización atom/molecule/organism
   - Componentes reutilizables: Button, Input, Card, Chip, PinInput, PriceRange, BottomSheet/Modal, ToastProvider
   - Pantallas por dominio (auth, browse, vehicle, booking, trips, profile)

2. **Hooks de datos (React Query)**
   - `useAuth` - Autenticación, login, registro, reset
   - `useVehicles` - Búsqueda, listado, detalle
   - `useBooking` - Reservas, resumen, confirmación
   - `useKyc` - Estado y envío de documentos KYC
   - `useFavorites` - Gestión de favoritos
   - `useFilters` - Estado de filtros avanzados
   - `useBiometric` - Autenticación biométrica

3. **Servicios de API (clientes)**
   - Funciones tipadas por endpoint
   - Capa conmutable: `mock` y `rest`
   - Interceptores para refresh token y manejo de errores

4. **Utilidades**
   - Formateo de precio, fechas
   - Validaciones (email, password strength, etc.)
   - Helpers de navegación

### Ruteo principal (Expo Router)

**Auth (stack)**
- `(auth)/login.tsx` - Login principal
- `(auth)/register.tsx` - Registro
- `(auth)/reset.tsx` - Solicitud reset password
- `(auth)/new-password.tsx` - Nueva contraseña
- `(auth)/two-factor.tsx` - 2FA por PIN
- `(auth)/reset-sent.tsx` - Confirmación email enviado
- `(auth)/password-success.tsx` - Éxito reset
- `(auth)/biometric.tsx` - Autenticación biométrica

**Tabs (tabs)**
- `(tabs)/browse.tsx` - Dashboard/búsqueda principal
- `(tabs)/trips.tsx` - Lista de viajes
- `(tabs)/profile.tsx` - Perfil usuario

**Stack principal**
- `vehicle/[id].tsx` - Detalle vehículo
- `booking/summary.tsx` - Resumen reserva
- `booking/success.tsx` - Confirmación éxito

## Estructura de directorios

```
app/
  (auth)/
    login.tsx
    register.tsx
    reset.tsx
    new-password.tsx
    two-factor.tsx
    reset-sent.tsx
    password-success.tsx
    biometric.tsx
  (tabs)/
    _layout.tsx
    browse.tsx
    trips.tsx
    profile.tsx
  vehicle/
    [id].tsx
  booking/
    summary.tsx
    success.tsx
components/
  atoms/
  molecules/
  organisms/
hooks/
  useAuth.ts
  useVehicles.ts
  useBooking.ts
  useKyc.ts
  useFavorites.ts
  useFilters.ts
  useBiometric.ts
services/
  apiClient.ts
  auth.ts
  vehicles.ts
  bookings.ts
  kyc.ts
  payments.ts
  index.ts
  modes/
    mock/
      auth.ts
      vehicles.ts
      bookings.ts
      kyc.ts
      payments.ts
    rest/
      auth.ts
      vehicles.ts
      bookings.ts
      kyc.ts
      payments.ts
theme/
  tokens.ts
  colors.ts
  typography.ts
  spacing.ts
  darkMode.ts
utils/
  formatPrice.ts
  dateUtils.ts
  validators.ts
  passwordStrength.ts
config/
  env.ts
```

## Flujos principales

### 1. Autenticación (extendida)

**Login básico**
- Email/Password
- Persistencia: `refreshToken` en SecureStore, `accessToken` en memoria (Zustand o variable módulo)
- Renovación automática de token ante 401

**Flujo de reset password**
1. Solicitud (`reset.tsx`) - Input email
2. Confirmación (`reset-sent.tsx`) - Email enviado, countdown reenvío
3. Nueva contraseña (`new-password.tsx`) - Input nueva contraseña con validación y barra de fuerza
4. Éxito (`password-success.tsx`) - Confirmación y opción habilitar 2FA

**2FA por PIN**
- Pantalla `two-factor.tsx` con 6 inputs de un dígito
- Auto-avance entre inputs, paste support
- Countdown para reenvío (60s)
- Auto-submit cuando se completa el PIN

**Biometría**
- Pantalla `biometric.tsx` con animación pulse
- Integración `expo-local-authentication`
- Opciones: Touch ID (iOS) / Face ID / Fingerprint (Android)
- Fallback a password si falla

**Social login (placeholders)**
- Botones Google/Apple en login
- Navegación simulada (no integración real en MVP)

**Validación de contraseña**
- Barra de fuerza visual (weak/fair/good/strong)
- Requisitos: 8+ caracteres, mayúscula, minúscula, número
- Validación en tiempo real

### 2. KYC (guest/host)

- Captura guiada: fotos de documento y selfie (con checklist y validación básica de calidad)
- Envío de evidencias al servidor; la app muestra estado: `pending`, `approved`, `rejected`
- Bloqueo condicional de acciones (p. ej., confirmar pago o publicar vehículo) hasta `approved`
- UI en `profile.tsx` con estado visible y botón "Complete KYC"

### 3. Búsqueda y detalle de vehículo (extendida)

**Dashboard/Browse (`browse.tsx`)**
- Header con saludo personalizado y notificaciones (badge)
- Card de búsqueda rápida:
  - Input ubicación (texto)
  - Selector de fechas (pickup/return)
  - Botón "Search Vehicles"
- Sección "Recent Trips" con card de último viaje
- Quick actions: "Book for Later", "Favorites", "Trip History"

**Listado de resultados**
- Chips de filtro rápido (All, Economy, Luxury, SUV, Electric)
- Botón "More Filters" → abre bottom sheet
- Cards de vehículos:
  - Imagen placeholder (SVG con gradiente por categoría)
  - Badge de distancia
  - Botón favorito (heart icon)
  - Nombre vehículo, rating con estrellas, número de reviews
  - Features (asientos, tipo combustible, extras)
  - Info host (avatar placeholder, nombre, badge "Superhost"/"Verified")
  - Precio por hora y total estimado

**Filtros avanzados (Bottom Sheet)**
- Precio: doble slider (min/max por hora)
- Distancia: radio buttons (0.5mi, 1mi, 2mi, 5mi)
- Features: checkboxes (Bluetooth, Backup Camera, GPS, USB, Sunroof, AWD)
- Rating: radio buttons (Any, 4+, 4.5+, Superhosts only)
- Botones: "Clear All" y "Apply Filters"

**Vista mapa (placeholder)**
- Toggle entre lista y mapa
- Mapa con patrón de fondo (placeholder)
- Pins interactivos con precio por hora
- Preview card al tocar pin (auto-hide después de 5s)
- Pin de ubicación usuario (centro, animación pulse)

**Detalle vehículo (`vehicle/[id].tsx`)**
- Header con botones back, share, favorito
- Galería principal con placeholder SVG
- Thumbnail strip: Exterior, Interior, Dashboard, Engine (placeholders)
- Info principal: título, rating detallado, host profile
- Specs grid: asientos, maletas, combustible, transmisión, millas, modelo
- Features incluidos: lista con checkmarks
- Ubicación: mini mapa placeholder con pin, dirección, botón "Get Directions"
- Reviews: lista de reviews estáticas (2-3 ejemplos)
- Footer fijo: precio total y botón "Book Now"

### 4. Reserva y pago (server-only)

**Resumen (`booking/summary.tsx`)**
- Card resumen vehículo (thumb, nombre, host, rating)
- Trip details: Pickup, Return, Duration, Location
- Price breakdown:
  - Base rate (horas × precio/hora)
  - Service fee
  - Insurance
  - Total
- Payment method: card placeholder (•••• 4242) con botón "Change"
- Cancellation policy: texto explicativo
- Botón "Confirm & Pay $X.XX"

**Flujo de confirmación**
1. Al confirmar → pantalla "processing" (spinner animado)
2. Llamada `POST /payments/checkout` (mock devuelve URL externa)
3. Abrir WebBrowser/CustomTabs con URL
4. Deep link de retorno: `carsharing://payment-result?bookingId=...&status=success|canceled`
5. Consultar `GET /bookings/:id` para estado final
6. Navegar a `booking/success.tsx`

**Pantalla éxito (`booking/success.tsx`)**
- Animación checkmark (bounce)
- Título "Booking Confirmed!"
- Card de detalles: vehículo, booking ID, pickup/return, total paid
- Sección "What's Next?":
  1. Before Your Trip - email instructions
  2. At Pickup Time - meet host or unlock
  3. During Your Trip - drive safely
- Botones: "View Trip Details", "Book Another Car", "Contact Host"

### 5. Viajes

**Lista (`trips.tsx`)**
- Tabs: "Upcoming" y "Past"
- Cards de viaje con:
  - Thumb vehículo
  - Nombre vehículo
  - Fechas y duración
  - Estado (badge: upcoming/completed/cancelled)
  - Precio total
  - Rating (si completado)

**Detalle** (navegación desde card)
- Info completa del viaje
- Políticas de cancelación
- Botón contacto host (chat web o redirección en MVP)

### 6. Navegación y guards

**Guards de autenticación**
- Tabs requieren `isAuthenticated` (redirect a login si no)
- Guard en `_layout.tsx` de tabs

**Guards de KYC**
- Bloqueo de confirmación de pago si `kycStatus !== 'approved'`
- Mensaje: "Please complete KYC verification to continue"

**Guards de navegación**
- Deep link validación: verificar origen y `state` al volver del pago

## Capa de servicios conmutable

### Contratos TypeScript

Cada dominio define interfaces compartidas entre mock y rest:

```typescript
// services/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
}
```

### ApiClient

```typescript
// services/apiClient.ts
class ApiClient {
  private accessToken: string | null = null;
  
  async request(url: string, options: RequestInit) {
    // Interceptor 401 → refresh → retry
    // Headers con accessToken
  }
  
  async refreshToken() {
    // Usar refreshToken de SecureStore
    // Actualizar accessToken en memoria
  }
}
```

### Selector de modo

```typescript
// services/index.ts
import * as mock from './modes/mock';
import * as rest from './modes/rest';
import { ENV } from '../config/env';

export const svc = ENV.API_MODE === 'live' ? rest : mock;
```

### Implementación Mock

- Datos hardcodeados en memoria
- Delays simulados (setTimeout)
- Estados predefinidos (vehículos, bookings, etc.)
- Respuestas consistentes con contratos

### Implementación REST (stub inicial)

- Fetch a `API_BASE_URL`
- Headers y errores estándar
- Mismo contrato que mock

## Configuración de entornos

### Variables (`.env` / `app.config.ts`)

```typescript
// config/env.ts
export const ENV = {
  API_MODE: (process.env.EXPO_PUBLIC_API_MODE ?? 'mock') as 'mock' | 'live',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
  DEEP_LINK_SCHEME: process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME ?? 'carsharing',
  ENV: process.env.EXPO_PUBLIC_ENV ?? 'dev',
};
```

### Flags de features

- Variables para features experimentales (remotas o locales)
- Toggles en UI si aplica

## Seguridad y privacidad

- No almacenar datos sensibles de pago; solo tokens/JWT en SecureStore
- Validar origen del deep link y `state` al volver del pago
- Sanitizar metadatos de imágenes enviadas al servidor (documentos/selfie)
- Validar inputs en cliente (validators.ts)
- HTTPS obligatorio en producción

## Error handling y UX

- Toasts uniformes para errores de red/validación
- Empty states con mensajes claros
- Loaders con skeletons simples
- Retry automático en React Query (configurable)
- Mensajes de error amigables (no exponer stack traces)

## Telemetría

- Sentry para errores (placeholder, no-op en mock)
- Analytics (expo-analytics/Segment) para eventos clave:
  - `view_item` - Ver vehículo
  - `begin_checkout` - Iniciar reserva
  - `purchase` - Confirmar pago
  - `kyc_submit` - Enviar KYC
- Helper `track(event, props)` no-op en dev/mock

## Accesibilidad

- Tamaño mínimo táctil: 44x44pt
- Contraste AA mínimo
- Etiquetas y hints para lectores de pantalla
- Soporte dark mode
- Reducir animaciones si `prefers-reduced-motion`

## Investigación de UI/UX

- Benchmark: Turo/Getaround/HyreCar
- Número de pasos, componentes críticos, copywriting
- Estados vacíos con CTAs claros
- Design tokens: color, tipografía, espaciado, radios, sombras

## Estrategia de pruebas

### Unitarias
- Utilidades: formateos, validaciones, passwordStrength
- Servicios mock: verificar shapes de respuestas

### Hooks (React Query)
- Mock de servicios en tests
- Verificar estados de carga, éxito, error

### E2E (guión)
- Login → 2FA/biométrico (si aplica) → browse → filtro → detalle → summary → checkout (web) → deep link → success

## Checklist de aceptación MVP

- [ ] Autenticación completa y estable con refresh
- [ ] KYC: captura, envío, estado visible y bloqueos correctos
- [ ] Búsqueda/Detalle con precio total estimado
- [ ] Reserva con inicio de pago por servidor y confirmación por webhook (reflejada en UI)
- [ ] Historial de viajes y detalle
- [ ] Métricas básicas y manejo de errores amigable
- [ ] 2FA por PIN funcional
- [ ] Biometría simulada funcional
- [ ] Filtros avanzados en bottom sheet
- [ ] Vista mapa placeholder con pins
- [ ] Galería de vehículo con thumbnails
- [ ] Toasts y animaciones básicas
- [ ] Validación de contraseña con barra de fuerza

## Roadmap 1.1 (post-MVP)

- Búsqueda "map-first" con mapa real (`react-native-maps`)
- Favoritos persistidos
- Alertas de precio/fechas
- Fotos pre/post viaje guiadas y checklist
- Notificaciones push transaccionales (reserva, cambios de estado, KYC)
- Chat integrado con hosts
- Integración real de social login

## Conexión a backend real

### Requisitos backend

- Endpoints REST según contratos definidos
- Soporte CORS para desarrollo
- Refresh tokens con renovación automática
- Webhooks para actualizar estado de bookings (después de pago)
- Deep link handler: `carsharing://payment-result`
- Validación de origen de deep links

### Pasos de migración

1. Cambiar `API_MODE='live'` en `.env`
2. Configurar `API_BASE_URL` apuntando a backend real
3. Verificar que contratos coinciden (ajustar si necesario)
4. Probar flujo completo end-to-end
5. Monitorear errores y ajustar

---

**Última actualización**: Este documento es estático y sirve como referencia técnica completa del plan de implementación.

