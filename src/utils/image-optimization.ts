// Utilidades para optimización de imágenes SEO

export interface ImageSEO {
    src: string;
    alt: string;
    title?: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'sync' | 'auto';
}

export function generateImageSEO(
    src: string, 
    alt: string, 
    options: Partial<ImageSEO> = {}
): ImageSEO {
    return {
        src,
        alt,
        loading: 'lazy',
        decoding: 'async',
        ...options
    };
}

// Alt text optimizado para diferentes tipos de imágenes
export const imageAltTexts = {
    // Imágenes de gatos por raza
    sphynx: {
        hero: 'Gato Sphynx de raza pura - Características únicas y personalidad encantadora',
        main: 'Gato Sphynx - Raza sin pelo con temperamento especial',
        gallery: 'Galería de gatos Sphynx - Diferentes colores y patrones'
    },
    mainecoon: {
        hero: 'Gato Maine Coon gigante - El gato más grande del mundo felino',
        main: 'Maine Coon - Gigante gentil con personalidad amigable',
        gallery: 'Galería de gatos Maine Coon - Tamaño impresionante y belleza natural'
    },
    bengal: {
        hero: 'Gato Bengal salvaje - Patrones de leopardo con temperamento doméstico',
        main: 'Bengal - Leopardo doméstico con instinto salvaje',
        gallery: 'Galería de gatos Bengal - Patrones únicos y personalidad activa'
    },
    exotic: {
        hero: 'Gato Exótico tranquilo - Persa de pelo corto con personalidad adorable',
        main: 'Exótico - Versión de pelo corto del Persa',
        gallery: 'Galería de gatos Exótico - Personalidad tranquila y adorable'
    },
    // Imágenes generales
    general: {
        logo: 'Cat Lovers Paradise - Logo de criadores de gatos de raza',
        team: 'Equipo de criadores profesionales - Especialistas en gatos de raza',
        delivery: 'Entrega de gatito - Momento especial de felicidad familiar',
        facility: 'Instalaciones de cría - Ambiente seguro y profesional para gatos'
    }
};

// Generar alt text dinámico basado en contexto
export function getAltText(type: string, context: string, breed?: string): string {
    const breedTexts = imageAltTexts[breed as keyof typeof imageAltTexts];
    if (breedTexts && breedTexts[context as keyof typeof breedTexts]) {
        return breedTexts[context as keyof typeof breedTexts];
    }
    
    return imageAltTexts.general[context as keyof typeof imageAltTexts.general] || 
           `Imagen de ${breed || 'gato'} - Cat Lovers Paradise`;
}

// Atributos SEO para imágenes
export function getImageAttributes(
    src: string,
    alt: string,
    options: {
        width?: number;
        height?: number;
        priority?: boolean;
        className?: string;
    } = {}
): string {
    const {
        width,
        height,
        priority = false,
        className = ''
    } = options;

    const attributes = [
        `src="${src}"`,
        `alt="${alt}"`,
        `loading="${priority ? 'eager' : 'lazy'}"`,
        `decoding="async"`,
        className ? `class="${className}"` : '',
        width ? `width="${width}"` : '',
        height ? `height="${height}"` : ''
    ].filter(attr => attr).join(' ');

    return attributes;
}

// Generar imagen responsive con srcset
export function generateResponsiveImage(
    baseSrc: string,
    alt: string,
    sizes: number[] = [320, 640, 1024, 1200],
    options: Partial<ImageSEO> = {}
): string {
    const srcset = sizes
        .map(size => `${baseSrc}?w=${size} ${size}w`)
        .join(', ');
    
    const sizesAttr = '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1200px';
    
    return `<img 
        src="${baseSrc}" 
        srcset="${srcset}"
        sizes="${sizesAttr}"
        alt="${alt}"
        loading="${options.loading || 'lazy'}"
        decoding="async"
        ${options.className ? `class="${options.className}"` : ''}
    >`;
}

