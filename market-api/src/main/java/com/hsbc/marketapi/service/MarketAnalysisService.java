package com.hsbc.marketapi.service;

import com.hsbc.marketapi.model.DistributionBucket;
import com.hsbc.marketapi.model.MarketSummary;
import com.hsbc.marketapi.model.Property;
import com.hsbc.marketapi.model.PropertyFilter;
import com.hsbc.marketapi.model.SegmentStat;
import com.hsbc.marketapi.repository.PropertyRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.function.Function;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MarketAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(MarketAnalysisService.class);
    private static final double BUCKET_WIDTH = 50_000;

    private final PropertyRepository repository;

    public MarketAnalysisService(PropertyRepository repository) {
        this.repository = repository;
    }

    @Cacheable("properties")
    public List<Property> properties(PropertyFilter filter) {
        log.info("Cache miss: loading properties for {}", filter);
        return filtered(filter);
    }

    @Cacheable("summary")
    public MarketSummary summary(PropertyFilter filter) {
        log.info("Cache miss: computing summary for {}", filter);
        List<Property> list = filtered(filter);
        if (list.isEmpty()) {
            return new MarketSummary(0, 0, 0, 0, 0, 0, 0, 0, 0);
        }

        double[] prices = list.stream().mapToDouble(Property::price).sorted().toArray();
        int n = prices.length;
        double median = n % 2 == 1 ? prices[n / 2] : (prices[n / 2 - 1] + prices[n / 2]) / 2;

        return new MarketSummary(
                n,
                round2(average(list, Property::price)),
                median,
                prices[0],
                prices[n - 1],
                round2(average(list, p -> p.price() / p.squareFootage())),
                round2(average(list, Property::squareFootage)),
                round2(average(list, Property::yearBuilt)),
                round2(average(list, Property::schoolRating)));
    }

    @Cacheable("distribution")
    public List<DistributionBucket> distribution(PropertyFilter filter) {
        log.info("Cache miss: computing distribution for {}", filter);
        List<Property> list = filtered(filter);
        if (list.isEmpty()) {
            return List.of();
        }

        double min = list.stream().mapToDouble(Property::price).min().orElse(0);
        double max = list.stream().mapToDouble(Property::price).max().orElse(0);
        double start = Math.floor(min / BUCKET_WIDTH) * BUCKET_WIDTH;
        int bucketCount = (int) Math.floor((max - start) / BUCKET_WIDTH) + 1;

        int[] counts = new int[bucketCount];
        for (Property p : list) {
            counts[(int) Math.floor((p.price() - start) / BUCKET_WIDTH)]++;
        }

        List<DistributionBucket> result = new ArrayList<>();
        for (int i = 0; i < bucketCount; i++) {
            double from = start + i * BUCKET_WIDTH;
            double to = from + BUCKET_WIDTH;
            result.add(new DistributionBucket(from, to, label(from, to), counts[i]));
        }
        return result;
    }

    @Cacheable("segments")
    public List<SegmentStat> segments(PropertyFilter filter, String groupBy) {
        log.info("Cache miss: computing segments by {} for {}", groupBy, filter);

        Function<Property, Integer> keyOf;
        if ("bedrooms".equals(groupBy)) {
            keyOf = Property::bedrooms;
        } else if ("decade".equals(groupBy)) {
            keyOf = p -> (p.yearBuilt() / 10) * 10;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "groupBy must be 'bedrooms' or 'decade'");
        }

        Map<Integer, List<Property>> grouped = filtered(filter).stream()
                .collect(Collectors.groupingBy(keyOf, TreeMap::new, Collectors.toList()));

        return grouped.entrySet().stream()
                .map(e -> new SegmentStat(
                        segmentLabel(groupBy, e.getKey()),
                        e.getValue().size(),
                        round2(average(e.getValue(), Property::price)),
                        round2(average(e.getValue(), p -> p.price() / p.squareFootage()))))
                .toList();
    }

    private List<Property> filtered(PropertyFilter filter) {
        return repository.findAll().stream().filter(filter::matches).toList();
    }

    private static double average(List<Property> list, ToDoubleFunction<Property> field) {
        return list.stream().mapToDouble(field).average().orElse(0);
    }

    private static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private static String label(double from, double to) {
        return "$%dK-$%dK".formatted((int) (from / 1000), (int) (to / 1000));
    }

    private static String segmentLabel(String groupBy, int key) {
        return "decade".equals(groupBy) ? key + "s" : key + " bed";
    }
}