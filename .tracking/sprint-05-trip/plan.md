# Sprint 5: Trip Management + Trip Photos + Claims

**Duración**: Días 25-30
**Estado**: ⬜ Not Started
**Prioridad**: 🔴 Crítico

---

## Objetivos

1. Implementar sistema de Trip Photos (15+ fotos)
2. Crear flujo de inspección pre/post trip
3. Implementar claims filing in-app
4. Crear active trip dashboard
5. Implementar emergency support

---

## Agentes Asignados

| Agente | Rol | Responsabilidad |
|--------|-----|-----------------|
| `frontend-developer` | Primary | Photo capture, Inspection wizard |
| `react-specialist` | Secondary | Trip hooks, Claims flow |
| `typescript-pro` | Support | Photo metadata types, Claims types |
| `ux-researcher` | Validation | Trip UX validation |

---

## Entregables Clave

- `app/trip/[id]/inspection.tsx` - 15+ photo inspection
- `app/trip/[id]/index.tsx` - Active trip dashboard
- `app/claims/new.tsx` - File new claim
- `components/molecules/TripPhotoCapture/` - Guided photo capture
- `constants/tripPhotos.ts` - Photo requirements
- `hooks/useTripPhotos.ts` - Photo management
- `services/claims.ts` - Claims service

---

## Criterios de Aceptación

- [ ] Sistema guía para capturar 15+ fotos requeridas
- [ ] Fotos incluyen timestamp y geolocation
- [ ] Claims se pueden filing dentro de 24h window
- [ ] Comparación visual de fotos pre/post disponible
- [ ] Emergency support con one-tap call
