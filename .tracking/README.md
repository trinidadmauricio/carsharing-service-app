# Feature Tracking System

Este directorio contiene el sistema de tracking para el desarrollo del proyecto Carsharing App.

## Estructura

```
.tracking/
├── README.md                    # Este archivo
├── MASTER_PROGRESS.md           # Vista general del progreso
├── sprint-01-foundation/        # Sprint 1: Foundation & Registration
│   ├── plan.md                  # Plan detallado de la feature
│   ├── tasks.md                 # Lista de tareas con estados
│   └── summary.md               # Resumen de lo completado
├── sprint-02-search/            # Sprint 2: Search & Discovery
├── sprint-03-booking/           # Sprint 3: Booking + Protection Plans
├── sprint-04-host/              # Sprint 4: Host Onboarding + Smart Pricing
├── sprint-05-trip/              # Sprint 5: Trip Management + Claims
├── sprint-06-polish/            # Sprint 6: Polish + ID Verification
├── sprint-07-keyless/           # Sprint 7: Keyless Access (Post-Launch)
├── sprint-08-teams/             # Sprint 8: Host Teams (Post-Launch)
└── sprint-09-advanced/          # Sprint 9: Advanced Features (Post-Launch)
```

## Convenciones

### Estados de Tareas

| Estado | Significado |
|--------|-------------|
| `[ ]` | Pendiente |
| `[~]` | En progreso |
| `[x]` | Completado |
| `[!]` | Bloqueado |
| `[-]` | Cancelado |

### Archivos por Feature

1. **plan.md**: Contiene el plan detallado, objetivos, criterios de aceptación, y agentes asignados
2. **tasks.md**: Lista granular de tareas con checkboxes y asignaciones
3. **summary.md**: Resumen ejecutivo de lo completado, métricas, y lecciones aprendidas

### Agentes Asignados

Cada feature puede usar los siguientes agentes especializados:

| Agente | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Frontend Developer | `.claude/01-core-development/frontend-developer.md` | UI components, Atomic Design, accessibility |
| React Specialist | `.claude/02-language-specialists/react-specialist.md` | React patterns, hooks, performance |
| TypeScript Pro | `.claude/02-language-specialists/typescript-pro.md` | Type safety, interfaces, advanced types |
| Next.js Developer | `.claude/02-language-specialists/nextjs-developer.md` | SSR, routing, server components (adaptado a Expo Router) |
| UX Researcher | `.claude/08-business-product/ux-researcher.md` | User research, usability, insights |

## Flujo de Trabajo

1. **Inicio de Sprint**: Crear carpeta del sprint y archivos base
2. **Durante Sprint**: Actualizar `tasks.md` con progreso
3. **Fin de Sprint**: Completar `summary.md` con resultados y métricas
4. **Review**: Actualizar `MASTER_PROGRESS.md` con estado general

## Comandos Útiles

```bash
# Ver progreso general
cat .tracking/MASTER_PROGRESS.md

# Ver tareas de un sprint específico
cat .tracking/sprint-01-foundation/tasks.md

# Buscar tareas bloqueadas
grep -r "\[!\]" .tracking/
```
