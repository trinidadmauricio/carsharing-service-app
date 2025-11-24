# Sprint 6: Polish + ID Verification + Risk Refinement

**Duración**: Días 31-36
**Estado**: ⬜ Not Started
**Prioridad**: 🟡 Importante

---

## Objetivos

1. Implementar Digital ID Verification con liveness detection
2. Refinar Risk Scoring system
3. Optimizar performance y seguridad
4. Preparar para beta testing
5. App Store preparation

---

## Agentes Asignados

| Agente | Rol | Responsabilidad |
|--------|-----|-----------------|
| `frontend-developer` | Primary | ID capture UI, Liveness detection |
| `react-specialist` | Secondary | Verification flow |
| `typescript-pro` | Support | Verification types |
| `ux-researcher` | Validation | Final UX audit |

---

## Entregables Clave

- `components/molecules/IDVerificationFlow/` - Complete verification
- `app/(auth)/register/license.tsx` - Enhanced with face match
- `components/molecules/RiskScoreBadge/` - Risk display
- Performance audit report
- Security audit report
- Beta builds (TestFlight/Internal Testing)

---

## Criterios de Aceptación

- [ ] ID verification incluye face match
- [ ] Liveness detection previene fotos estáticas
- [ ] Risk score se muestra a hosts
- [ ] Test coverage > 85%
- [ ] Lighthouse score > 90
- [ ] Security audit passed
