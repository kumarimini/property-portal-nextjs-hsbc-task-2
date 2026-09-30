package com.hsbc.marketapi.repository;

import com.hsbc.marketapi.model.Property;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

@Repository
public class PropertyRepository {

    private final List<Property> properties;

    public PropertyRepository() {
        this.properties = List.copyOf(load());
    }

    public List<Property> findAll() {
        return properties;
    }

    private List<Property> load() {
        ClassPathResource resource = new ClassPathResource("data/house_prices.csv");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            List<Property> result = new ArrayList<>();
            reader.readLine(); // skip the header row
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) {
                    continue;
                }
                String[] c = line.trim().split(",");
                result.add(new Property(
                        Integer.parseInt(c[0].trim()),
                        Double.parseDouble(c[1].trim()),
                        Integer.parseInt(c[2].trim()),
                        Double.parseDouble(c[3].trim()),
                        Integer.parseInt(c[4].trim()),
                        Double.parseDouble(c[5].trim()),
                        Double.parseDouble(c[6].trim()),
                        Double.parseDouble(c[7].trim()),
                        Double.parseDouble(c[8].trim())));
            }
            return result;
        } catch (IOException e) {
            throw new UncheckedIOException("Could not read the housing dataset", e);
        }
    }
}