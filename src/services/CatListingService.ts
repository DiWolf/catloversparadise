import { query } from '../config/database';
import { 
  CatListing, 
  CatListingWithDetails, 
  CreateCatListingRequest, 
  UpdateCatListingRequest, 
  CatListingTranslation,
  CatListingFilters 
} from '../types/CatListing';

export class CatListingService {
  // Obtener todos los listings activos
  static async findAll(filters: CatListingFilters = {}): Promise<CatListingWithDetails[]> {
    try {
      let sql = `
        SELECT 
          cl.*,
          c.name as cat_name,
          c.breed,
          c.slug as cat_slug,
          ct.language,
          ct.name as translated_name,
          ct.description as translated_description,
          ct.special_characteristics as translated_special_characteristics,
          ct.whatsapp_message as translated_whatsapp_message
        FROM cat_listings cl
        INNER JOIN cats c ON cl.cat_id = c.id
        LEFT JOIN cat_listing_translations ct ON cl.id = ct.listing_id
        WHERE cl.is_active = TRUE
      `;
      
      const conditions = [];
      const params = [];
      
      if (filters.cat_id) {
        conditions.push('cl.cat_id = ?');
        params.push(filters.cat_id);
      }
      
      if (filters.gender) {
        conditions.push('cl.gender = ?');
        params.push(filters.gender);
      }
      
      if (filters.min_age) {
        conditions.push('cl.age_months >= ?');
        params.push(filters.min_age);
      }
      
      if (filters.max_age) {
        conditions.push('cl.age_months <= ?');
        params.push(filters.max_age);
      }
      
      if (filters.min_price) {
        conditions.push('(cl.pet_price >= ? OR cl.breeding_price >= ?)');
        params.push(filters.min_price, filters.min_price);
      }
      
      if (filters.max_price) {
        conditions.push('(cl.pet_price <= ? OR cl.breeding_price <= ?)');
        params.push(filters.max_price, filters.max_price);
      }
      
      if (filters.status) {
        conditions.push('cl.status = ?');
        params.push(filters.status);
      }
      
      if (filters.search) {
        conditions.push('(cl.name LIKE ? OR c.breed LIKE ? OR cl.color LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
      }
      
      sql += ' ORDER BY cl.created_at DESC';
      
      console.log('CatListingService SQL:', sql);
      console.log('CatListingService params:', params);
      
      const results = await query(sql, params);
      
      // Agrupar por listing y organizar traducciones
      const listingsMap = new Map<number, CatListingWithDetails>();
      
      results.forEach((row: any) => {
        if (!listingsMap.has(row.id)) {
          listingsMap.set(row.id, {
            id: row.id,
            cat_id: row.cat_id,
            name: row.name,
            gender: row.gender,
            age_months: row.age_months,
            color: row.color,
            eye_color: row.eye_color,
            special_characteristics: row.special_characteristics,
            pet_price: row.pet_price,
            breeding_price: row.breeding_price,
            status: row.status,
            images: (() => {
              console.log('Service findById - Raw images from DB:', row.images, typeof row.images);
              if (!row.images) return [];
              if (typeof row.images === 'string') {
                const parsed = JSON.parse(row.images);
                console.log('Service findById - Parsed images:', parsed);
                return parsed;
              }
              if (Array.isArray(row.images)) {
                console.log('Service findById - Images already array:', row.images);
                return row.images;
              }
              return [];
            })(),
            description: row.description,
            whatsapp_message: row.whatsapp_message,
            is_active: row.is_active,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
            translations: [],
            cat: {
              id: row.cat_id,
              name: row.cat_name,
              breed: row.breed,
              slug: row.cat_slug
            }
          });
        }
        
        if (row.language) {
          listingsMap.get(row.id)!.translations.push({
            id: row.id,
            listing_id: row.id,
            language: row.language,
            name: row.translated_name,
            description: row.translated_description,
            special_characteristics: row.translated_special_characteristics,
            whatsapp_message: row.translated_whatsapp_message,
            created_at: row.created_at,
            updated_at: row.updated_at
          });
        }
      });
      
      return Array.from(listingsMap.values());
    } catch (error) {
      console.error('Error finding all cat listings:', error);
      throw error;
    }
  }

  // Obtener listing por ID
  static async findById(id: number): Promise<CatListingWithDetails | null> {
    try {
      const sql = `
        SELECT 
          cl.*,
          c.name as cat_name,
          c.breed,
          c.slug as cat_slug,
          ct.language,
          ct.name as translated_name,
          ct.description as translated_description,
          ct.special_characteristics as translated_special_characteristics,
          ct.whatsapp_message as translated_whatsapp_message
        FROM cat_listings cl
        INNER JOIN cats c ON cl.cat_id = c.id
        LEFT JOIN cat_listing_translations ct ON cl.id = ct.listing_id
        WHERE cl.id = ? AND cl.is_active = TRUE
      `;
      
      const results = await query(sql, [id]);
      
      if (results.length === 0) return null;
      
      const listing = results[0];
      const translations: CatListingTranslation[] = [];
      
      results.forEach((row: any) => {
        if (row.language) {
          translations.push({
            id: row.id,
            listing_id: row.id,
            language: row.language,
            name: row.translated_name,
            description: row.translated_description,
            special_characteristics: row.translated_special_characteristics,
            whatsapp_message: row.translated_whatsapp_message,
            created_at: row.created_at,
            updated_at: row.updated_at
          });
        }
      });
      
      return {
        id: listing.id,
        cat_id: listing.cat_id,
        name: listing.name,
        gender: listing.gender,
        age_months: listing.age_months,
        color: listing.color,
        eye_color: listing.eye_color,
        special_characteristics: listing.special_characteristics,
        pet_price: listing.pet_price,
        breeding_price: listing.breeding_price,
        status: listing.status,
        images: listing.images ? (typeof listing.images === 'string' ? JSON.parse(listing.images) : Array.isArray(listing.images) ? listing.images : []) : [],
        description: listing.description,
        whatsapp_message: listing.whatsapp_message,
        is_active: listing.is_active,
        created_by: listing.created_by,
        created_at: listing.created_at,
        updated_at: listing.updated_at,
        translations,
        cat: {
          id: listing.cat_id,
          name: listing.cat_name,
          breed: listing.breed,
          slug: listing.cat_slug
        }
      };
    } catch (error) {
      console.error('Error finding cat listing by ID:', error);
      throw error;
    }
  }

  // Obtener listings por raza
  static async findByCatId(catId: number, language: string = 'eng'): Promise<CatListingWithDetails[]> {
    try {
      const filters: CatListingFilters = { cat_id: catId };
      const listings = await this.findAll(filters);
      
      // Filtrar por idioma si es necesario
      if (language !== 'eng') {
        return listings.filter(listing => 
          listing.translations.some(t => t.language === language)
        );
      }
      
      return listings;
    } catch (error) {
      console.error('Error finding cat listings by cat ID:', error);
      throw error;
    }
  }

  // Crear nuevo listing
  static async create(listingData: CreateCatListingRequest, userId: number): Promise<CatListing> {
    try {
      // Crear el listing principal
      const listingSql = `
        INSERT INTO cat_listings (
          cat_id, name, gender, age_months, color, eye_color, 
          special_characteristics, pet_price, breeding_price, 
          status, images, description, whatsapp_message, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const listingResult = await query(listingSql, [
        listingData.cat_id,
        listingData.name,
        listingData.gender,
        listingData.age_months,
        listingData.color || null,
        listingData.eye_color || null,
        listingData.special_characteristics || null,
        listingData.pet_price || null,
        listingData.breeding_price || null,
        listingData.status || 'available',
        listingData.images ? JSON.stringify(listingData.images) : null,
        listingData.description || null,
        listingData.whatsapp_message || null,
        userId
      ]);
      
      const listingId = listingResult.insertId;
      
      // Crear traducciones
      if (listingData.translations && listingData.translations.length > 0) {
        for (const translation of listingData.translations) {
          const translationSql = `
            INSERT INTO cat_listing_translations (
              listing_id, language, name, description, 
              special_characteristics, whatsapp_message
            ) VALUES (?, ?, ?, ?, ?, ?)
          `;
          
          await query(translationSql, [
            listingId,
            translation.language,
            translation.name,
            translation.description || null,
            translation.special_characteristics || null,
            translation.whatsapp_message || null
          ]);
        }
      }
      
      const newListing = await this.findById(listingId);
      return newListing!;
    } catch (error) {
      console.error('Error creating cat listing:', error);
      throw error;
    }
  }

  // Actualizar listing
  static async update(id: number, listingData: UpdateCatListingRequest, userId: number): Promise<CatListing> {
    try {
      // Actualizar listing principal
      const updateFields = [];
      const values = [];
      
      if (listingData.cat_id) { updateFields.push('cat_id = ?'); values.push(listingData.cat_id); }
      if (listingData.name) { updateFields.push('name = ?'); values.push(listingData.name); }
      if (listingData.gender) { updateFields.push('gender = ?'); values.push(listingData.gender); }
      if (listingData.age_months) { updateFields.push('age_months = ?'); values.push(listingData.age_months); }
      if (listingData.color !== undefined) { updateFields.push('color = ?'); values.push(listingData.color); }
      if (listingData.eye_color !== undefined) { updateFields.push('eye_color = ?'); values.push(listingData.eye_color); }
      if (listingData.special_characteristics !== undefined) { updateFields.push('special_characteristics = ?'); values.push(listingData.special_characteristics); }
      if (listingData.pet_price !== undefined) { updateFields.push('pet_price = ?'); values.push(listingData.pet_price); }
      if (listingData.breeding_price !== undefined) { updateFields.push('breeding_price = ?'); values.push(listingData.breeding_price); }
      if (listingData.status) { updateFields.push('status = ?'); values.push(listingData.status); }
      if (listingData.images !== undefined) { 
        console.log('Service update - Images to save:', listingData.images);
        updateFields.push('images = ?'); 
        values.push(JSON.stringify(listingData.images)); 
        console.log('Service update - Images JSON string:', JSON.stringify(listingData.images));
      }
      if (listingData.description !== undefined) { updateFields.push('description = ?'); values.push(listingData.description); }
      if (listingData.whatsapp_message !== undefined) { updateFields.push('whatsapp_message = ?'); values.push(listingData.whatsapp_message); }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        values.push(id);
        
        const listingSql = `UPDATE cat_listings SET ${updateFields.join(', ')} WHERE id = ?`;
        await query(listingSql, values);
      }
      
      // Actualizar traducciones
      if (listingData.translations && listingData.translations.length > 0) {
        // Eliminar traducciones existentes
        await query('DELETE FROM cat_listing_translations WHERE listing_id = ?', [id]);
        
        // Insertar nuevas traducciones
        for (const translation of listingData.translations) {
          const translationSql = `
            INSERT INTO cat_listing_translations (
              listing_id, language, name, description, 
              special_characteristics, whatsapp_message
            ) VALUES (?, ?, ?, ?, ?, ?)
          `;
          
          await query(translationSql, [
            id,
            translation.language,
            translation.name,
            translation.description || null,
            translation.special_characteristics || null,
            translation.whatsapp_message || null
          ]);
        }
      }
      
      const updatedListing = await this.findById(id);
      return updatedListing!;
    } catch (error) {
      console.error('Error updating cat listing:', error);
      throw error;
    }
  }

  // Eliminar listing (soft delete)
  static async delete(id: number): Promise<void> {
    try {
      const sql = 'UPDATE cat_listings SET is_active = FALSE WHERE id = ?';
      await query(sql, [id]);
    } catch (error) {
      console.error('Error deleting cat listing:', error);
      throw error;
    }
  }

  // Generar mensaje de WhatsApp
  static generateWhatsAppMessage(listing: CatListingWithDetails, phoneNumber: string): string {
    const baseMessage = `¡Hola! Me interesa el gato ${listing.name} (${listing.cat.breed}) que vi en Cat Lovers Paradise.`;
    
    let details = `\n\nDetalles:\n`;
    details += `• Nombre: ${listing.name}\n`;
    details += `• Raza: ${listing.cat.breed}\n`;
    details += `• Género: ${listing.gender === 'male' ? 'Macho' : 'Hembra'}\n`;
    details += `• Edad: ${listing.age_months} meses\n`;
    
    if (listing.color) details += `• Color: ${listing.color}\n`;
    if (listing.eye_color) details += `• Color de ojos: ${listing.eye_color}\n`;
    if (listing.special_characteristics) details += `• Características: ${listing.special_characteristics}\n`;
    
    if (listing.pet_price) details += `• Precio como mascota: $${listing.pet_price}\n`;
    if (listing.breeding_price) details += `• Precio para cría: $${listing.breeding_price}\n`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage + details)}`;
    return whatsappUrl;
  }

  // Obtener gatos disponibles por raza
  static async findByBreed(catId: number, language: string = 'eng'): Promise<CatListingWithDetails[]> {
    try {
      const sql = `
        SELECT 
          cl.*,
          c.name as cat_name,
          c.breed,
          c.slug as cat_slug,
          ct.language,
          ct.name as translated_name,
          ct.description as translated_description,
          ct.special_characteristics as translated_special_characteristics,
          ct.whatsapp_message as translated_whatsapp_message
        FROM cat_listings cl
        INNER JOIN cats c ON cl.cat_id = c.id
        LEFT JOIN cat_listing_translations ct ON cl.id = ct.listing_id AND ct.language = ?
        WHERE cl.is_active = TRUE 
          AND cl.cat_id = ?
          AND cl.status = 'available'
        ORDER BY cl.created_at DESC
      `;
      
      const rows = await query(sql, [language, catId]);
      
      // Agrupar por listing_id para manejar traducciones
      const listingsMap = new Map<number, CatListingWithDetails>();
      
      for (const row of rows) {
        const listingId = row.id;
        
        if (!listingsMap.has(listingId)) {
          // Parsear imágenes
          let images = [];
          if (row.images) {
            if (typeof row.images === 'string') {
              try {
                images = JSON.parse(row.images);
              } catch (e) {
                console.error('Error parsing images JSON:', e);
                images = [];
              }
            } else if (Array.isArray(row.images)) {
              images = row.images;
            }
          }
          
          const listing: CatListingWithDetails = {
            id: row.id,
            cat_id: row.cat_id,
            name: row.name,
            gender: row.gender,
            age_months: row.age_months,
            color: row.color,
            eye_color: row.eye_color,
            special_characteristics: row.special_characteristics,
            pet_price: row.pet_price,
            breeding_price: row.breeding_price,
            status: row.status,
            images: images,
            description: row.description,
            whatsapp_message: row.whatsapp_message,
            is_active: row.is_active,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
            cat: {
              id: row.cat_id,
              name: row.cat_name,
              breed: row.breed,
              slug: row.cat_slug
            },
            translations: []
          };
          
          listingsMap.set(listingId, listing);
        }
        
        // Agregar traducción si existe
        if (row.language) {
          const listing = listingsMap.get(listingId)!;
          listing.translations.push({
            id: row.translation_id,
            listing_id: row.id,
            language: row.language,
            name: row.translated_name || row.name,
            description: row.translated_description || row.description,
            special_characteristics: row.translated_special_characteristics || row.special_characteristics,
            whatsapp_message: row.translated_whatsapp_message || row.whatsapp_message,
            created_at: row.translation_created_at,
            updated_at: row.translation_updated_at
          });
        }
      }
      
      return Array.from(listingsMap.values());
    } catch (error) {
      console.error('Error finding listings by breed:', error);
      throw error;
    }
  }
}
