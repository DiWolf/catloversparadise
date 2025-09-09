import { Request, Response } from 'express';

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
    
    getCats: (req: Request, res: Response) => {
        const { breed, age } = req.query;
        res.render('portal/cats', {
            title: 'Gatos Disponibles - Cat Lovers Paradise',
            breed,
            age
        });
    },
    
    getBreeds: (req: Request, res: Response) => {
        res.render('portal/breeds', {
            title: 'Nuestras Razas - Cat Lovers Paradise'
        });
    },
    
    getBreedInfo: (req: Request, res: Response) => {
        const { breed } = req.params;
        const validBreeds = ['bengal', 'mainecoon', 'elf', 'persian', 'sphynx', 'exotic'];
        
        if (!validBreeds.includes(breed)) {
            return res.status(404).render('portal/404', {
                title: 'Raza no encontrada - Cat Lovers Paradise'
            });
        }
        
        res.render('gatos/info', {
            title: `${breed} - Cat Lovers Paradise`,
            breed
        });
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
