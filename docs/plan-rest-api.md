## REST API (Node.js + TypeScript) — Plan de implementación

### Objetivo
Proveer API JSON para App y Backoffice, encapsulando negocio: auth, KYC, catálogo, disponibilidad, reservas, pagos server-only (Stripe), webhooks, políticas y reporting básico. Enfoque TDD-first y arquitectura por capas.

### Principios
- TDD-first: cada módulo con unit/integration tests antes de exponer endpoints.
- Arquitectura en capas: controllers → services → repositories → domain (entidades y reglas).
- Validación estricta (Zod) y tipado end-to-end.
- Pagos solo desde servidor; la app nunca manipula el SDK de Stripe directamente.

### Stack
- Node.js + TypeScript (Express o Fastify; Express para MVP).
- ORM: Prisma + PostgreSQL.
- Validación: Zod.
- Auth: JWT (access/refresh), bcrypt.
- Docs: OpenAPI 3 → Redoc.
- Infra local: Docker Compose (Postgres, opcional Redis para rate limit y colas).
- Logs: Pino; Healthchecks; métricas básicas.

### Estructura del proyecto
```
src/
  app.ts (bootstrap)
  config/
  modules/
    auth/
    kyc/
    users/
    vehicles/
    availability/
    bookings/
    payments/
    admin/
  shared/
    http/
    db/
    middlewares/
    utils/
tests/
prisma/
```

### Modelo de datos (alto nivel)
- User(id, role[guest|host|admin|support], email, name, hashedPassword, status)
- KycCase(id, userId, status[pending|approved|rejected], providerRef, createdAt, decidedAt, reviewerId?, reason?)
- Vehicle(id, hostId, title, desc, photos[], location, pricePerDay, status)
- Availability(id, vehicleId, startDate, endDate)
- Booking(id, userId, vehicleId, startDate, endDate, priceTotal, status[pending|confirmed|cancelled])
- Payment(id, bookingId, stripePaymentIntentId|checkoutSessionId, amount, status)
- AuditLog(id, actorId, action, entity, entityId, meta, createdAt)

### Endpoints (MVP)
- Auth: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/reset
- Users: GET /users/me
- KYC: POST /kyc/files, GET /kyc/me, POST /kyc/:id/decision (admin)
- Vehicles: GET /vehicles, GET /vehicles/:id, POST /vehicles (host), PUT /vehicles/:id (host/admin)
- Availability: GET /vehicles/:id/availability, POST /vehicles/:id/availability (host)
- Bookings: POST /bookings (valida disponibilidad, calcula precio, crea pending), GET /bookings/:id
- Payments: POST /payments/checkout, POST /webhooks/stripe, POST /refunds
- Admin: GET /admin/metrics

### Contratos y validaciones
- Zod schemas por endpoint (request/response). OpenAPI generado desde definiciones para Redoc.
- Reglas de negocio clave:
  - Disponibilidad: no solapar rangos para el mismo vehículo.
  - Precio: base por día + tarifa servicio fija (configurable) y ajustes futuros.
  - Cancelación: ≥48h reembolso total; <48h 50% (parametrizable en tabla de políticas).

### Pagos (server-only)
- Crear PaymentIntent/Checkout Session en Stripe desde `/payments/checkout` con metadata (bookingId, userId).
- Webhook `/webhooks/stripe` marca Payment y Booking como `confirmed` tras `payment_intent.succeeded`.
- Refunds desde `/refunds` con validación de política; registra en AuditLog.

### Seguridad
- JWT access/refresh; rotación y revocación de refresh tokens.
- Rate limiting por IP/usuario; protección CSRF no requerida para API REST con tokens, pero considerar para backoffice cookie + same-site.
- Sanitización de inputs y validación exhaustiva; hashing bcrypt.
- RBAC a nivel de rutas y dentro de servicios.

### TDD-first y pruebas
- Unit tests: services puros (cálculo precio, reglas cancelación, validación disponibilidad).
- Integration tests: rutas con supertest (auth, bookings, payments webhook simulado).
- Seeds para escenarios de prueba (2 usuarios, 1 host, 3 vehículos, 1 booking).

### Observabilidad y auditoría
- Pino con correlación (request id), niveles por entorno.
- AuditLog para decisiones KYC, reembolsos, cambios de estado críticos.

### Documentación (Redoc)
- Generar OpenAPI automáticamente desde rutas/validators.
- Publicar `/docs` en entorno dev/stage, protegido en prod.

### Docker y Dev
- Dockerfile multistage (builder + runtime) y `docker-compose.yml` con Postgres (y Redis opcional).
- Scripts: `dev`, `test`, `lint`, `migrate`, `seed`, `gen:openapi`.

### Checklist de aceptación MVP (API)
- Auth completa con refresh, pruebas unitarias e integración.
- KYC flujo end-to-end (upload, estado, decisión admin) con auditoría.
- Vehicles/Availability funcionales con reglas de no solapamiento.
- Bookings con cálculo de precio y estados.
- Payments: checkout server-only, webhook que confirma booking, refunds bajo políticas.
- Redoc operativo y CI con lint+tests verdes.

### Roadmap 1.1 (API)
- Tarifas dinámicas, add-ons, paquetes de protecciones.
- Colas para verificación KYC y webhooks resilientes (reintentos).
- Métricas Prometheus-ready y dashboards.

