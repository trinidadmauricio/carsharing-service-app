# Sprint 1: Foundation & Core Registration

**Duración**: Días 1-6
**Estado**: ⬜ Not Started
**Prioridad**: 🔴 Crítico

---

## Objetivos del Sprint

1. Configurar proyecto Expo con todas las dependencias
2. Establecer Design System base con tokens y componentes atoms
3. Implementar flujo de registro completo (Guest)
4. Implementar flujo de autenticación (Login + Biometrics)
5. Establecer arquitectura de servicios (mock/rest)

---

## Agentes Asignados

### Primary: `frontend-developer`
**Archivo**: `.claude/01-core-development/frontend-developer.md`

**Responsabilidades**:
- Setup del proyecto Expo
- Configuración de Atomic Design
- Implementación de componentes atoms (Button, Input, Card, Badge)
- Configuración de accessibility (WCAG 2.1 AA)
- Setup de testing infrastructure

**Checklist del Agente**:
- [ ] Components follow Atomic Design principles
- [ ] TypeScript strict mode enabled
- [ ] Accessibility WCAG 2.1 AA compliant
- [ ] Responsive mobile-first approach
- [ ] Comprehensive test coverage (>85%)

### Secondary: `react-specialist`
**Archivo**: `.claude/02-language-specialists/react-specialist.md`

**Responsabilidades**:
- Implementación de Registration flow con React Hook Form
- Custom hooks para auth (useAuth, useSecureStorage)
- State management con TanStack Query
- Performance optimization con React.memo, useMemo

**Checklist del Agente**:
- [ ] React 18+ features utilized effectively
- [ ] Component reusability > 80%
- [ ] Performance score > 95
- [ ] Test coverage > 90%

### Support: `typescript-pro`
**Archivo**: `.claude/02-language-specialists/typescript-pro.md`

**Responsabilidades**:
- Definición de interfaces y tipos base
- Configuración de tsconfig.json estricto
- Types para auth, users, protection plans
- Service layer interfaces

**Checklist del Agente**:
- [ ] Strict mode enabled with all compiler flags
- [ ] No explicit any usage
- [ ] 100% type coverage for public APIs

### Validation: `ux-researcher`
**Archivo**: `.claude/08-business-product/ux-researcher.md`

**Responsabilidades**:
- Validar flujo de registro contra UX research existente
- Revisar usability del onboarding
- Verificar accessibility del flujo

**Checklist del Agente**:
- [ ] Insights actionable confirmed
- [ ] Findings validated thoroughly
- [ ] Recommendations clear

---

## Entregables

### Día 1-2: Project Setup

| Entregable | Agente | Archivos |
|------------|--------|----------|
| Proyecto Expo inicializado | frontend-developer | `app.config.ts`, `package.json` |
| Design tokens | frontend-developer | `theme/tokens.ts`, `colors.ts`, `typography.ts` |
| Service layer base | typescript-pro | `services/index.ts`, `services/apiClient.ts` |
| Types base | typescript-pro | `types/auth.ts`, `types/user.ts`, `types/protection.ts` |

### Día 3-4: Registration Flow

| Entregable | Agente | Archivos |
|------------|--------|----------|
| Welcome Screen | frontend-developer | `app/(auth)/index.tsx` |
| Account Type Selection | frontend-developer | `app/(auth)/register/type.tsx` |
| Basic Information Form | react-specialist | `app/(auth)/register/index.tsx` |
| Phone Verification | react-specialist | `app/(auth)/register/phone-verify.tsx` |
| Atoms components | frontend-developer | `components/atoms/*` |

### Día 5-6: Authentication & Testing

| Entregable | Agente | Archivos |
|------------|--------|----------|
| Login Screen | react-specialist | `app/(auth)/login.tsx` |
| Auth hooks | react-specialist | `hooks/useAuth.ts`, `hooks/useSecureStorage.ts` |
| Auth service (mock) | typescript-pro | `services/modes/mock/auth.mock.ts` |
| Tests | react-specialist | `__tests__/screens/*.test.tsx` |
| UX Validation | ux-researcher | Documento de validación |

---

## Criterios de Aceptación

### Funcionales

- [ ] Usuario puede registrarse como Guest completando 4 pasos
- [ ] Usuario puede verificar su teléfono con código de 6 dígitos
- [ ] Usuario puede hacer login con email/password
- [ ] Usuario puede usar biometrics para login (si disponible)
- [ ] Tokens se almacenan de forma segura (SecureStore)

### Técnicos

- [ ] TypeScript strict mode sin errores
- [ ] Test coverage > 85%
- [ ] Todos los componentes tienen accessibility labels
- [ ] Design tokens aplicados consistentemente
- [ ] Service layer funciona en modo mock

### UX (validado por ux-researcher)

- [ ] Flujo de registro completable en < 4 minutos
- [ ] Mensajes de error claros y actionables
- [ ] Progress indicator visible en todo momento
- [ ] Validación en tiempo real funcional

---

## Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| expo | ~50.0.0 | Framework base |
| expo-router | ~3.4.0 | File-based routing |
| expo-secure-store | latest | Secure token storage |
| expo-local-authentication | latest | Biometrics |
| @tanstack/react-query | ^5.0.0 | Data fetching |
| react-hook-form | latest | Form handling |
| zod | latest | Validation |

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Incompatibilidad de dependencias | Media | Alto | Verificar compatibilidad antes de instalar |
| Performance en dispositivos antiguos | Baja | Medio | Probar en emuladores de bajo rendimiento |
| Complexity de auth flow | Media | Medio | Seguir patrones establecidos de CLAUDE.md |

---

## Notas

- Este sprint establece las bases para todo el proyecto
- Es crítico seguir Atomic Design desde el inicio
- La arquitectura mock/rest debe funcionar perfectamente antes de continuar
- Los tipos definidos aquí se usarán en todo el proyecto

---

## Referencias

- `docs/PLAN_REACT_NATIVE_EXPO.md` - Plan general
- `ux-research/ux_flows_specification.md` - Flujos UX detallados
- `CLAUDE.md` - Lineamientos del proyecto
