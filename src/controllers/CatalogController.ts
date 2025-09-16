import { Request, Response } from 'express';
import { CatListingService } from '../services/CatListingService';
import { CatService } from '../services/CatService';

export class CatalogController {
  // Página principal del catálogo
  static async catalogIndex(req: Request, res: Response) {
    try {
      // Obtener el cat_id si se proporciona un breed slug
      let cat_id: number | undefined = undefined;
      if (req.query.breed) {
        const cat = await CatService.findBySlug(req.query.breed as string);
        if (cat) {
          cat_id = cat.id;
        }
      }

      // Procesar rango de edad
      let min_age: number | undefined = undefined;
      let max_age: number | undefined = undefined;
      
      if (req.query.age_range) {
        const ageRange = req.query.age_range as string;
        switch (ageRange) {
          case '1-3':
            min_age = 1;
            max_age = 3;
            break;
          case '3-6':
            min_age = 3;
            max_age = 6;
            break;
          case '6-12':
            min_age = 6;
            max_age = 12;
            break;
          case '12+':
            min_age = 12;
            break;
        }
      }

      const filters = {
        cat_id: cat_id,
        gender: req.query.gender as 'male' | 'female' | undefined,
        min_age: min_age,
        max_age: max_age,
        max_price: req.query.max_price ? parseInt(req.query.max_price as string) : undefined,
        search: req.query.search as string | undefined,
        status: 'available' as const // Solo mostrar disponibles en el portal público
      };

      console.log('Catalog filters:', filters);
      console.log('Query params:', req.query);
      
      const listings = await CatListingService.findAll(filters);
      const cats = await CatService.findAll();
      
      // Generar URLs de WhatsApp para cada listing
      const phoneNumber = process.env.WHATSAPP_PHONE || '1234567890'; // Configurar en .env
      const listingsWithWhatsApp = listings.map(listing => ({
        ...listing,
        whatsappUrl: CatListingService.generateWhatsAppMessage(listing, phoneNumber)
      }));

      res.render('portal/catalog/index', {
        title: 'Catálogo de Gatos',
        listings: listingsWithWhatsApp,
        breeds: cats.map(cat => ({ slug: cat.slug, breed: cat.breed })),
        filters: {
          ...filters,
          breed: req.query.breed as string | undefined,
          age_range: req.query.age_range as string | undefined
        },
        whatsappUrl: `https://wa.me/${phoneNumber}`
      });
    } catch (error) {
      console.error('Catalog index error:', error);
      res.status(500).render('portal/500', { title: 'Error del servidor' });
    }
  }

  // Página de detalle de un gato
  static async catalogDetail(req: Request, res: Response) {
    try {
      const listingId = parseInt(req.params.id);
      const listing = await CatListingService.findById(listingId);
      
      if (!listing) {
        return res.status(404).render('portal/404', { 
          title: 'Gato no encontrado',
          message: 'El gato que buscas no está disponible'
        });
      }

      // Generar URL de WhatsApp
      const phoneNumber = process.env.WHATSAPP_PHONE || '1234567890';
      const whatsappUrl = CatListingService.generateWhatsAppMessage(listing, phoneNumber);

      res.render('portal/catalog/detail', {
        title: `${listing.name} - ${listing.cat.breed}`,
        listing,
        whatsappUrl
      });
    } catch (error) {
      console.error('Catalog detail error:', error);
      res.status(500).render('portal/500', { title: 'Error del servidor' });
    }
  }

  // Catálogo por raza específica
  static async catalogByBreed(req: Request, res: Response) {
    try {
      const breedSlug = req.params.slug;
      const cat = await CatService.findBySlug(breedSlug);
      
      if (!cat) {
        return res.status(404).render('portal/404', { 
          title: 'Raza no encontrada',
          message: 'La raza que buscas no está disponible'
        });
      }

      const filters = {
        cat_id: cat.id,
        status: 'available' as const
      };

      const listings = await CatListingService.findAll(filters);
      const cats = await CatService.findAll();
      
      // Generar URLs de WhatsApp
      const phoneNumber = process.env.WHATSAPP_PHONE || '1234567890';
      const listingsWithWhatsApp = listings.map(listing => ({
        ...listing,
        whatsappUrl: CatListingService.generateWhatsAppMessage(listing, phoneNumber)
      }));

      res.render('portal/catalog/index', {
        title: `Gatos ${cat.breed}`,
        listings: listingsWithWhatsApp,
        breeds: cats.map(cat => ({ slug: cat.slug, breed: cat.breed })),
        filters: { breed: breedSlug },
        whatsappUrl: `https://wa.me/${phoneNumber}`,
        breedInfo: cat
      });
    } catch (error) {
      console.error('Catalog by breed error:', error);
      res.status(500).render('portal/500', { title: 'Error del servidor' });
    }
  }
}
