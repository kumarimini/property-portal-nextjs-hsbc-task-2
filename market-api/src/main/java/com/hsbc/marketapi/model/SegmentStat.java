package com.hsbc.marketapi.model;

public record SegmentStat(String segment, int count, double averagePrice, double averagePricePerSqFt) {
}