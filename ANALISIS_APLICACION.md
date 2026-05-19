# Gesportín — Análisis de la Aplicación

## 📋 Descripción General

**Gesportín** es una plataforma integral de gestión deportiva diseñada para optimizar la administración de clubes y organizaciones deportivas. La aplicación mejora la eficiencia de la gestión deportiva, facilitando la colaboración y manteniendo informados a todos los miembros de los clubes sobre sus actividades.

---

## 🎯 Problemas que Resuelve

### 1. **Gestión de Clubes**
- Registro, perfilamiento y administración de organizaciones deportivas
- Gestión de datos de contacto y ubicación
- Control de imágenes y branding del club

### 2. **Gestión de Participantes**
- Sistema rolista completo (Administrador, Administrador de Club, Usuario)
- Gestión de miembros con diferentes roles: presidente, secretario, entrenador, jugador, socio
- Control de acceso y permisos según tipo de usuario

### 3. **Gestión de Estructura Deportiva**
- Creación de temporadas (ej: 2024-2025, 2025-2026)
- Organización de categorías por edad/nivel
- Creación y administración de equipos
- Gestión de jugadores con información detallada (dorsal, posición, capitán)

### 4. **Organización de Competiciones**
- Programación y seguimiento de partidos
- Registro de resultados y estadísticas
- Gestión de ligas y torneos
- Seguimiento del estado de los partidos

### 5. **Gestión Financiera**
- Administración de cuotas y membresías
- Seguimiento de pagos de jugadores
- Sistema de facturación
- Control de deudas y pagos pendientes

### 6. **Comunicación Interna**
- Publicación de noticias del club
- Sistema de comentarios en noticias
- Sistema de valoración de noticias
- Información en tiempo real para miembros

### 7. **E-commerce Deportivo**
- Catálogo de productos deportivos (camisetas, equipamiento, ropa)
- Sistema de carrito de compras
- Gestión de compras y facturas
- Sistema de comentarios y valoraciones de productos

---

## 🏗️ Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────┐
│     Frontend (Angular 20 + TypeScript + Bootstrap)       │
│              Directorio: /frontsportin                   │
│  - Interfaz moderna y responsiva                        │
│  - Componentes CRUD para cada entidad                   │
│  - Sistema de navegación y autenticación                │
└─────────────────────────────────────────────────────────┘
                            ↓ REST API
┌─────────────────────────────────────────────────────────┐
│       Backend (Java + Spring Boot)                       │
│              Directorio: /gesportin                      │
│  - API RESTful para todas las operaciones               │
│  - Lógica de negocio y validaciones                     │
│  - Control de acceso basado en roles                    │
└─────────────────────────────────────────────────────────┘
                            ↓ JDBC
┌─────────────────────────────────────────────────────────┐
│         Base de Datos Relacional (MySQL)                 │
│              Script: /.github/database.sql               │
│  - Almacenamiento persistente de datos                  │
│  - 23 tablas con relaciones complejas                   │
└─────────────────────────────────────────────────────────┘
```

### **Stack Tecnológico**

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | Angular | 20.3.0 |
| **Lenguaje Frontend** | TypeScript | 5.9.2 |
| **Estilos** | Bootstrap | 5.3.8 |
| **Iconos** | Bootstrap Icons | 1.13.1 |
| **Gestión Reactiva** | RxJS | 7.8.0 |
| **Backend** | Spring Boot | 4.0.1 |
| **Java** | OpenJDK | 17 |
| **Auth** | JJWT (io.jsonwebtoken) | 0.11.5 |
| **Base de Datos** | MySQL | Relacional |
| **Testing** | Jasmine/Karma | 5.9.0/6.4.0 |

---

## 📁 Estructura del Frontend

La aplicación está organizada por **capas planas** (no por feature). Cada entidad tiene su modelo,
su servicio HTTP y sus páginas enrutadas, pero todos viven en carpetas globales — no hay
agrupación por feature dentro del árbol `src/app/`.

```
frontsportin/src/app/
├── model/                # Interfaces TypeScript planas, una por entidad (I<Entidad>)
├── service/              # Servicios HTTP planos, uno por entidad (<Entidad>Service)
├── guards/               # AdminGuard, ClubAdminGuard, UsuarioGuard, AuthGuard
├── environment/          # serverURL y configuración por entorno
├── interceptor/          # HTTP interceptors (token JWT, errores)
├── page/                 # ← Páginas enrutadas (lo que se navega)
│   └── <entidad>/{admin,teamadmin,usuario}/{plist,view,new,edit,delete}/
├── component/            # Componentes reutilizables / standalone
│   ├── <entidad>/        # Carpeta histórica por entidad (algunos componentes auxiliares)
│   └── shared/           # Sidebar, dashboard de contadores, modal, paginación, etc.
└── app.routes.ts         # ← TODAS las rutas registradas en un único archivo
```

### Entidades cubiertas (23 module-folders bajo `component/` y `page/`)

```
articulo, carrito, categoria, club, comentario, comentarioart, compra, cuota,
equipo, estadopartido, factura, jugador, liga, noticia, pago, partido,
puntuacion, rolusuario, temporada, tipoarticulo, tipousuario, usuario  +  shared
```

> ⚠️ **`puntuacionart`** existe como entidad backend (`PuntuacionartEntity`), servicio frontend
> (`service/puntuacionart.ts`) y modelo (`model/puntuacionart.ts`), pero **no tiene UI propia**
> (no hay carpeta `page/puntuacionart/` ni `component/puntuacionart/`).

### Estructura de cada feature en `page/`

```
page/<entidad>/
├── admin/                # Vista para Administrador global (tipousuario.id = 1)
│   ├── plist/            # Lista paginada (plist.ts, plist.html, plist.css)
│   ├── view/             # Detalle
│   ├── new/              # Crear
│   ├── edit/             # Editar
│   └── delete/           # Confirmar borrado
├── teamadmin/            # Vista para Administrador de Club (tipousuario.id = 2)
│   └── ... (mismas 5 subcarpetas, no siempre todas)
└── usuario/              # Vista para Usuario final (tipousuario.id = 3)
    └── ... (subset, solo las necesarias)
```

> Naming verificado en el repo:
> - Los ficheros se llaman literalmente `plist.ts`, `view.ts`, `new.ts`, `edit.ts`, `delete.ts`
>   (sin prefijo de entidad en el nombre del fichero).
> - Las clases exportadas sí llevan prefijo: `EquipoTeamadminPlistPage`, `JugadorAdminViewPage`, etc.
> - **No existe** ningún `<entidad>.routes.ts` — todas las rutas se registran en `app.routes.ts`.
> - **No existen** carpetas `service/` ni `model/` dentro de cada feature; están planas en
>   `src/app/service/<entidad>.ts` y `src/app/model/<entidad>.ts`.

### Estructura del Backend

```
gesportin/src/main/java/net/ausiasmarch/gesportin/
├── GesportinApplication.java
├── api/             # Controllers REST  →  clases XxxApi.java   (NO XxxController)
├── service/         # Lógica de negocio →  clases XxxService.java
├── entity/          # JPA entities      →  clases XxxEntity.java   (23 entidades)
├── repository/      # Spring Data       →  interfaces XxxRepository
├── dto/             # DTOs
├── bean/            # SessionBean, TokenBean, ExceptionBean
├── filter/          # Filtros HTTP (JWT)
└── exception/       # Excepciones de dominio
```

> ⚠️ **No existe** paquete `/controller/`. Los controllers REST se llaman `XxxApi`
> (`EquipoApi.java`, `PagoApi.java`, etc.).

---

## 📊 Modelo de Datos

La aplicación utiliza un modelo de datos con **23 entidades** organizadas en una jerarquía de expansión de hasta 6 niveles.

### **Entidades Raíz** (sin dependencias)

```
├── tipousuario     # Tipos de usuario: Administrador, Admin Club, Usuario
├── rolusuario      # Roles: Socio, Entrenador, Jugador, etc.
└── club            # Punto de entrada del sistema (multi-tenancy)
```

### **Jerarquía de Datos**

```
club (raíz)
├── temporada
│   └── categoria
│       └── equipo
│           ├── jugador (usuario + equipo)
│           ├── cuota
│           │   └── pago (jugador + cuota)
│           └── liga
│               └── partido
├── usuario
│   ├── tipousuario
│   ├── rolusuario
│   ├── comentario (noticia + usuario)
│   ├── puntuacion (noticia + usuario)
│   └── factura
│       └── compra (articulo + factura)
├── noticia
│   ├── comentario
│   └── puntuacion
├── tipoarticulo
│   └── articulo
│       ├── carrito (usuario + articulo)
│       ├── comentarioart (usuario + articulo)
│       └── compra (articulo + factura)
```

### **Profundidades de Expansión**

| Entidad | Profundidad | Ruta más larga |
|---------|------------|----------------|
| `usuario` | 1 | `usuario.club` |
| `articulo` | 2 | `articulo.tipoarticulo.club` |
| `equipo` | 3 | `equipo.categoria.temporada.club` |
| `jugador` | 4 | `jugador.equipo.categoria.temporada.club` |
| `partido` | 5 | `partido.liga.equipo.categoria.temporada.club` |
| `pago` | 5 | `pago.cuota.equipo.categoria.temporada.club` |

---

## 🔐 Sistema de Roles y Permisos

### **Tipos de Usuario (tipousuario)**

| ID | Descripción | Nivel |
|----|-------------|-------|
| 1 | Administrador | Global |
| 2 | Administrador de Club | Club |
| 3 | Usuario | Básico |

### **Roles de Usuario (rolusuario)**

- **Socio**: Miembro del club con acceso a información general
- **Entrenador**: Acceso a gestión de equipos y jugadores
- **Jugador**: Acceso a información de su equipo
- **Presidente**: Administrador principal del club
- **Secretario**: Administrador de operaciones

---

## 🎯 Características Clave

### 1. **Multi-tenancy**
- Sistema construido con `club` como unidad principal de separación
- Aislamiento de datos entre clubes
- Administrador de club puede gestionar su organización

### 2. **CRUD por entidad (no siempre completo en todos los roles)**
- La mayoría de entidades expone CRUD completo bajo el rol `admin`.
- El rol `teamadmin` cubre las entidades relevantes para gestión de un club (sin
  acceso a entidades globales como `tipousuario`, `rolusuario`, `estadopartido`).
- El rol `usuario` solo expone vistas de lectura sobre lo que le afecta
  (sus equipos, sus cuotas, sus facturas, noticias del club, tienda).
- `comentarioart` en `teamadmin` solo tiene `plist` + `view` (sin new/edit/delete).
- `puntuacionart` no tiene UI en ningún rol.
- Validaciones en backend (Spring Validation) y frontend (Angular forms).

### 3. **Relaciones Complejas**
- Jerarquía profunda de datos
- Serialización JSON con expansión automática
- Contadores para colecciones lazy

### 4. **E-commerce Integrado**
- Catálogo de productos
- Carrito de compras
- Procesamiento de pedidos
- Sistema de valoraciones y comentarios

### 5. **Comunicación Social**
- Publicación de noticias
- Comentarios y debates
- Sistema de valoraciones/me gusta

### 6. **Gestión de Pagos**
- Cuotas de membresía
- Pagos de jugadores
- Facturas y comprobantes
- Seguimiento de deudas

---

## 📝 Documentación Disponible

La aplicación incluye documentación detallada en `/.github/references/`:

- `api.md` — Referencia de endpoints API
- `backend.md` — Arquitectura backend
- `database.md` — Esquema de base de datos
- `entidades.md` — Estructura de entidades JSON
- `frontend.md` — Estructura frontend
- `diseño-1.md`, `diseño-2.md`, `diseño-3.md` — Documentos de diseño
- `permisos.md` — Sistema de permisos
- `roles.md` — Definición de roles
- `integridad.md` — Validaciones de integridad
- `error.md` — Manejo de errores
- `references.md` — Referencias y enlaces externos

Además, en la raíz de `.github/`:
- `database.sql` — Script SQL completo de creación e inserción de datos seed
- `copilot-instructions.md` — Instrucciones para asistentes IA
- `gesportin.drawio` — Diagrama de arquitectura

---

## 🚀 Estado de Desarrollo

- ✅ **Funcionalidad**: Aplicación completamente funcional
- ✅ **Uso**: Utilizada actualmente en formación de desarrolladores
- ✅ **Mantenimiento**: Código activamente mantenido
- 📜 **Licencia**: No incluida en el repositorio (sin archivo `LICENSE`)

---

## 🔧 Scripts de Desarrollo

```bash
# Frontend
cd frontsportin
npm start              # Inicia servidor de desarrollo (http://localhost:4200)
npm run build          # Compilación para producción
npm run watch          # Build en modo observación
npm test               # Ejecutar tests unitarios (Jasmine/Karma)

# Backend
cd gesportin
./mvnw spring-boot:run # Inicia backend (http://localhost:8080)
./mvnw test            # Ejecutar tests
./mvnw package         # Empaquetar JAR
```

> ℹ️ El repositorio **no contiene** una carpeta `scripts/` con generadores de código.
> La creación de nuevas features se hace manualmente siguiendo las convenciones documentadas.

---

## 📌 Resumen Ejecutivo

**Gesportín** es una solución empresarial completa para la gestión de clubes deportivos que combina:

1. **Administración operativa**: Gestión de estructuras, usuarios y roles
2. **Gestión deportiva**: Temporadas, categorías, equipos, partidos
3. **Finanzas**: Cuotas, pagos, facturas
4. **E-commerce**: Tienda de equipamiento deportivo
5. **Comunicación**: Noticias y sistema social

Su arquitectura moderna basada en Angular + Spring Boot + MySQL la hace escalable, mantenible y lista para producción. Es ideal tanto para clubes pequeños como para organizaciones grandes con múltiples sedes (multi-tenancy).
