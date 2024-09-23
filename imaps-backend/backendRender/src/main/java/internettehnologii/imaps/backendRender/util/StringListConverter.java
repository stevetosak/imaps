package internettehnologii.imaps.backendRender.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();


    @Override
    public String convertToDatabaseColumn(List<String> attribute) { //LIST<STRING> TO JSON(STRING)
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not convert list to JSON", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) { //JSON(STRING) TO LIST<STRING>
        try {
            return objectMapper.readValue(dbData, List.class);
        } catch (IOException e) {
            throw new RuntimeException("Could not convert JSON to list", e);
        }
    }
}
