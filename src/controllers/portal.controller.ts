import { Request, Response } from 'express';
import { CatService } from '../services/CatService';
import { CatListingService } from '../services/CatListingService';
import { getSEOConfig } from '../config/seo';
import { generateMetaTags } from '../middlewares/seo';
import EmailService, { ContactFormData } from '../services/EmailService';

const portalController = {
    getHome: (req: Request, res: Response) => {
        const seo = getSEOConfig('home');
        res.render('portal/home', {
            title: seo.title,
            seo: {
                ...seo,
                metaTags: generateMetaTags(seo)
            }
        });
    },
    
    getAbout: (req: Request, res: Response) => {
        const seo = getSEOConfig('about');
        res.render('portal/about', {
            title: seo.title,
            seo: {
                ...seo,
                metaTags: generateMetaTags(seo)
            }
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
            
            const seo = getSEOConfig('breeds');
            res.render('portal/breeds', {
                title: seo.title,
                seo: {
                    ...seo,
                    metaTags: generateMetaTags(seo)
                },
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
            
            // Obtener gatos disponibles de esta raza
            const availableCats = await CatListingService.findByBreed(cat.id, currentLocale);
            
            const seo = getSEOConfig(breed, {
                title: `${displayCat.name} - Cat Lovers Paradise`,
                description: displayCat.description,
                keywords: [...getSEOConfig(breed).keywords, displayCat.name.toLowerCase()]
            });
            
            res.render('gatos/info', {
                title: seo.title,
                seo: {
                    ...seo,
                    metaTags: generateMetaTags(seo)
                },
                breed: cat.slug,
                cat: displayCat,
                availableCats: availableCats
            });
        } catch (error) {
            console.error('Error loading breed info:', error);
            res.status(500).render('portal/500', {
                title: 'Error del servidor - Cat Lovers Paradise'
            });
        }
    },
    
    getContact: (req: Request, res: Response) => {
        const seo = getSEOConfig('contact');
        res.render('portal/contact', {
            title: seo.title,
            seo: {
                ...seo,
                metaTags: generateMetaTags(seo)
            }
        });
    },
    
    getBlog: (req: Request, res: Response) => {
        const seo = getSEOConfig('gallery');
        res.render('portal/blog', {
            title: seo.title,
            seo: {
                ...seo,
                metaTags: generateMetaTags(seo)
            }
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
    },

    submitContact: async (req: Request, res: Response) => {
        try {
            console.log('📧 Intentando enviar email de contacto...');
            console.log('📋 Datos recibidos:', req.body);

            const { first_name, last_name, email, phone, message } = req.body;

            // Validar campos requeridos
            if (!first_name || !last_name || !email || !phone || !message) {
                console.log('❌ Validación fallida: campos requeridos faltantes');
                return res.status(400).json({ 
                    success: false, 
                    message: 'Todos los campos son requeridos' 
                });
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.log('❌ Validación fallida: formato de email inválido');
                return res.status(400).json({ 
                    success: false, 
                    message: 'El formato del email no es válido' 
                });
            }

            const formData: ContactFormData = {
                firstName: first_name.trim(),
                lastName: last_name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                message: message.trim()
            };

            console.log('✅ Datos validados correctamente');
            console.log('📤 Enviando email de contacto...');

            // Verificar si las credenciales están configuradas
            if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
                console.log('❌ Error: Credenciales de email no configuradas');
                return res.status(500).json({ 
                    success: false, 
                    message: 'El sistema de email no está configurado. Por favor, contacta al administrador.' 
                });
            }

            // Enviar email de contacto
            const emailSent = await EmailService.sendContactEmail(formData);
            
            if (!emailSent) {
                console.log('❌ Error: No se pudo enviar el email de contacto');
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.' 
                });
            }

            console.log('✅ Email de contacto enviado exitosamente');
            console.log('📤 Enviando email de confirmación...');

            // Enviar email de confirmación al usuario
            const confirmationSent = await EmailService.sendConfirmationEmail(formData);
            
            if (confirmationSent) {
                console.log('✅ Email de confirmación enviado exitosamente');
            } else {
                console.log('⚠️  Advertencia: No se pudo enviar el email de confirmación');
            }

            res.json({ 
                success: true, 
                message: 'Mensaje enviado exitosamente. Te contactaremos pronto.' 
            });

        } catch (error) {
            console.error('❌ Error en submitContact:', error);
            console.error('📋 Detalles del error:', {
                message: error instanceof Error ? error.message : 'Error desconocido',
                code: (error as any)?.code || 'UNKNOWN',
                stack: error instanceof Error ? error.stack : undefined
            });
            
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor. Por favor, inténtalo de nuevo.' 
            });
        }
    }
}

export default portalController;
