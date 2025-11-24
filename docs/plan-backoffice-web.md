## Backoffice Web (Next.js) — Plan de implementación

### Objetivo
Panel web para equipo interno (admin, support) y, en una fase posterior, anfitriones. Permite gestionar usuarios, vehículos, reservas, revisar KYC, operar reembolsos/cancelaciones y monitorear métricas.

### Principios clave
- Seguridad primero: JWT en cookies HttpOnly, RBAC estricto, CSRF y rate limiting vía API.
- Productividad: tablas potentes (filtros, sort, paginación), vistas vacías útiles y acciones en bloque.
- Observabilidad: auditoría y métricas mínimas para operaciones.

### Stack
- Next.js 14 (App Router) + TypeScript.
- UI: Tailwind CSS + Radix/Headless UI; TanStack Table para listados.
- Data: React Query para caché de datos y estados de carga.
- Autenticación: JWT vía cookies HttpOnly emitidas por la API.

### Roles y permisos
- admin: acceso total.
- support: lectura y acciones delimitadas (reembolsos según política, bloquear cuenta, marcar sospechoso).
- host (opcional futura): gestionar sus propios vehículos y reservas.

### Páginas y rutas
- `/login`: formulario de acceso.
- `/dashboard`: métricas clave: reservas/día, GMV, usuarios nuevos, tasa KYC.
- `/users`: listado, filtros por estado/rol; detalle con acciones (activar/bloquear, ver KYC).
- `/vehicles`: listado y detalle; aprobación/moderación de publicaciones.
- `/bookings`: listado y detalle; acciones de cancelación/reembolso.
- `/kyc`: cola de revisión; detalle con evidencias (documentos/selfie), aprobar/rechazar con motivo.

### Componentes UI base
- Layout con barra lateral y topbar.
- DataTable con filtros guardables, columnas configurables, exportación CSV.
- Drawer/Sheet para ediciones rápidas; Dialog para confirmaciones críticas.
- Form components (Input, Select, Textarea, Switch) tipados.

### Integración con API
- Autenticación: cookie HttpOnly establecida por la API tras login.
- Fetchers: capa `apiClient` que adjunta credenciales y maneja 401/refresh (si aplica cookie + refresh).
- Endpoints usados (referencia):
  - GET `/admin/metrics`
  - GET `/users`, GET `/users/:id`, PATCH `/users/:id`
  - GET `/vehicles`, GET `/vehicles/:id`, PATCH `/vehicles/:id`
  - GET `/bookings`, GET `/bookings/:id`, PATCH `/bookings/:id/cancel`
  - GET `/kyc`, GET `/kyc/:id`, POST `/kyc/:id/decision`
  - POST `/refunds`

### Flujos operativos clave
- Revisión KYC: listar pendientes → abrir detalle → ver evidencias → aprobar/rechazar con causa → registrar en auditoría.
- Reembolso/cancelación: desde detalle de booking, simular cálculo (reglas de negocio) → confirmar → API ejecuta Stripe → actualizar estado.
- Moderación de vehículos: aprobar publicación, marcar sospechoso, despublicar.

### Seguridad
- Cookies HttpOnly + SameSite, CSRF token en formularios mutables, headers de seguridad (CSP, no sniff, frameguard en hosting).
- No exponer secretos en frontend; todas las operaciones sensibles pasan por API.

### Accesibilidad y UX
- Navegación por teclado, roles ARIA, estados vacíos con CTA.
- Indicadores claros de estados (pending/approved/rejected), semáforos de riesgo.

### Telemetría
- Sentry para errores y performance; eventos clave (kyc_decision, refund_issued).

### Estructura sugerida del repo
```
app/
  login/
  dashboard/
  users/
  vehicles/
  bookings/
  kyc/
components/
lib/
styles/
```

### Estrategia de pruebas (sin código, definición)
- Unitarias de componentes puros y lógica de tablas/formatos.
- Tests de integración de páginas críticas (login, KYC decision flow) con Playwright.

### Checklist de aceptación MVP (backoffice)
- Login con cookies HttpOnly.
- Tablas de Users/Vehicles/Bookings con filtros y paginación.
- Revisión KYC con evidencias y decisión.
- Cancelación/reembolsos con cálculo basado en política.
- Dashboard con 4 métricas básicas.

### Roadmap 1.1 (backoffice)
- Exportaciones avanzadas, vistas guardadas por usuario.
- Alertas operativas (colas > SLA, picos de cancelaciones).
- Detección de duplicados (heurísticas) y etiquetas de riesgo.

