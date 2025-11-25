# Plan de Implementación de Unit Tests

**Fecha de creación:** 2025-01-24  
**Estado:** 📋 Planificado  
**Prioridad:** Alta

---

## Análisis de Viabilidad

**Estado Actual:**
- ✅ Jest configurado con `jest-expo` preset
- ✅ `@testing-library/react-native` instalado
- ✅ Coverage threshold configurado (70% mínimo)
- ✅ Tests existentes como referencia (Button, Input, useAuth)
- ✅ Estructura de proyecto clara y organizada

**Cobertura Actual:**
- Tests existentes: `Button`, `Input`, `useAuth`, `useBiometrics`
- Sin tests: ~15 componentes, 5 hooks, 1 util crítico, 4 servicios

**Conclusión:** ✅ **Totalmente viable** - El proyecto está bien preparado para agregar tests incrementales.

---

## Estrategia de Implementación

### Priorización por Criticidad

1. **Crítico (Fase 1)**: Lógica de negocio y hooks de booking
2. **Alto (Fase 2)**: Componentes atoms básicos reutilizables
3. **Medio (Fase 3)**: Componentes molecules y hooks auxiliares
4. **Bajo (Fase 4)**: Servicios y componentes complejos

---

## Fase 1: Lógica de Negocio Crítica (Prioridad Máxima)

### 1.1 Utils - `riskScoring.ts` ⚠️ CRÍTICO
**Archivo:** `mobile-app/utils/riskScoring.ts`

**Funciones a testear:**
- `calculateGuestRiskScore()` - Algoritmo complejo con múltiples factores
- `checkBookingEligibility()` - Lógica de elegibilidad
- `getRiskLevelColor()` - Helper simple
- `getRiskLevelLabel()` - Helper simple
- `getImprovementSuggestions()` - Lógica de sugerencias

**Casos de prueba:**
- Score calculation con diferentes combinaciones de factores
- Edge cases (score 0, score 100, valores límite)
- Eligibility checks (blocked, instant book, requires approval)
- Risk level determination (low, medium, high, very_high)
- Improvement suggestions basadas en factores faltantes

**Archivo de test:** `mobile-app/__tests__/utils/riskScoring.test.ts`

---

### 1.2 Hook - `useBookingEligibility.ts` ⚠️ CRÍTICO
**Archivo:** `mobile-app/hooks/useBookingEligibility.ts`

**Funciones a testear:**
- `useBookingEligibility()` - Hook principal con React Query
- `useUserRiskScore()` - Hook de risk score

**Casos de prueba:**
- Query enabled/disabled según user y vehicleId
- Cálculo correcto de accountAgeMonths
- Cálculo correcto de driverAge desde dateOfBirth
- Transformación correcta de user data a RiskCalculationInput
- Estados de loading, error, success
- Valores derivados (canBook, canInstantBook, requiresApproval)

**Archivo de test:** `mobile-app/__tests__/hooks/useBookingEligibility.test.ts`

**Mocking necesario:**
- `@tanstack/react-query` (QueryClientProvider)
- `useAuth` hook
- `checkBookingEligibility` util

---

### 1.3 Hook - `useProtectionPlans.ts` ⚠️ ALTO
**Archivo:** `mobile-app/hooks/useProtectionPlans.ts`

**Funciones a testear:**
- `useProtectionPlans()` - Hook principal
- `formatCurrency()` - Helper
- `getTierColor()` - Helper

**Casos de prueba:**
- Selección de plan (selectPlan, resetSelection)
- Cálculo de precio total (getTotalPrice con diferentes tripDays)
- Comparación de planes (comparePlans con features únicas/comunes)
- Plan recomendado auto-seleccionado
- Guest vs Host plans
- Format currency con diferentes valores
- Tier colors para todos los tiers

**Archivo de test:** `mobile-app/__tests__/hooks/useProtectionPlans.test.ts`

---

## Fase 2: Componentes Atoms Básicos (Alta Prioridad)

### 2.1 `Card.tsx`
**Archivo:** `mobile-app/components/atoms/Card.tsx`

**Casos de prueba:**
- Renderizado con diferentes variants (elevated, outlined, filled)
- Renderizado con diferentes shadow sizes
- Renderizado como Pressable cuando tiene onPress
- Renderizado como View cuando no tiene onPress
- Padding y borderRadius personalizados
- Estado pressed en Pressable
- Accessibility role correcto

**Archivo de test:** `mobile-app/__tests__/components/Card.test.tsx`

---

### 2.2 `Badge.tsx`
**Archivo:** `mobile-app/components/atoms/Badge.tsx`

**Casos de prueba:**
- Renderizado con diferentes variants
- Renderizado con diferentes sizes
- Renderizado con icon
- Renderizado con dot indicator
- Colores según variant

**Archivo de test:** `mobile-app/__tests__/components/Badge.test.tsx`

---

### 2.3 `Text.tsx` y variantes
**Archivo:** `mobile-app/components/atoms/Text.tsx`

**Casos de prueba:**
- Renderizado con diferentes variants
- Renderizado con diferentes weights
- Heading component (level 1-4)
- Body component (sizes)
- Label component
- Caption component
- NumberOfLines truncation

**Archivo de test:** `mobile-app/__tests__/components/Text.test.tsx`

---

### 2.4 `Chip.tsx` y `ChipGroup.tsx`
**Archivo:** `mobile-app/components/atoms/Chip.tsx`

**Casos de prueba:**
- Renderizado con diferentes variants
- Selección/deselección
- ChipGroup con múltiples chips
- ChipGroup con selección múltiple/única
- Estado disabled
- onPress callback

**Archivo de test:** `mobile-app/__tests__/components/Chip.test.tsx`

---

### 2.5 `Divider.tsx` y `Spacer.tsx`
**Archivo:** `mobile-app/components/atoms/Divider.tsx`

**Casos de prueba:**
- Renderizado horizontal/vertical
- Diferentes sizes
- Spacer con diferentes heights
- Spacer con diferentes widths

**Archivo de test:** `mobile-app/__tests__/components/Divider.test.tsx`

---

## Fase 3: Componentes Molecules y Hooks Auxiliares

### 3.1 `PricingBreakdown.tsx`
**Archivo:** `mobile-app/components/molecules/PricingBreakdown.tsx`

**Casos de prueba:**
- Renderizado con todos los campos
- Cálculo correcto de subtotal (dailyRate × tripDays)
- Display de discount cuando existe
- Display de protection plan cuando existe
- Service fee display
- Total calculation
- Info box display cuando showDetails=true
- Pluralización correcta (day vs days)

**Archivo de test:** `mobile-app/__tests__/components/molecules/PricingBreakdown.test.tsx`

---

### 3.2 `ProtectionPlanCard.tsx`
**Archivo:** `mobile-app/components/molecules/ProtectionPlanCard.tsx`

**Casos de prueba:**
- Renderizado con plan data
- Estado selected/unselected
- Recommended badge display
- Checkmark cuando selected
- onPress callback
- Animaciones (verificar que se aplican)

**Archivo de test:** `mobile-app/__tests__/components/molecules/ProtectionPlanCard.test.tsx`

---

### 3.3 Hook - `useSecureStorage.ts`
**Archivo:** `mobile-app/hooks/useSecureStorage.ts`

**Casos de prueba:**
- setItem guarda correctamente
- getItem recupera correctamente
- deleteItem elimina correctamente
- clearAll limpia todos los items
- Manejo de errores en cada operación

**Archivo de test:** `mobile-app/__tests__/hooks/useSecureStorage.test.ts`

**Mocking necesario:**
- `expo-secure-store`

---

### 3.4 Hook - `useLocation.ts`
**Archivo:** `mobile-app/hooks/useLocation.ts`

**Casos de prueba:**
- requestPermission success/denied
- getCurrentLocation success/error
- reverseGeocode success/error
- Watch position (mock subscription)
- formatDistance helper con diferentes valores
- DEFAULT_LOCATION constant

**Archivo de test:** `mobile-app/__tests__/hooks/useLocation.test.ts`

**Mocking necesario:**
- `expo-location`

---

## Fase 4: Servicios y Componentes Complejos

### 4.1 `apiClient.ts`
**Archivo:** `mobile-app/services/apiClient.ts`

**Casos de prueba:**
- initialize carga refresh token
- get request con autenticación
- post request con body
- Token refresh automático en 401
- Error handling
- Retry logic

**Archivo de test:** `mobile-app/__tests__/services/apiClient.test.ts`

**Mocking necesario:**
- `expo-secure-store`
- `fetch` global

---

### 4.2 Componentes restantes (opcional)
- `Avatar.tsx` y `AvatarGroup.tsx`
- `ProgressBar.tsx` y `StepProgress.tsx`
- `VehicleCard.tsx`
- `FiltersSheet.tsx`
- `PinInput.tsx`

---

## Estructura de Archivos de Test

```
mobile-app/__tests__/
├── components/
│   ├── atoms/
│   │   ├── Card.test.tsx
│   │   ├── Badge.test.tsx
│   │   ├── Text.test.tsx
│   │   ├── Chip.test.tsx
│   │   └── Divider.test.tsx
│   └── molecules/
│       ├── PricingBreakdown.test.tsx
│       └── ProtectionPlanCard.test.tsx
├── hooks/
│   ├── useBookingEligibility.test.ts
│   ├── useProtectionPlans.test.ts
│   ├── useSecureStorage.test.ts
│   └── useLocation.test.ts
├── utils/
│   └── riskScoring.test.ts
└── services/
    └── apiClient.test.ts
```

---

## Configuración y Setup Necesario

### Mocks Globales Requeridos

**`mobile-app/__tests__/setup/mocks.ts`** (crear si no existe):
- Mock de `expo-router`
- Mock de `expo-secure-store`
- Mock de `expo-location`
- Mock de `@tanstack/react-query` QueryClient

### Helpers de Test

**`mobile-app/__tests__/helpers/testUtils.tsx`** (crear):
- `renderWithProviders()` - Wrapper con QueryClientProvider
- `createMockUser()` - Factory para mock users
- `createMockVehicle()` - Factory para mock vehicles

---

## Métricas de Éxito

1. **Coverage mínimo:** 70% (ya configurado en jest.config.js)
2. **Tests críticos:** 100% coverage en `riskScoring.ts` y `useBookingEligibility.ts`
3. **Tests por componente:** Mínimo 5-10 casos por componente/hook
4. **Tiempo de ejecución:** < 30 segundos para toda la suite

---

## Orden de Implementación Recomendado

1. **Semana 1:** Fase 1 completa (utils + hooks críticos)
2. **Semana 2:** Fase 2 (componentes atoms básicos)
3. **Semana 3:** Fase 3 (molecules + hooks auxiliares)
4. **Semana 4:** Fase 4 (servicios + componentes restantes)

---

## Notas Importantes

- **TDD:** Seguir principio Red-Green-Refactor cuando sea posible
- **Mocking:** Mockear todas las dependencias externas (expo modules, React Query, etc.)
- **Isolation:** Cada test debe ser independiente
- **Naming:** Usar nombres descriptivos: `describe('ComponentName')` → `it('should do X when Y')`
- **Coverage:** Ejecutar `npm run test:coverage` después de cada fase
- **CI/CD:** Asegurar que tests pasen en CI antes de merge

---

## Archivos Clave a Modificar/Crear

**Crear:**
- `__tests__/utils/riskScoring.test.ts`
- `__tests__/hooks/useBookingEligibility.test.ts`
- `__tests__/hooks/useProtectionPlans.test.ts`
- `__tests__/hooks/useSecureStorage.test.ts`
- `__tests__/hooks/useLocation.test.ts`
- `__tests__/components/Card.test.tsx`
- `__tests__/components/Badge.test.tsx`
- `__tests__/components/Text.test.tsx`
- `__tests__/components/Chip.test.tsx`
- `__tests__/components/Divider.test.tsx`
- `__tests__/components/molecules/PricingBreakdown.test.tsx`
- `__tests__/components/molecules/ProtectionPlanCard.test.tsx`
- `__tests__/services/apiClient.test.ts`
- `__tests__/helpers/testUtils.tsx` (opcional pero recomendado)

**Modificar:**
- `jest.config.js` - Agregar setupFiles si es necesario

---

## Checklist de Implementación

### Fase 1: Lógica Crítica
- [ ] `riskScoring.test.ts` - Tests completos para todas las funciones
- [ ] `useBookingEligibility.test.ts` - Tests con React Query mocking
- [ ] `useProtectionPlans.test.ts` - Tests de selección y comparación

### Fase 2: Componentes Atoms
- [ ] `Card.test.tsx` - Variants y estados
- [ ] `Badge.test.tsx` - Variants y sizes
- [ ] `Text.test.tsx` - Todas las variantes
- [ ] `Chip.test.tsx` - Selección y grupos
- [ ] `Divider.test.tsx` - Orientación y sizes

### Fase 3: Molecules y Hooks
- [ ] `PricingBreakdown.test.tsx` - Cálculos y display
- [ ] `ProtectionPlanCard.test.tsx` - Estados y callbacks
- [ ] `useSecureStorage.test.ts` - Operaciones CRUD
- [ ] `useLocation.test.ts` - Permisos y geocoding

### Fase 4: Servicios
- [ ] `apiClient.test.ts` - Requests y token refresh

### Setup
- [ ] Crear `testUtils.tsx` con helpers
- [ ] Configurar mocks globales si es necesario
- [ ] Verificar coverage >= 70%

---

## Referencias

- Tests existentes como referencia:
  - `__tests__/components/Button.test.tsx`
  - `__tests__/components/Input.test.tsx`
  - `__tests__/hooks/useAuth.test.ts`
  - `__tests__/hooks/useBiometrics.test.ts`

- Documentación:
  - Jest: https://jestjs.io/docs/getting-started
  - React Native Testing Library: https://callstack.github.io/react-native-testing-library/
  - Testing React Query: https://tanstack.com/query/latest/docs/react/guides/testing

