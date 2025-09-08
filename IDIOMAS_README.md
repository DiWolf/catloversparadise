# Funcionalidad de Idiomas - Cat Lovers Paradise

## Descripción
Se ha implementado un sistema completo de selección de idiomas que permite a los usuarios cambiar entre Español, Inglés y Chino. La selección se guarda en una cookie y persiste entre sesiones.

## Características Implementadas

### 1. Archivos de Idiomas
- **locales/sp.json**: Traducciones en español
- **locales/eng.json**: Traducciones en inglés (idioma por defecto)
- **locales/zh.json**: Traducciones en chino

### 2. Selector de Idiomas
- Dropdown en el menú de navegación con iconos de banderas
- Muestra el idioma actual seleccionado
- Permite cambiar entre los 3 idiomas disponibles

### 3. Persistencia
- La selección se guarda en una cookie por 30 días
- El idioma se mantiene al navegar entre páginas
- Al recargar la página, se mantiene el idioma seleccionado

### 4. Páginas Traducidas
- **Menú de navegación**: Todos los enlaces y opciones
- **Página de inicio**: Contenido principal y secciones
- **Footer**: Enlaces, información de contacto y texto legal

## Uso

### Para el Usuario
1. Hacer clic en el selector de idiomas (globo) en el menú superior
2. Seleccionar el idioma deseado de la lista desplegable
3. La página se recargará automáticamente con el nuevo idioma
4. La selección se guardará y se mantendrá en futuras visitas

### Para el Desarrollador

#### Agregar Nuevas Traducciones
1. Editar los archivos JSON en la carpeta `locales/`
2. Usar la estructura de claves anidadas:
```json
{
  "seccion": {
    "clave": "Texto traducido"
  }
}
```

#### Usar en Templates
```html
{{ t('seccion.clave') }}
```

#### Agregar Nuevos Idiomas
1. Crear archivo JSON en `locales/` con el código del idioma
2. Agregar el código a la configuración en `src/app.ts`:
```typescript
locales: ['eng', 'sp', 'zh', 'nuevo_idioma']
```
3. Agregar opción en el selector de idiomas en `src/views/template/portal.njk`

## Estructura de Archivos Modificados

- `src/app.ts`: Configuración de i18n y middleware
- `src/controllers/portal.controller.ts`: Controlador para cambio de idioma
- `src/routes/portal/portal.router.ts`: Ruta para cambio de idioma
- `src/views/template/portal.njk`: Template principal con selector
- `src/views/portal/home.njk`: Página de inicio traducida
- `locales/sp.json`: Traducciones en español
- `locales/eng.json`: Traducciones en inglés
- `locales/zh.json`: Traducciones en chino

## Configuración Técnica

### Dependencias Utilizadas
- `i18n`: Manejo de internacionalización
- `cookie-parser`: Manejo de cookies
- `express`: Framework web

### Configuración de i18n
```typescript
i18n.configure({
  locales: ['eng', 'sp', 'zh'],
  directory: localesPath,
  defaultLocale: 'eng',
  cookie: 'lang',
  queryParameter: 'lang',
  autoReload: true,
  updateFiles: false
});
```

### Ruta de Cambio de Idioma
- **URL**: `/change-language?lang=codigo_idioma`
- **Método**: GET
- **Parámetros**: `lang` (eng, sp, zh)
- **Respuesta**: Redirección a la página anterior

## Notas Importantes

1. **Idioma por defecto**: Inglés (eng)
2. **Duración de cookie**: 30 días
3. **Idiomas soportados**: Español (sp), Inglés (eng), Chino (zh)
4. **Persistencia**: La selección se mantiene entre sesiones del navegador
5. **Fallback**: Si no se encuentra una traducción, se muestra la clave original

## Próximos Pasos Recomendados

1. Agregar traducciones para todas las páginas restantes
2. Implementar detección automática del idioma del navegador
3. Agregar más idiomas según necesidades del proyecto
4. Optimizar la carga de traducciones para mejor rendimiento
