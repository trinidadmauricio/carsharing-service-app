# Sprint 3: Tasks

**Sprint**: Booking + Protection Plans
**Estado**: ⬜ Not Started

---

## Día 13-14: Booking Logic + Risk Scoring

### `typescript-pro`
- [ ] Crear `types/protection.ts` con ProtectionPlan interface
- [ ] Implementar HOST_PROTECTION_PLANS constant
- [ ] Implementar GUEST_PROTECTION_PLANS constant
- [ ] Crear `utils/riskScoring.ts`
- [ ] Implementar calculateGuestRiskScore function
- [ ] Crear `types/riskScore.ts`

### `react-specialist`
- [ ] Crear `hooks/useBookingEligibility.ts`
- [ ] Implementar `app/booking/confirm.tsx`
- [ ] Crear pricing breakdown component
- [ ] Integrar risk check en background

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
