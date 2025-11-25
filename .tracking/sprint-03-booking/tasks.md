# Sprint 3: Tasks

**Sprint**: Booking + Protection Plans
**Estado**: 🔄 In Progress
**Última actualización**: 2025-11-24

---

## Estado General

| Métrica | Valor |
|---------|-------|
| Total tareas | 26 |
| Completadas | 10 |
| En progreso | 0 |
| Pendientes | 16 |
| Progreso | 38% |

---

## Día 13-14: Booking Logic + Risk Scoring ✅ COMPLETADO

### `typescript-pro`
- [x] Crear `types/protection.ts` con ProtectionPlan interface (✅ Existed from Sprint 1)
- [x] Implementar HOST_PROTECTION_PLANS constant (✅ Existed from Sprint 1)
- [x] Implementar GUEST_PROTECTION_PLANS constant (✅ Existed from Sprint 1)
- [x] Crear `utils/riskScoring.ts` ✅
- [x] Implementar calculateGuestRiskScore function ✅
- [x] Crear `types/riskScore.ts` (✅ Existed from Sprint 1)

### `react-specialist`
- [x] Crear `hooks/useBookingEligibility.ts` ✅
- [x] Implementar `app/booking/[vehicleId].tsx` ✅
- [x] Crear pricing breakdown component (`PricingBreakdown.tsx`) ✅
- [x] Integrar risk check en background ✅

---

## Día 15-16: Protection Plan Selection

### `react-specialist`
- [ ] Crear `hooks/useProtectionPlans.ts`
- [ ] Implementar `app/booking/protection.tsx`
- [ ] Crear `ProtectionSelector` organism
- [ ] Implementar comparison modal

### `frontend-developer`
- [ ] Crear `ProtectionPlanCard` molecule
- [ ] Implementar "Recommended" badge
- [ ] Agregar animaciones de selección
- [ ] Crear feature comparison grid

---

## Día 17-18: Payment + Success

### `react-specialist`
- [ ] Implementar `app/booking/payment.tsx`
- [ ] Integrar expo-web-browser para checkout
- [ ] Configurar deep link handling
- [ ] Implementar `app/booking/success.tsx`

### `frontend-developer`
- [ ] Crear confetti animation
- [ ] Implementar booking summary card
- [ ] Agregar "Add to Calendar" CTA

### `ux-researcher`
- [ ] Validar booking funnel
- [ ] Revisar claridad de protección
- [ ] Verificar pricing transparency

---

## Bloqueadores

| ID | Descripción | Desde | Acción |
|----|-------------|-------|--------|
| - | Ninguno | - | - |

---

## Notas de Progreso

### Día 13-14 ✅
- **Risk Scoring System** implementado completo:
  - `utils/riskScoring.ts` - Algoritmo de scoring 0-100 con factores ponderados
  - `calculateGuestRiskScore()` - Calcula score basado en:
    - Identity verification (20 pts)
    - Trip history (15 pts)
    - Rating (10 pts excellent, 5 good)
    - Claims history (10 pts penalty per claim)
    - Account age (5 pts)
    - Driver age (penalty for under 25)
  - `checkBookingEligibility()` - Determina elegibilidad y aprobación
  - Helper functions: getRiskLevelColor, getRiskLevelLabel, getImprovementSuggestions

- **Booking Eligibility Hook**:
  - `hooks/useBookingEligibility.ts` - TanStack Query integration
  - `useBookingEligibility()` - Verifica elegibilidad para vehículo específico
  - `useUserRiskScore()` - Risk score general del usuario
  - Returns: canBook, canInstantBook, requiresApproval, blockedReason

- **Booking Confirmation Page**:
  - `app/booking/[vehicleId].tsx` - Página completa de confirmación
  - Vehicle summary card con imagen y detalles
  - Date/time selection con DateTimePicker (@react-native-community/datetimepicker)
  - Trip duration calculation dinámico
  - Eligibility check en background con loading/error/success states
  - Risk score display con badge y restricciones
  - Pricing breakdown integrado
  - CTA button dinámico (Instant Book vs Request to Book)

- **Pricing Breakdown Component**:
  - `components/molecules/PricingBreakdown.tsx` - Molecule component
  - Displays: daily rate × days, discounts, protection plan, service fee, total
  - Weekly/monthly discount support
  - Flexible para agregar protection plan en siguiente paso
  - Info box con recordatorio de no cobro hasta aprobación

- **Dependencies Installed**:
  - `@react-native-community/datetimepicker` - Date and time picker

---

## Archivos Creados

```
mobile-app/
├── utils/
│   ├── riskScoring.ts        ✅ NEW
│   └── index.ts              ✅ UPDATED
├── hooks/
│   ├── useBookingEligibility.ts  ✅ NEW
│   └── index.ts              ✅ UPDATED
├── app/
│   └── booking/
│       └── [vehicleId].tsx   ✅ NEW (booking confirmation page)
└── components/
    └── molecules/
        ├── PricingBreakdown.tsx  ✅ NEW
        └── index.ts          ✅ UPDATED
```

---

## Próximos Pasos (Día 15-16)

1. [ ] Crear `hooks/useProtectionPlans.ts` para gestión de planes
2. [ ] Implementar `app/booking/protection.tsx` - Selección de plan
3. [ ] Crear `ProtectionPlanCard` molecule con detalles de plan
4. [ ] Crear `ProtectionSelector` organism con comparación
5. [ ] Agregar animaciones de selección
6. [ ] Implementar comparison modal para ver diferencias

**Sprint 3 Día 13-14: 100% COMPLETADO** ✅
