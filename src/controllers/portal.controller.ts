import { Request, Response } from 'express';
import { CatService } from '../services/CatService';

const portalController = {
    getHome: (req: Request, res: Response) => {
        res.render('portal/home', {
            title: 'Inicio - Cat Lovers Paradise'
        });
    },
    
    getAbout: (req: Request, res: Response) => {
        res.render('portal/about', {
            title: 'Sobre Nosotros - Cat Lovers Paradise'
        });
    },
    
    getCats: async (req: Request, res: Response) => {
        try {
            const cats = await CatService.findAll();
            const currentLocale = (req as any).getLocale() || 'eng';
            const { breed, age } = req.query;
            
            // Procesar traducciones para cada gato
            const catsWithTranslations = cats.map(cat => {
                const translation = cat.translations.find(t => t.language === currentLocale);
                return {
                    ...cat,
                    name: translation?.name || cat.name,
                    description: translation?.description || cat.description,
                    characteristics: translation?.characteristics || cat.characteristics,
                    temperament: translation?.temperament || cat.temperament,
                    care: translation?.care || cat.care
                };
            });
            
            res.render('portal/cats', {
                title: 'Gatos Disponibles - Cat Lovers Paradise',
                cats: catsWithTranslations,
                breed,
                age
            });
        } catch (error) {
            console.error('Error loading cats:', error);
            res.status(500).render('portal/500', {
                title: 'Error del servidor - Cat Lovers Paradise'
            });
        }
    },
    
    getBreeds: async (req: Request, res: Response) => {
        try {
            const cats = await CatService.findAll();
            const currentLocale = (req as any).getLocale() || 'eng';
            
            // Procesar traducciones para cada gato
            const catsWithTranslations = cats.map(cat => {
                const translation = cat.translations.find(t => t.language === currentLocale);
                return {
                    ...cat,
                    name: translation?.name || cat.name,
                    description: translation?.description || cat.description,
                    characteristics: translation?.characteristics || cat.characteristics,
                    temperament: translation?.temperament || cat.temperament,
                    care: translation?.care || cat.care
                };
            });
            
            res.render('portal/breeds', {
                title: 'Nuestras Razas - Cat Lovers Paradise',
                cats: catsWithTranslations
            });
        } catch (error) {
            console.error('Error loading breeds:', error);
            res.status(500).render('portal/500', {
                title: 'Error del servidor - Cat Lovers Paradise'
            });
        }
    },
    
    getBreedInfo: async (req: Request, res: Response) => {
        try {
            const { breed } = req.params;
            const currentLocale = (req as any).getLocale() || 'eng';
            
            // Buscar gato por slug
            const cat = await CatService.findBySlug(breed, currentLocale);
            
            if (!cat) {
                return res.status(404).render('portal/404', {
                    title: 'Raza no encontrada - Cat Lovers Paradise'
                });
            }
            
            // Obtener la traducción del idioma actual
            const translation = cat.translations.find(t => t.language === currentLocale);
            const displayCat = {
                ...cat,
                name: translation?.name || cat.name,
                description: translation?.description || cat.description,
                characteristics: translation?.characteristics || cat.characteristics,
                temperament: translation?.temperament || cat.temperament,
                care: translation?.care || cat.care
            };
            
            res.render('gatos/info', {
                title: `${displayCat.name} - Cat Lovers Paradise`,
                breed: cat.slug,
                cat: displayCat
            });
        } catch (error) {
            console.error('Error loading breed info:', error);
            res.status(500).render('portal/500', {
                title: 'Error del servidor - Cat Lovers Paradise'
            });
        }
    },
    
    getContact: (req: Request, res: Response) => {
        res.render('portal/contact', {
            title: 'Contacto - Cat Lovers Paradise'
        });
    },
    
    getBlog: (req: Request, res: Response) => {
        res.render('portal/blog', {
            title: 'Blog - Cat Lovers Paradise'
        });
    },
    
    getPrivacy: (req: Request, res: Response) => {
        res.render('portal/privacy', {
            title: 'Política de Privacidad - Cat Lovers Paradise'
        });
    },
    
    getTerms: (req: Request, res: Response) => {
        res.render('portal/terms', {
            title: 'Términos y Condiciones - Cat Lovers Paradise'
        });
    },
    
    getSupport: (req: Request, res: Response) => {
        res.render('portal/support', {
            title: 'Soporte - Cat Lovers Paradise'
        });
    },
    
    getFaq: (req: Request, res: Response) => {
        res.render('portal/faq', {
            title: 'Preguntas Frecuentes - Cat Lovers Paradise'
        });
    },
    
    changeLanguage: (req: Request, res: Response) => {
        const { lang } = req.query;
        const validLanguages = ['eng', 'sp', 'zh'];
        
        if (lang && validLanguages.includes(lang as string)) {
            // Establecer cookie de idioma por 30 días
            res.cookie('lang', lang, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
                httpOnly: false, // Permitir acceso desde JavaScript
                secure: false, // Para desarrollo local
                sameSite: 'lax'
            });
            
            // Redirigir a la página anterior o a home
            const referer = req.get('Referer') || '/';
            res.redirect(referer);
        } else {
            // Si el idioma no es válido, redirigir a home
            res.redirect('/');
        }
    }
}

export default portalController;
