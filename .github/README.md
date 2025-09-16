# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para automatizar el CI/CD del proyecto Cat Lovers Paradise.

## 📋 Workflows Disponibles

### 1. **CI - Continuous Integration** (`ci.yml`)
- **Trigger**: Push a `main`/`develop` y Pull Requests
- **Funciones**:
  - Ejecuta pruebas en Node.js 18.x y 20.x
  - Ejecuta linting con ESLint
  - Ejecuta pruebas unitarias
  - Genera reportes de cobertura
  - Construye la aplicación
  - Escanea vulnerabilidades de seguridad

### 2. **CD - Continuous Deployment** (`cd.yml`)
- **Trigger**: Push a `main` y manual dispatch
- **Funciones**:
  - Despliegue automático a staging
  - Despliegue manual a producción
  - Despliegue via FTP
  - Health checks post-despliegue
  - Notificaciones de estado

### 3. **Security Scan** (`security.yml`)
- **Trigger**: Programado (lunes 2 AM), push y PRs
- **Funciones**:
  - Escaneo de dependencias vulnerables
  - Análisis de código con Snyk
  - Escaneo de secretos con TruffleHog
  - Análisis de código con CodeQL

### 4. **Database Operations** (`database.yml`)
- **Trigger**: Manual dispatch
- **Funciones**:
  - Migraciones de base de datos
  - Backup de base de datos
  - Restauración de base de datos
  - Seeding de datos iniciales

### 5. **Notifications** (`notifications.yml`)
- **Trigger**: Completado de workflows, push, PRs
- **Funciones**:
  - Notificaciones de Slack
  - Notificaciones por email
  - Reportes de estado de despliegue

## 🔧 Configuración Requerida

### Secrets de GitHub

Configura los siguientes secrets en tu repositorio:

#### **Base de Datos**
- `DB_HOST`: Host de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos

#### **Servidores**
- `STAGING_HOST`: IP del servidor de staging
- `STAGING_USERNAME`: Usuario SSH para staging
- `STAGING_SSH_KEY`: Clave SSH privada para staging
- `STAGING_PORT`: Puerto SSH para staging
- `PRODUCTION_HOST`: IP del servidor de producción
- `PRODUCTION_USERNAME`: Usuario SSH para producción
- `PRODUCTION_SSH_KEY`: Clave SSH privada para producción
- `PRODUCTION_PORT`: Puerto SSH para producción
- `PRODUCTION_URL`: URL de producción para health checks

#### **FTP (Opcional)**
- `FTP_SERVER`: Servidor FTP
- `FTP_USERNAME`: Usuario FTP
- `FTP_PASSWORD`: Contraseña FTP
- `FTP_SERVER_DIR`: Directorio en el servidor FTP

#### **Notificaciones**
- `SLACK_WEBHOOK`: URL del webhook de Slack
- `EMAIL_USERNAME`: Usuario de email para notificaciones
- `EMAIL_PASSWORD`: Contraseña de email
- `ADMIN_EMAIL`: Email del administrador

#### **Seguridad**
- `SNYK_TOKEN`: Token de Snyk para escaneo de vulnerabilidades

## 🚀 Uso

### Despliegue Automático
1. Haz push a la rama `main`
2. El workflow de CI se ejecutará automáticamente
3. Si las pruebas pasan, se desplegará a staging
4. Recibirás notificaciones en Slack

### Despliegue Manual a Producción
1. Ve a **Actions** → **CD - Continuous Deployment**
2. Haz clic en **Run workflow**
3. Selecciona `production` como environment
4. Confirma la ejecución

### Operaciones de Base de Datos
1. Ve a **Actions** → **Database Operations**
2. Haz clic en **Run workflow**
3. Selecciona la operación:
   - `migrate`: Ejecutar migraciones
   - `backup`: Crear backup
   - `restore`: Restaurar backup
   - `seed`: Poblar con datos iniciales
4. Selecciona el environment
5. Confirma la ejecución

## 📊 Monitoreo

### Health Checks
- `/health`: Estado general de la aplicación
- `/ready`: Verificación de disponibilidad
- `/live`: Verificación de que la aplicación está ejecutándose

### Logs
- Revisa los logs en la pestaña **Actions** de GitHub
- Los logs de aplicación están en el servidor de producción

### Notificaciones
- Slack: Canal `#deployments`
- Email: Notificaciones de fallos críticos

## 🔒 Seguridad

- Todas las claves y secretos están en GitHub Secrets
- Los workflows usan permisos mínimos necesarios
- Escaneo automático de vulnerabilidades
- Backup automático de base de datos

## 📝 Mantenimiento

### Actualizar Dependencias
- Dependabot creará PRs automáticamente
- Revisa y aprueba las actualizaciones de seguridad
- Las actualizaciones menores se pueden auto-mergear

### Actualizar Workflows
- Los workflows están versionados
- Usa `actions/checkout@v4` para la última versión
- Mantén las dependencias actualizadas

## 🆘 Solución de Problemas

### Workflow Fallido
1. Revisa los logs en GitHub Actions
2. Verifica que todos los secrets estén configurados
3. Revisa la conectividad con los servidores
4. Verifica que las dependencias estén instaladas

### Despliegue Fallido
1. Verifica la conectividad SSH
2. Revisa los permisos del usuario
3. Verifica que el directorio de destino exista
4. Revisa los logs del servidor

### Base de Datos
1. Verifica la conectividad a la base de datos
2. Revisa que las credenciales sean correctas
3. Verifica que el usuario tenga permisos necesarios
4. Revisa los logs de migración
