export interface HouseInputs {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
}

export interface Estimate {
  id: number;
  created_at: string;
  inputs: HouseInputs;
  predicted_price: number;
}