import { Request, Response, NextFunction } from 'express';
import { getSEOConfig, SEOConfig } from '../config/seo';

export interface SEORequest extends Request {
    seo?: SEOConfig;
}

export function seoMiddleware(page: string) {
    return (req: SEORequest, res: Response, next: NextFunction) => {
        req.seo = getSEOConfig(page);
        next();
    };
}

export function generateMetaTags(seo: SEOConfig): string {
    const {
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
        twitterImage,
        canonical,
        noindex
    } = seo;

    const metaTags = [
        // Basic Meta Tags
        `<title>${title}</title>`,
        `<meta name="description" content="${description}">`,
        `<meta name="keywords" content="${keywords.join(', ')}">`,
        `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
        `<meta name="robots" content="${noindex ? 'noindex,nofollow' : 'index,follow'}">`,
        `<meta name="author" content="Cat Lovers Paradise">`,
        `<meta name="language" content="es">`,
        
        // Canonical URL
        canonical ? `<link rel="canonical" href="${canonical}">` : '',
        
        // Open Graph
        `<meta property="og:type" content="website">`,
        `<meta property="og:title" content="${ogTitle || title}">`,
        `<meta property="og:description" content="${ogDescription || description}">`,
        `<meta property="og:url" content="${canonical || ''}">`,
        ogImage ? `<meta property="og:image" content="${ogImage}">` : '',
        `<meta property="og:site_name" content="Cat Lovers Paradise">`,
        `<meta property="og:locale" content="es_MX">`,
        
        // Twitter Cards
        `<meta name="twitter:card" content="${twitterCard || 'summary_large_image'}">`,
        `<meta name="twitter:title" content="${ogTitle || title}">`,
        `<meta name="twitter:description" content="${ogDescription || description}">`,
        twitterImage ? `<meta name="twitter:image" content="${twitterImage}">` : '',
        
        // Additional SEO
        `<meta name="theme-color" content="#a66658">`,
        `<meta name="msapplication-TileColor" content="#a66658">`,
        
        // Structured Data
        seo.structuredData ? `<script type="application/ld+json">${JSON.stringify(seo.structuredData)}</script>` : ''
    ].filter(tag => tag.trim() !== '').join('\n    ');

    return metaTags;
}


