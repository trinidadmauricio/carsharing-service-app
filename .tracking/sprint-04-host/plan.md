# Sprint 4: Host Onboarding + Smart Pricing + Instant Book

**Duración**: Días 19-24
**Estado**: ⬜ Not Started
**Prioridad**: 🔴 Crítico

---

## Objetivos

1. Implementar onboarding de hosts con selección de protección
2. Crear Smart Pricing engine con recomendaciones
3. Implementar Instant Book como default
4. Crear vehicle listing flow
5. Implementar host dashboard básico

---

## Agentes Asignados

| Agente | Rol | Responsabilidad |
|--------|-----|-----------------|
| `typescript-pro` | Primary | Pricing engine, Algorithm types |
| `react-specialist` | Secondary | Host dashboard, Pricing UI |
| `frontend-developer` | Support | Instant book components, Forms |
| `ux-researcher` | Validation | Host onboarding UX |

---

## Entregables Clave

- `app/(host)/onboarding/*` - Host registration flow
- `app/(host)/vehicle/pricing.tsx` - Smart pricing screen
- `app/(host)/vehicle/availability.tsx` - Instant book settings
- `app/(host)/dashboard.tsx` - Host dashboard
- `services/pricing.ts` - Pricing service
- `hooks/useSmartPricing.ts` - Smart pricing hook
- `utils/pricing.ts` - Pricing calculations

---

## Criterios de Aceptación

- [ ] Host puede seleccionar protection plan (5 niveles)
- [ ] Smart pricing sugiere precio basado en factores
- [ ] Host puede habilitar/deshabilitar Instant Book
- [ ] Host puede configurar requisitos mínimos para guests
- [ ] Dashboard muestra earnings y métricas básicas
