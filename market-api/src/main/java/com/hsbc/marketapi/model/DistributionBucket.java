package com.hsbc.marketapi.model;

public record DistributionBucket(double from, double to, String label, int count) {
}