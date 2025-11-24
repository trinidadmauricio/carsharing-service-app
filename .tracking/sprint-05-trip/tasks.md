# Sprint 5: Tasks

**Sprint**: Trip Management + Claims
**Estado**: ⬜ Not Started

---

## Día 25-26: Trip Photos System

### `frontend-developer`
- [ ] Crear `constants/tripPhotos.ts` con REQUIRED_EXTERIOR_PHOTOS
- [ ] Crear `constants/tripPhotos.ts` con REQUIRED_INTERIOR_PHOTOS
- [ ] Implementar `TripPhotoCapture` molecule con camera overlay
- [ ] Crear `PhotoOverlayGuide` component
- [ ] Implementar photo strip preview
- [ ] Agregar progress bar de fotos

### `typescript-pro`
- [ ] Crear `types/tripPhoto.ts`
- [ ] Definir TripPhoto interface con metadata
- [ ] Crear photo validation utilities
- [ ] Implementar geolocation capture

### `react-specialist`
- [ ] Crear `hooks/useTripPhotos.ts`
- [ ] Implementar `app/trip/[id]/inspection.tsx`
- [ ] Manejar auto-advance entre fotos
- [ ] Implementar damage reporting

---

## Día 27-28: Claims Filing

### `react-specialist`
- [ ] Implementar `app/claims/new.tsx`
- [ ] Crear claim type selection UI
- [ ] Implementar photo evidence uploader
- [ ] Crear 24h window warning banner

### `frontend-developer`
- [ ] Crear `TripPhotosComparison` component
- [ ] Implementar `ClaimStatusCard` molecule
- [ ] Crear claims list screen

### `typescript-pro`
- [ ] Crear `services/claims.ts` interface
- [ ] Definir Claim types
- [ ] Implementar claim validation

---

## Día 29-30: Trip Dashboard + Emergency

### `frontend-developer`
- [ ] Implementar `app/trip/[id]/index.tsx`
- [ ] Crear countdown timer component
- [ ] Implementar quick actions bar
- [ ] Crear `EmergencySupport` molecule

### `react-specialist`
- [ ] Crear `hooks/useTrip.ts`
- [ ] Implementar trip extend functionality
- [ ] Integrar messaging

### `ux-researcher`
- [ ] Validar photo capture UX
- [ ] Revisar claims flow
- [ ] Verificar emergency accessibility
