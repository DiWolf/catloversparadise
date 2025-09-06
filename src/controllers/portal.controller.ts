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
    }
}

export default portalController;
