import { Router } from 'express';
import portalController from '@controllers/portal.controller';

const router = Router();

// Páginas principales
router.get('/', portalController.getHome);
router.get('/about', portalController.getAbout);
router.get('/cats', portalController.getCats);
router.get('/contact', portalController.getContact);
router.get('/blog', portalController.getBlog);

// Páginas legales y de soporte
router.get('/privacy', portalController.getPrivacy);
router.get('/terms', portalController.getTerms);
router.get('/support', portalController.getSupport);
router.get('/faq', portalController.getFaq);

export default router;
