export interface Cat {
  id: number;
  name: string;
  breed: string;
  slug: string;
  description: string;
  characteristics: string;
  temperament: string;
  care: string;
  hero_image: string;
  main_image: string;
  is_active: boolean;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface CatTranslation {
  id: number;
  cat_id: number;
  language: string;
  name: string;
  description: string;
  characteristics: string;
  temperament: string;
  care: string;
  created_at: Date;
  updated_at: Date;
}

export interface CatWithTranslations extends Cat {
  translations: CatTranslation[];
}

export interface CreateCatRequest {
  name: string;
  breed: string;
  slug: string;
  description: string;
  characteristics: string;
  temperament: string;
  care: string;
  hero_image: string;
  main_image: string;
  translations: {
    language: string;
    name: string;
    description: string;
    characteristics: string;
    temperament: string;
    care: string;
  }[];
}

export interface UpdateCatRequest extends Partial<CreateCatRequest> {
  id: number;
}




