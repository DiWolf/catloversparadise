export interface CatListing {
  id: number;
  cat_id: number;
  name: string;
  gender: 'male' | 'female';
  age_months: number;
  color?: string;
  eye_color?: string;
  special_characteristics?: string;
  pet_price?: number;
  breeding_price?: number;
  status: 'available' | 'reserved' | 'sold';
  images?: string[];
  description?: string;
  whatsapp_message?: string;
  is_active: boolean;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface CatListingTranslation {
  id: number;
  listing_id: number;
  language: string;
  name: string;
  description?: string;
  special_characteristics?: string;
  whatsapp_message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CatListingWithDetails extends CatListing {
  translations: CatListingTranslation[];
  cat: {
    id: number;
    name: string;
    breed: string;
    slug: string;
  };
}

export interface CreateCatListingRequest {
  cat_id: number;
  name: string;
  gender: 'male' | 'female';
  age_months: number;
  color?: string;
  eye_color?: string;
  special_characteristics?: string;
  pet_price?: number;
  breeding_price?: number;
  status?: 'available' | 'reserved' | 'sold';
  images?: string[];
  description?: string;
  whatsapp_message?: string;
  translations: {
    language: string;
    name: string;
    description?: string;
    special_characteristics?: string;
    whatsapp_message?: string;
  }[];
}

export interface UpdateCatListingRequest extends Partial<CreateCatListingRequest> {
  id: number;
}

export interface CatListingFilters {
  cat_id?: number;
  gender?: 'male' | 'female';
  min_age?: number;
  max_age?: number;
  min_price?: number;
  max_price?: number;
  status?: 'available' | 'reserved' | 'sold';
  search?: string;
}
