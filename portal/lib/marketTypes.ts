export interface Property {
  id: number;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize: number;
  distanceToCityCenter: number;
  schoolRating: number;
  price: number;
}

export interface MarketSummary {
  count: number;
  averagePrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  averagePricePerSqFt: number;
  averageSquareFootage: number;
  averageYearBuilt: number;
  averageSchoolRating: number;
}

export interface DistributionBucket {
  from: number;
  to: number;
  label: string;
  count: number;
}

export interface SegmentStat {
  segment: string;
  count: number;
  averagePrice: number;
  averagePricePerSqFt: number;
}

export interface MarketData {
  summary: MarketSummary;
  distribution: DistributionBucket[];
  bedroomSegments: SegmentStat[];
  decadeSegments: SegmentStat[];
  properties: Property[];
}