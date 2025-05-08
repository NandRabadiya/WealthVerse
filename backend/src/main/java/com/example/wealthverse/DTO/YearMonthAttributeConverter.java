package com.example.wealthverse.DTO;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.*;

import java.time.YearMonth;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Converter(autoApply = true)
public class YearMonthAttributeConverter implements AttributeConverter<YearMonth, String> {

    @Override
    public String convertToDatabaseColumn(YearMonth attribute) {
        return (attribute != null) ? attribute.toString() : null; // e.g. "2025-05"
    }

    @Override
    public YearMonth convertToEntityAttribute(String dbData) {
        return (dbData != null) ? YearMonth.parse(dbData) : null;
    }
}
