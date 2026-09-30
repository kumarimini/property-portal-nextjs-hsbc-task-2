package com.hsbc.marketapi.controller;

import com.hsbc.marketapi.model.DistributionBucket;
import com.hsbc.marketapi.model.MarketSummary;
import com.hsbc.marketapi.model.Property;
import com.hsbc.marketapi.model.PropertyFilter;
import com.hsbc.marketapi.model.SegmentStat;
import com.hsbc.marketapi.service.MarketAnalysisService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MarketController {

    private final MarketAnalysisService service;

    public MarketController(MarketAnalysisService service) {
        this.service = service;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/properties")
    public List<Property> properties(PropertyFilter filter) {
        filter.validate();
        return service.properties(filter);
    }

    @GetMapping("/market/summary")
    public MarketSummary summary(PropertyFilter filter) {
        filter.validate();
        return service.summary(filter);
    }

    @GetMapping("/market/distribution")
    public List<DistributionBucket> distribution(PropertyFilter filter) {
        filter.validate();
        return service.distribution(filter);
    }

    @GetMapping("/market/segments")
    public List<SegmentStat> segments(
            PropertyFilter filter,
            @RequestParam(defaultValue = "bedrooms") String groupBy) {
        filter.validate();
        return service.segments(filter, groupBy);
    }
}