import { query } from '../config/database';
import { Cat, CatWithTranslations, CreateCatRequest, UpdateCatRequest, CatTranslation } from '../types/Cat';

export class CatService {
  // Obtener todos los gatos activos
  static async findAll(): Promise<CatWithTranslations[]> {
    try {
      const sql = `
        SELECT c.*, ct.language, ct.name as translated_name, 
               ct.description as translated_description,
               ct.characteristics as translated_characteristics,
               ct.temperament as translated_temperament,
               ct.care as translated_care
        FROM cats c
        LEFT JOIN cat_translations ct ON c.id = ct.cat_id
        WHERE c.is_active = TRUE
        ORDER BY c.created_at DESC
      `;
      
      const results = await query(sql);
      
      // Agrupar por gato y organizar traducciones
      const catsMap = new Map<number, CatWithTranslations>();
      
      results.forEach((row: any) => {
        if (!catsMap.has(row.id)) {
          catsMap.set(row.id, {
            id: row.id,
            name: row.name,
            breed: row.breed,
            slug: row.slug,
            description: row.description,
            characteristics: row.characteristics,
            temperament: row.temperament,
            care: row.care,
            hero_image: row.hero_image,
            main_image: row.main_image,
            is_active: row.is_active,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
            translations: []
          });
        }
        
        if (row.language) {
          catsMap.get(row.id)!.translations.push({
            id: row.id,
            cat_id: row.cat_id,
            language: row.language,
            name: row.translated_name,
            description: row.translated_description,
            characteristics: row.translated_characteristics,
            temperament: row.translated_temperament,
            care: row.translated_care,
            created_at: row.created_at,
            updated_at: row.updated_at
          });
        }
      });
      
      return Array.from(catsMap.values());
    } catch (error) {
      console.error('Error finding all cats:', error);
      throw error;
    }
  }

  // Obtener gato por slug
  static async findBySlug(slug: string, language: string = 'eng'): Promise<CatWithTranslations | null> {
    try {
      const sql = `
        SELECT c.*, ct.language, ct.name as translated_name, 
               ct.description as translated_description,
               ct.characteristics as translated_characteristics,
               ct.temperament as translated_temperament,
               ct.care as translated_care
        FROM cats c
        LEFT JOIN cat_translations ct ON c.id = ct.cat_id AND ct.language = ?
        WHERE c.slug = ? AND c.is_active = TRUE
      `;
      
      const results = await query(sql, [language, slug]);
      
      if (results.length === 0) return null;
      
      const cat = results[0];
      const translations: CatTranslation[] = [];
      
      if (cat.language) {
        translations.push({
          id: cat.id,
          cat_id: cat.cat_id,
          language: cat.language,
          name: cat.translated_name,
          description: cat.translated_description,
          characteristics: cat.translated_characteristics,
          temperament: cat.translated_temperament,
          care: cat.translated_care,
          created_at: cat.created_at,
          updated_at: cat.updated_at
        });
      }
      
      return {
        id: cat.id,
        name: cat.name,
        breed: cat.breed,
        slug: cat.slug,
        description: cat.description,
        characteristics: cat.characteristics,
        temperament: cat.temperament,
        care: cat.care,
        hero_image: cat.hero_image,
        main_image: cat.main_image,
        is_active: cat.is_active,
        created_by: cat.created_by,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
        translations
      };
    } catch (error) {
      console.error('Error finding cat by slug:', error);
      throw error;
    }
  }

  // Obtener gato por ID
  static async findById(id: number): Promise<CatWithTranslations | null> {
    try {
      const sql = `
        SELECT c.*, ct.language, ct.name as translated_name, 
               ct.description as translated_description,
               ct.characteristics as translated_characteristics,
               ct.temperament as translated_temperament,
               ct.care as translated_care
        FROM cats c
        LEFT JOIN cat_translations ct ON c.id = ct.cat_id
        WHERE c.id = ? AND c.is_active = TRUE
      `;
      
      const results = await query(sql, [id]);
      
      if (results.length === 0) return null;
      
      const cat = results[0];
      const translations: CatTranslation[] = [];
      
      results.forEach((row: any) => {
        if (row.language) {
          translations.push({
            id: row.id,
            cat_id: row.cat_id,
            language: row.language,
            name: row.translated_name,
            description: row.translated_description,
            characteristics: row.translated_characteristics,
            temperament: row.translated_temperament,
            care: row.translated_care,
            created_at: row.created_at,
            updated_at: row.updated_at
          });
        }
      });
      
      return {
        id: cat.id,
        name: cat.name,
        breed: cat.breed,
        slug: cat.slug,
        description: cat.description,
        characteristics: cat.characteristics,
        temperament: cat.temperament,
        care: cat.care,
        hero_image: cat.hero_image,
        main_image: cat.main_image,
        is_active: cat.is_active,
        created_by: cat.created_by,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
        translations
      };
    } catch (error) {
      console.error('Error finding cat by ID:', error);
      throw error;
    }
  }

  // Crear nuevo gato
  static async create(catData: CreateCatRequest, userId: number): Promise<Cat> {
    try {
      // Crear el gato principal
      const catSql = `
        INSERT INTO cats (name, breed, slug, description, characteristics, temperament, care, hero_image, main_image, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const catResult = await query(catSql, [
        catData.name,
        catData.breed,
        catData.slug,
        catData.description,
        catData.characteristics,
        catData.temperament,
        catData.care,
        catData.hero_image,
        catData.main_image,
        userId
      ]);
      
      const catId = catResult.insertId;
      
      // Crear traducciones
      if (catData.translations && catData.translations.length > 0) {
        for (const translation of catData.translations) {
          const translationSql = `
            INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          
          await query(translationSql, [
            catId,
            translation.language,
            translation.name,
            translation.description,
            translation.characteristics,
            translation.temperament,
            translation.care
          ]);
        }
      }
      
      const newCat = await this.findById(catId);
      return newCat!;
    } catch (error) {
      console.error('Error creating cat:', error);
      throw error;
    }
  }

  // Actualizar gato
  static async update(id: number, catData: UpdateCatRequest, userId: number): Promise<Cat> {
    try {
      // Actualizar gato principal
      const updateFields = [];
      const values = [];
      
      if (catData.name) { updateFields.push('name = ?'); values.push(catData.name); }
      if (catData.breed) { updateFields.push('breed = ?'); values.push(catData.breed); }
      if (catData.slug) { updateFields.push('slug = ?'); values.push(catData.slug); }
      if (catData.description) { updateFields.push('description = ?'); values.push(catData.description); }
      if (catData.characteristics) { updateFields.push('characteristics = ?'); values.push(catData.characteristics); }
      if (catData.temperament) { updateFields.push('temperament = ?'); values.push(catData.temperament); }
      if (catData.care) { updateFields.push('care = ?'); values.push(catData.care); }
      if (catData.hero_image) { updateFields.push('hero_image = ?'); values.push(catData.hero_image); }
      if (catData.main_image) { updateFields.push('main_image = ?'); values.push(catData.main_image); }
      
      if (updateFields.length > 0) {
        updateFields.push('updated_at = NOW()');
        values.push(id);
        
        const catSql = `UPDATE cats SET ${updateFields.join(', ')} WHERE id = ?`;
        await query(catSql, values);
      }
      
      // Actualizar traducciones
      if (catData.translations && catData.translations.length > 0) {
        // Eliminar traducciones existentes
        await query('DELETE FROM cat_translations WHERE cat_id = ?', [id]);
        
        // Insertar nuevas traducciones
        for (const translation of catData.translations) {
          const translationSql = `
            INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          
          await query(translationSql, [
            id,
            translation.language,
            translation.name,
            translation.description,
            translation.characteristics,
            translation.temperament,
            translation.care
          ]);
        }
      }
      
      const updatedCat = await this.findById(id);
      return updatedCat!;
    } catch (error) {
      console.error('Error updating cat:', error);
      throw error;
    }
  }

  // Eliminar gato (soft delete)
  static async delete(id: number): Promise<void> {
    try {
      const sql = 'UPDATE cats SET is_active = FALSE WHERE id = ?';
      await query(sql, [id]);
    } catch (error) {
      console.error('Error deleting cat:', error);
      throw error;
    }
  }

  // Verificar si el slug existe
  static async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    try {
      let sql = 'SELECT COUNT(*) as count FROM cats WHERE slug = ? AND is_active = TRUE';
      const params = [slug];
      
      if (excludeId) {
        sql += ' AND id != ?';
        params.push(String(excludeId));
      }
      
      const result = await query(sql, params);
      return result[0].count > 0;
    } catch (error) {
      console.error('Error checking slug existence:', error);
      throw error;
    }
  }
}
