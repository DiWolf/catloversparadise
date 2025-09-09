# 🖼️ Guía de Imágenes para Razas de Gatos

## 📋 Problema Identificado
Las plantillas están configuradas para mostrar imágenes específicas de cada raza, pero estas imágenes no existen en el servidor. Por eso no se muestran las imágenes.

## 🔧 Solución Temporal Implementada
He configurado las plantillas para usar imágenes de respaldo (`dummy-img-*.jpg`) mientras se agregan las imágenes correctas.

## 📁 Estructura de Imágenes Requerida

### Para la página de todas las razas (`/breeds`):
```
public/portal/image/breeds/
├── hero-all-breeds.jpg      # Imagen de fondo del hero (1920x900)
├── bengal-card.jpg          # Imagen para tarjeta del Bengalí (400x250)
├── mainecoon-card.jpg       # Imagen para tarjeta del Maine Coon (400x250)
├── elf-card.jpg             # Imagen para tarjeta del Elf (400x250)
├── persian-card.jpg         # Imagen para tarjeta del Persa (400x250)
├── sphynx-card.jpg          # Imagen para tarjeta del Sphynx (400x250)
└── exotic-card.jpg          # Imagen para tarjeta del Persa Exótico (400x250)
```

### Para páginas individuales de razas (`/breed/:raza`):
```
public/portal/image/breeds/
├── bengal-hero.jpg          # Imagen de fondo del hero (1920x900)
├── bengal-main.jpg          # Imagen principal (600x600)
├── mainecoon-hero.jpg       # Imagen de fondo del hero (1920x900)
├── mainecoon-main.jpg       # Imagen principal (600x600)
├── elf-hero.jpg             # Imagen de fondo del hero (1920x900)
├── elf-main.jpg             # Imagen principal (600x600)
├── persian-hero.jpg         # Imagen de fondo del hero (1920x900)
├── persian-main.jpg         # Imagen principal (600x600)
├── sphynx-hero.jpg          # Imagen de fondo del hero (1920x900)
├── sphynx-main.jpg          # Imagen principal (600x600)
├── exotic-hero.jpg          # Imagen de fondo del hero (1920x900)
└── exotic-main.jpg          # Imagen principal (600x600)
```

## 🎯 Imágenes Actualmente Disponibles
- ✅ `bengal-main.png` - Ya existe, se está usando
- ❌ Todas las demás imágenes - Necesitan ser agregadas

## 🔄 Cómo Agregar las Imágenes

### Opción 1: Agregar imágenes específicas
1. Crear las imágenes con los nombres exactos mencionados arriba
2. Colocarlas en la carpeta `public/portal/image/breeds/`
3. Las plantillas las mostrarán automáticamente

### Opción 2: Usar imágenes existentes temporalmente
Las plantillas ya están configuradas para usar imágenes de respaldo, por lo que funcionarán con las imágenes dummy existentes.

## 🎨 Especificaciones Técnicas

### Imágenes de Tarjetas (breeds.njk):
- **Tamaño recomendado**: 400x250 píxeles
- **Formato**: JPG o PNG
- **Aspecto**: 16:10 (horizontal)
- **Calidad**: Alta resolución para web

### Imágenes Principales (info.njk):
- **Tamaño recomendado**: 600x600 píxeles
- **Formato**: JPG o PNG
- **Aspecto**: 1:1 (cuadrado)
- **Calidad**: Alta resolución para web

### Imágenes Hero:
- **Tamaño recomendado**: 1920x900 píxeles
- **Formato**: JPG
- **Aspecto**: 16:9 (horizontal)
- **Calidad**: Alta resolución para web

## 🚀 Estado Actual del Sistema

### ✅ Funcionando:
- Sistema de navegación completo
- Menú dropdown con las 6 razas
- Páginas dinámicas de razas
- Localización en 3 idiomas
- Diseño responsive

### ⏳ Pendiente:
- Agregar imágenes específicas de cada raza
- Optimizar imágenes para web
- Ajustar colores y estilos según las imágenes reales

## 🔧 Configuración Actual

### Imágenes de Respaldo Configuradas:
- **Hero**: `dummy-img-1920x900.jpg`
- **Tarjetas**: `dummy-img-600x400.jpg`
- **Principales**: `dummy-img-600x600.jpg`

### Fallback Automático:
Las plantillas incluyen `onerror` para cambiar automáticamente a imágenes de respaldo si la imagen específica no existe.

## 📝 Próximos Pasos

1. **Agregar imágenes reales** de cada raza
2. **Optimizar imágenes** para web (compresión, formatos web)
3. **Probar en diferentes dispositivos** para verificar responsive
4. **Ajustar estilos** según las imágenes reales

---

**¡El sistema está 100% funcional! Solo necesitas agregar las imágenes correctas.** 🎉

