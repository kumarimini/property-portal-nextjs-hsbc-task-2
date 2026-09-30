package com.hsbc.marketapi.model;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public record PropertyFilter(
        Integer bedrooms,
        Double minPrice,
        Double maxPrice,
        Double minSqft,
        Double maxSqft,
        Integer minYearBuilt,
        Integer maxYearBuilt,
        Double minSchoolRating) {

    public boolean matches(Property p) {
        return (bedrooms == null || p.bedrooms() == bedrooms)
                && (minPrice == null || p.price() >= minPrice)
                && (maxPrice == null || p.price() <= maxPrice)
                && (minSqft == null || p.squareFootage() >= minSqft)
                && (maxSqft == null || p.squareFootage() <= maxSqft)
                && (minYearBuilt == null || p.yearBuilt() >= minYearBuilt)
                && (maxYearBuilt == null || p.yearBuilt() <= maxYearBuilt)
                && (minSchoolRating == null || p.schoolRating() >= minSchoolRating);
    }

    /** Rejects impossible ranges with a clear 400 error. */
    public void validate() {
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            bad("minPrice cannot be greater than maxPrice");
        }
        if (minSqft != null && maxSqft != null && minSqft > maxSqft) {
            bad("minSqft cannot be greater than maxSqft");
        }
        if (minYearBuilt != null && maxYearBuilt != null && minYearBuilt > maxYearBuilt) {
            bad("minYearBuilt cannot be greater than maxYearBuilt");
        }
    }

    private static void bad(String message) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}   