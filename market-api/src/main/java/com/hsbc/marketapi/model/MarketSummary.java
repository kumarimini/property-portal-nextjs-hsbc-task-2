package com.hsbc.marketapi.model;

public record MarketSummary(
        int count,
        double averagePrice,
        double medianPrice,
        double minPrice,
        double maxPrice,
        double averagePricePerSqFt,
        double averageSquareFootage,
        double averageYearBuilt,
        double averageSchoolRating) {
}