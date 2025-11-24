## Funcionalidades “plus” validadas para Carsharing ES

Este documento agrupa funcionalidades de alto impacto observadas en el mercado (Turo/Getaround/HyreCar y similares) y priorizables para fases posteriores al MVP. Sirve como catálogo de ideas y criterios de diseño/implementación.

### Conversión y experiencia
- Precio total transparente: desglose siempre visible (tarifa base, servicio, impuestos, seguro si aplica).
- Reserva inmediata vs. solicitud: modo configurable por vehículo/host.
- Promos y cupones: primer viaje, referidos, estacionalidad, campañas locales.
- Favoritos y alertas: guardar vehículos; alertas por baja de precio o disponibilidad en fechas guardadas.
- Entrega flexible: pickup/drop-off en aeropuertos y hotspots; tarifas por entrega.
- Depósito de seguridad dinámico: ajustado por riesgo (KYC, historial, valor del vehículo, horario).

### Confianza y seguridad
- Protecciones/seguro por nivel: básico/estándar/premium con coberturas y deducibles claros.
- Verificación avanzada: liveness selfie, OCR documento, validación de edad/licencia.
- Fotos pre y post viaje guiadas: checklist de evidencias con timestamps y geolocalización opcional.
- Scoring de riesgo: reglas simples (horario nocturno, zonas, valor del auto, usuario nuevo).
- Mensajería in‑app: chat moderado con filtros anti-fraude.
- Reputación: reviews con criterios (limpieza, puntualidad, comunicación) y respuestas del host.

### Monetización y retención
- Tarifas variables: por demanda (findes, feriados, eventos locales).
- Add-ons: asientos bebé, racks, limpieza, kilómetros extra, wifi.
- Programas de fidelidad: niveles con beneficios (menor fee, soporte prioritario).
- Cancelación flexible como producto: upgrades para huéspedes que deseen cambiar planes.

### Operaciones y eficiencia
- Calendario host pro: sync Google/Apple, blackout dates, precios por día.
- Plantillas de respuesta: respuestas rápidas para hosts y soporte.
- Resolución de disputas: flujo guiado con evidencias, ventanas y SLA.
- Motor de políticas: reglas parametrizables (cancelación, retrasos, combustible, kilometraje).
- Reportes financieros: ingresos por vehículo, fees, impuestos estimados.

### Descubrimiento y crecimiento
- SEO de listados: páginas públicas por vehículo y zonas con metadatos y schema.org.
- Referrals de dos lados: host/guest con recompensas y seguimiento.
- Campañas locales: códigos por zonas (playas, aeropuertos) y temporadas.
- Notificaciones segmentadas: push/email según comportamiento (abandono reserva, KYC pendiente).

### Localización El Salvador
- Pagos locales (futuros): tarjetas débito/crédito locales; opciones alternativas si aplica.
- Soporte fiscal: NIT opcional para hosts, comprobantes básicos.
- Zonas seguras: sugerencias de meetup vigiladas y horarios recomendados.
- Idioma y moneda: español y USD con formatos locales.

### Backoffice (calidad y control)
- Colas de revisión KYC con priorización por riesgo y SLA.
- Detección de duplicados: usuarios/vehículos repetidos mediante heurísticas.
- Playbooks de soporte: flujos predefinidos (no‑show, daños, retrasos) con acciones rápidas.
- Etiquetas de riesgo y monitoreo: marcar cuentas/vehículos para seguimiento.

### Mobile app UX
- Cierre en 3 pasos: fechas → vehículo → pago; total siempre visible.
- Búsqueda map‑first: clusters, filtros contextuales y estados vacíos útiles.
- Estado de KYC claro: barra de progreso, tiempos estimados, checklist.
- Modo offline parcial: persistencia de última búsqueda y reservas recientes.

### Priorización sugerida (fase 1.1)
1) Fotos pre/post guiadas + checklist (reduce disputas y mejora confianza).
2) Favoritos y alertas (mejora retorno y conversión diferida).
3) Calendario host pro con precios por día (optimiza ingresos y disponibilidad).
4) Colas KYC con SLA y auditoría (eleva calidad operativa).
5) Map‑first search (mejor descubrimiento).
6) Programas de cupones y referidos (crecimiento orgánico controlado).

