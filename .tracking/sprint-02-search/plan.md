# Sprint 2: Search & Discovery

**Duración**: Días 7-12
**Estado**: ⬜ Not Started
**Prioridad**: 🔴 Crítico
**Dependencia**: Sprint 1 completado

---

## Objetivos del Sprint

1. Implementar búsqueda de vehículos con mapas
2. Crear componentes de Vehicle Card y lista
3. Implementar sistema de filtros avanzados
4. Crear pantalla de detalle de vehículo
5. Agregar badge de Instant Book

---

## Agentes Asignados

### Primary: `react-specialist`
**Responsabilidades**:
- Vehicle search hooks con TanStack Query
- Filter state management
- Performance optimization para listas

### Secondary: `frontend-developer`
**Responsabilidades**:
- Map integration con react-native-maps
- VehicleCard molecule
- FiltersSheet bottom sheet
- Vehicle detail screen

### Support: `typescript-pro`
**Responsabilidades**:
- Search criteria types
- Vehicle interfaces
- Filter types

### Validation: `ux-researcher`
**Responsabilidades**:
- Validar UX de búsqueda
- Revisar filtros intuitivos
- Verificar performance percibido

---

## Entregables

| Día | Entregable | Agente | Archivos |
|-----|------------|--------|----------|
| 7-8 | Map integration | frontend-developer | `components/organisms/MapWithVehicles/` |
| 7-8 | Search hooks | react-specialist | `hooks/useVehicleSearch.ts` |
| 9-10 | VehicleCard | frontend-developer | `components/molecules/VehicleCard/` |
| 9-10 | FiltersSheet | frontend-developer | `components/molecules/FiltersSheet/` |
| 11-12 | Vehicle Detail | frontend-developer | `app/vehicle/[id].tsx` |
| 11-12 | UX Validation | ux-researcher | Documento de validación |

---

## Criterios de Aceptación

- [ ] Usuario puede ver vehículos en mapa con markers
- [ ] Usuario puede filtrar por tipo, precio, transmisión, features
- [ ] Usuario puede ver badge de Instant Book en vehicles elegibles
- [ ] Usuario puede ver detalle completo de vehículo
- [ ] Performance: lista de 50+ vehículos sin lag

---

## Referencias

- `ux-research/ux_flows_specification.md` - Search flow
- `docs/PLAN_REACT_NATIVE_EXPO.md` - Sprint 2 details
