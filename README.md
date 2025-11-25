# 🚗 Carsharing Service App

Aplicación móvil de carsharing para El Salvador construida con React Native y Expo. Permite a los huéspedes alquilar vehículos y a los anfitriones listar sus vehículos, con flujos completos de KYC, autenticación, búsqueda, reserva y pagos.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Desarrollo](#-desarrollo)
- [Testing](#-testing)
- [Documentación](#-documentación)
- [Contribución](#-contribución)

## ✨ Características

### Para Huéspedes
- 🔐 Autenticación segura con biometría (Touch ID/Face ID)
- 🔍 Búsqueda avanzada de vehículos con filtros
- 📅 Sistema de reservas con selección de fechas
- 🛡️ Selección de planes de protección
- 💳 Integración de pagos
- 📱 Gestión de viajes activos
- ✅ Verificación KYC

### Para Anfitriones
- 🚙 Onboarding completo para listar vehículos
- 📸 Captura de fotos y documentos del vehículo
- 💰 Configuración de precios y disponibilidad
- 📊 Gestión de reservas
- ✅ Verificación KYC

## 🛠️ Tecnologías

### Core
- **React Native**: 0.81.5
- **Expo**: ~54.0.25
- **TypeScript**: 5.9.2 (strict mode)
- **React**: 19.1.0

### Routing & Navigation
- **Expo Router**: ~6.0.15 (file-based routing)

### State Management
- **TanStack React Query**: ^5.90.10 (remote state)
- **Zustand**: ^5.0.8 (local state)

### Forms & Validation
- **React Hook Form**: ^7.66.1
- **Zod**: ^4.1.13 (schema validation)

### UI & Animations
- **React Native Reanimated**: ~4.1.1
- **@gorhom/bottom-sheet**: ^5.2.6
- **React Native Gesture Handler**: ~2.28.0

### Security & Storage
- **Expo Secure Store**: ~15.0.7 (tokens)
- **Expo Local Authentication**: ~17.0.7 (biometría)

### Maps & Location
- **React Native Maps**: ^1.20.1
- **Expo Location**: ~19.0.7

## 📦 Requisitos Previos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Expo CLI**: Instalado globalmente (`npm install -g expo-cli`)
- **iOS**: Xcode 14+ (para desarrollo iOS)
- **Android**: Android Studio (para desarrollo Android)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd carsharing-service-app
   ```

2. **Instalar dependencias**
   ```bash
   cd mobile-app
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en `mobile-app/` con las siguientes variables:

```env
EXPO_PUBLIC_API_MODE=mock          # 'mock' | 'live'
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
EXPO_PUBLIC_DEEP_LINK_SCHEME=carsharing
EXPO_PUBLIC_ENV=dev                # 'dev' | 'stage' | 'prod'
```

### Modos de API

El proyecto soporta dos modos de operación:

- **Mock Mode** (`EXPO_PUBLIC_API_MODE=mock`): Usa datos simulados para desarrollo
- **Live Mode** (`EXPO_PUBLIC_API_MODE=live`): Conecta con la API REST real

## 💻 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Iniciar en iOS
npm run ios
# o
npx expo start --ios

# Iniciar en Android
npm run android
# o
npx expo start --android

# Iniciar en Web
npm run web
```

### Build

```bash
# Verificar tipos TypeScript
npm run build

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
npm run format:check
```

### Testing

```bash
# Ejecutar tests
npm test

# Modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📁 Estructura del Proyecto

```
carsharing-service-app/
├── mobile-app/                 # Aplicación móvil principal
│   ├── app/                    # Expo Router (file-based routing)
│   │   ├── (auth)/             # Rutas de autenticación
│   │   ├── (tabs)/             # Navegación por tabs
│   │   ├── booking/            # Flujo de reservas
│   │   └── vehicle/            # Detalles de vehículos
│   ├── components/             # Componentes React
│   │   ├── atoms/              # Componentes básicos
│   │   ├── molecules/          # Componentes compuestos
│   │   └── organisms/         # Componentes complejos
│   ├── hooks/                  # Custom hooks
│   ├── services/               # Capa de servicios API
│   │   ├── modes/
│   │   │   ├── mock/           # Implementaciones mock
│   │   │   └── rest/           # Implementaciones REST
│   │   └── index.ts            # Selector de modo
│   ├── theme/                  # Sistema de diseño
│   │   ├── colors.ts           # Paleta de colores
│   │   ├── typography.ts       # Tipografía
│   │   ├── spacing.ts          # Espaciado
│   │   └── tokens.ts           # Tokens de diseño
│   ├── types/                  # Definiciones TypeScript
│   └── utils/                  # Utilidades
├── docs/                       # Documentación técnica
├── prototype/                  # Prototipos HTML/CSS/JS
├── screenshots/                # Capturas de pantalla
└── ux-research/                # Investigación UX
```

## 🏗️ Arquitectura

### Patrón de Servicios (Mock/REST)

Todos los servicios API siguen un patrón dual para soportar datos mock y APIs REST reales:

```
services/
  ├── modes/
  │   ├── mock/     # Implementaciones con datos hardcodeados
  │   └── rest/     # Implementaciones REST reales
  └── index.ts      # Selector de modo (ENV.API_MODE)
```

**Regla crítica**: Al agregar nueva funcionalidad API:
1. Define interfaces TypeScript primero
2. Implementa versión mock con delays realistas
3. Implementa versión REST con la misma interfaz
4. Nunca mezcles implementaciones - siempre usa la capa de servicios

### Organización de Componentes (Atomic Design)

Los componentes están organizados siguiendo principios de Atomic Design:

- **Atoms**: Componentes básicos sin dependencias de UI (Button, Input, Card)
- **Molecules**: Componentes compuestos (FiltersSheet, PinInput)
- **Organisms**: Componentes complejos (formularios completos)

### Autenticación

El sistema de autenticación implementa:
- **Access tokens**: Solo en memoria (nunca persistidos)
- **Refresh tokens**: Almacenados en expo-secure-store
- **Refresh automático**: apiClient maneja 401s y refresh de tokens
- **Biometría**: Touch ID/Face ID vía expo-local-authentication
- **2FA**: Autenticación de dos factores basada en PIN

**Requisitos de seguridad**:
- ❌ NUNCA almacenar access tokens en AsyncStorage o state
- ❌ NUNCA hardcodear credenciales o API keys
- ✅ Siempre usar HTTPS en producción
- ✅ Validar todas las entradas de usuario
- ✅ Manejar limpieza de tokens en logout

### Data Fetching (React Query)

Todas las operaciones async usan TanStack Query:

```typescript
// Queries para leer datos
const { data, isLoading } = useQuery({
  queryKey: ['vehicles', filters],
  queryFn: () => getVehicles(filters),
  staleTime: 5 * 60 * 1000,  // 5 minutos
});

// Mutations para escribir datos
const mutation = useMutation({
  mutationFn: createBooking,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  },
});
```

## 🧑‍💻 Desarrollo

### Convenciones de Código

- **TypeScript Strict Mode**: Siempre habilitado
- **Nunca usar `any`**: Usar `unknown` para tipos verdaderamente desconocidos
- **Funciones con tipos explícitos**: Todas las funciones deben tener tipos de retorno
- **API requests/responses tipados**: Todos deben tener tipos TypeScript

### React 19 JSX Types

Este proyecto usa **React 19** con sintaxis JSX actualizada:

```typescript
// ✅ CORRECTO - Sintaxis React 19
import React from 'react';
export default function MyComponent(): React.JSX.Element {
  return <View />;
}

// ❌ INCORRECTO - Sintaxis antigua
export default function MyComponent(): JSX.Element {
  return <View />;
}
```

### Safe Area Handling

Siempre respetar las áreas seguras del dispositivo usando hooks:

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomCTA, {
      paddingBottom: insets.bottom + spacing['3']
    }]}>
      {/* Contenido */}
    </View>
  );
}
```

### Platform-Specific Code

Manejar diferencias iOS vs Android explícitamente:

```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  input: {
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
  },
});
```

## 🧪 Testing

El proyecto sigue Test-Driven Development (TDD):

- **Cobertura mínima**: 80% para código crítico
- **Tipos de tests**: Unit tests, Integration tests, E2E tests
- **Mocking**: Mockear dependencias externas (API, SecureStore, etc.)

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📚 Documentación

### Documentación Técnica

- `docs/plan-detallado.md` - Plan técnico completo de implementación
- `docs/plan-app-mobile.md` - Plan específico de la app móvil
- `docs/plan-rest-api.md` - Especificaciones de la API REST
- `CLAUDE.md` - Guía para asistentes de IA trabajando en el proyecto

### UX Research

- `ux-research/UX_Research_Report.md` - Reporte de investigación UX
- `ux-research/User_Journey_Maps.md` - Mapas de viaje del usuario
- `ux-research/UX_Patterns_Library.md` - Biblioteca de patrones UX
- `ux-research/implementation_roadmap.md` - Roadmap de implementación

### Prototipos

Los prototipos en `prototype/` son implementaciones HTML/CSS/JS listas para producción que demuestran los flujos UX exactos y pueden usarse como referencias de implementación.

## 🤝 Contribución

### Git Workflow

- **Formato de commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, etc.)
- **Naming de branches**: `feature/`, `fix/`, `refactor/`
- **Commits**: Atómicos y descriptivos
- **PRs**: Pequeños y enfocados

### Checklist de Calidad

Antes de considerar código completo:
- [ ] Tests escritos y pasando (TDD)
- [ ] Tipos TypeScript definidos (sin `any`)
- [ ] Manejo de errores implementado
- [ ] Labels de accesibilidad agregados
- [ ] Consideraciones de seguridad abordadas
- [ ] Design tokens usados (sin valores hardcodeados)
- [ ] Performance perfilado (si aplica)
- [ ] Documentación actualizada

## 📝 Licencia

[Especificar licencia si aplica]

## 🔗 Enlaces Útiles

- [React Native Docs](https://reactnative.dev/docs/)
- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TanStack Query](https://tanstack.com/query/latest)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)

## 📞 Soporte

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**Estado del Proyecto**: En desarrollo activo 🚧

**Última actualización**: 2025

