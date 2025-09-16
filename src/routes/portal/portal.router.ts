import { Router } from 'express';
import portalController from '../../controllers/portal.controller';
import { CatalogController } from '../../controllers/CatalogController';

const router = Router();

// Páginas principales
router.get('/', portalController.getHome);
router.get('/about', portalController.getAbout);
router.get('/cats', portalController.getCats);
router.get('/breeds', portalController.getBreeds);
router.get('/breed/:breed', portalController.getBreedInfo);
router.get('/contact', portalController.getContact);
router.post('/contact', portalController.submitContact);
router.get('/blog', portalController.getBlog);

// Catálogo de gatos
router.get('/catalog', CatalogController.catalogIndex);
router.get('/catalog/:id', CatalogController.catalogDetail);
router.get('/breed/:slug/catalog', CatalogController.catalogByBreed);

// Páginas legales y de soporte
router.get('/privacy', portalController.getPrivacy);
router.get('/terms', portalController.getTerms);
router.get('/support', portalController.getSupport);
router.get('/faq', portalController.getFaq);

// Ruta para cambiar idioma
router.get('/change-language', portalController.changeLanguage);

export default router;
