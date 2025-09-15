export interface SEOConfig {
    title: string;
    description: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
    twitterImage?: string;
    canonical?: string;
    noindex?: boolean;
    structuredData?: any;
}

export const defaultSEO: SEOConfig = {
    title: 'Cat Lovers Paradise - Criadores de Gatos de Raza en México',
    description: 'Criadores profesionales de gatos de raza en México. Especialistas en Sphynx, Maine Coon, Bengal, Exótico y más. Gatitos con pedigree, salud garantizada y amor incondicional.',
    keywords: [
        'criadores gatos',
        'gatos de raza',
        'sphynx',
        'maine coon',
        'bengal',
        'gato exótico',
        'gatos pedigree',
        'criaderos méxico',
        'gatos en venta',
        'gatitos',
        'cat lovers paradise',
        'criadores profesionales'
    ],
    ogTitle: 'Cat Lovers Paradise - Criadores de Gatos de Raza',
    ogDescription: 'Criadores profesionales de gatos de raza en México. Gatitos con pedigree y salud garantizada.',
    ogImage: '/public/portal/image/gatosinicio.png',
    twitterCard: 'summary_large_image',
    twitterImage: '/public/portal/image/gatosinicio.png',
    canonical: 'https://catloversparadise.com'
};

export const pageSEO: Record<string, SEOConfig> = {
    home: {
        ...defaultSEO,
        title: 'Cat Lovers Paradise - Criadores de Gatos de Raza en México',
        description: 'Criadores profesionales de gatos de raza en México. Especialistas en Sphynx, Maine Coon, Bengal, Exótico y más. Gatitos con pedigree, salud garantizada y amor incondicional.',
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Cat Lovers Paradise",
            "description": "Criadores profesionales de gatos de raza en México",
            "url": "https://catloversparadise.com",
            "logo": "https://catloversparadise.com/public/portal/image/logo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+52-55-4553-1362",
                "contactType": "customer service",
                "areaServed": "MX",
                "availableLanguage": ["Spanish", "English"]
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Esperanza #139 Col. Industrial",
                "addressLocality": "Gustavo A. Madero",
                "postalCode": "07800",
                "addressCountry": "MX"
            },
            "sameAs": [
                "https://www.facebook.com/catloversparadise",
                "https://www.instagram.com/catloversparadise"
            ]
        }
    },
    
    about: {
        ...defaultSEO,
        title: 'Nosotros - Cat Lovers Paradise | Criadores Profesionales',
        description: 'Conoce nuestro equipo de criadores profesionales especializados en gatos de raza. Más de 10 años de experiencia criando con amor y responsabilidad.',
        keywords: [...defaultSEO.keywords, 'nosotros', 'equipo', 'criadores profesionales', 'experiencia'],
        canonical: 'https://catloversparadise.com/about'
    },
    
    gallery: {
        ...defaultSEO,
        title: 'Galería de Entregas - Cat Lovers Paradise',
        description: 'Mira los momentos más especiales de nuestras entregas. Familias felices encontrando su compañero felino perfecto.',
        keywords: [...defaultSEO.keywords, 'galería', 'entregas', 'familias felices', 'momentos especiales'],
        canonical: 'https://catloversparadise.com/gallery'
    },
    
    contact: {
        ...defaultSEO,
        title: 'Contacto - Cat Lovers Paradise | Información y Ubicación',
        description: 'Contáctanos para más información sobre nuestros gatos de raza. Ubicados en Ciudad de México. Teléfono: +52 55 4553 1362',
        keywords: [...defaultSEO.keywords, 'contacto', 'ubicación', 'teléfono', 'ciudad de méxico'],
        canonical: 'https://catloversparadise.com/contact'
    },
    
    breeds: {
        ...defaultSEO,
        title: 'Razas de Gatos - Cat Lovers Paradise | Sphynx, Maine Coon, Bengal',
        description: 'Descubre nuestras razas de gatos disponibles: Sphynx, Maine Coon, Bengal, Exótico y más. Cada raza con características únicas y cuidados especiales.',
        keywords: [...defaultSEO.keywords, 'razas', 'sphynx', 'maine coon', 'bengal', 'exótico', 'características'],
        canonical: 'https://catloversparadise.com/breeds'
    },
    
    sphynx: {
        ...defaultSEO,
        title: 'Gatos Sphynx - Cat Lovers Paradise | Criadores Especializados',
        description: 'Gatos Sphynx de raza pura en México. Características únicas, cuidados especiales y personalidad encantadora. Gatitos con pedigree garantizado.',
        keywords: [...defaultSEO.keywords, 'sphynx', 'gato sin pelo', 'gato desnudo', 'características sphynx'],
        canonical: 'https://catloversparadise.com/breeds/sphynx'
    },
    
    mainecoon: {
        ...defaultSEO,
        title: 'Gatos Maine Coon - Cat Lovers Paradise | Gigantes Gentiles',
        description: 'Maine Coon de raza pura en México. Los gigantes gentiles del mundo felino. Personalidad amigable y tamaño impresionante.',
        keywords: [...defaultSEO.keywords, 'maine coon', 'gato gigante', 'gigante gentil', 'características maine coon'],
        canonical: 'https://catloversparadise.com/breeds/mainecoon'
    },
    
    bengal: {
        ...defaultSEO,
        title: 'Gatos Bengal - Cat Lovers Paradise | Leopardos Domésticos',
        description: 'Gatos Bengal de raza pura en México. Patrones salvajes con temperamento doméstico. Los leopardos de tu hogar.',
        keywords: [...defaultSEO.keywords, 'bengal', 'gato salvaje', 'leopardo doméstico', 'patrones bengal'],
        canonical: 'https://catloversparadise.com/breeds/bengal'
    },
    
    exotic: {
        ...defaultSEO,
        title: 'Gatos Exótico - Cat Lovers Paradise | Persas de Pelo Corto',
        description: 'Gatos Exótico de raza pura en México. La versión de pelo corto del Persa. Personalidad tranquila y adorable.',
        keywords: [...defaultSEO.keywords, 'exótico', 'persa pelo corto', 'gato tranquilo', 'características exótico'],
        canonical: 'https://catloversparadise.com/breeds/exotic'
    }
};

export function getSEOConfig(page: string, customData?: Partial<SEOConfig>): SEOConfig {
    const baseConfig = pageSEO[page] || defaultSEO;
    return {
        ...baseConfig,
        ...customData
    };
}

