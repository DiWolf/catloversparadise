# Configuración de Email - Cat Lovers Paradise

## Descripción
El formulario de contacto ahora puede enviar emails a `contacto@catloversparadise.org` con la información del usuario.

## Configuración Requerida

### 1. Variables de Entorno
Agrega las siguientes variables a tu archivo `.env`:

```env
# Configuración de Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
BASE_URL=http://localhost:3000
```

### 2. Configuración de Gmail (Recomendado)
1. Ve a tu cuenta de Gmail
2. Activa la verificación en 2 pasos
3. Genera una "Contraseña de aplicación" específica para esta aplicación
4. Usa esa contraseña en `SMTP_PASS`

### 3. Otras opciones de SMTP
Puedes usar cualquier proveedor SMTP compatible:
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Servidor propio**: Configura según tu proveedor

## Funcionalidades Implementadas

### 1. Email de Contacto
- Se envía a `contacto@catloversparadise.org`
- Incluye toda la información del formulario
- Formato HTML profesional
- Información del remitente para respuesta

### 2. Email de Confirmación
- Se envía automáticamente al usuario
- Confirma que el mensaje fue recibido
- Incluye enlaces útiles del sitio
- Mensaje profesional y amigable

### 3. Validaciones
- Campos requeridos
- Formato de email válido
- Sanitización de datos
- Manejo de errores

## Endpoints

### POST /contact
- **Descripción**: Procesa el formulario de contacto
- **Body**: `first_name`, `last_name`, `email`, `phone`, `message`
- **Response**: JSON con `success` y `message`

## Archivos Modificados

1. **src/services/EmailService.ts** - Servicio de email
2. **src/controllers/portal.controller.ts** - Controlador de contacto
3. **src/routes/portal/portal.router.ts** - Ruta POST
4. **public/portal/js/submit-form.js** - JavaScript del frontend
5. **public/portal/php/form_process.php** - Actualizado con email correcto
6. **env.example** - Variables de entorno de ejemplo

## Pruebas

1. Configura las variables de entorno
2. Inicia el servidor: `npm run dev`
3. Ve a `/contact`
4. Llena el formulario y envíalo
5. Verifica que recibas el email en `contacto@catloversparadise.org`
6. Verifica que el usuario reciba el email de confirmación

## Notas Importantes

- El sistema usa Nodemailer para el envío de emails
- Los emails se envían de forma asíncrona
- Se incluye manejo de errores robusto
- El formulario se limpia automáticamente después del envío exitoso
- Compatible con el sistema existente de PHP para otros formularios
