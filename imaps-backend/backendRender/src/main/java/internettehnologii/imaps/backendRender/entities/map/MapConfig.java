package internettehnologii.imaps.backendRender.entities.map;

import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.util.json.DataJson;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class MapConfig {
    String jsonTest1 = "{\n" +
            "  \"id\": 1,\n" +
            "  \"name\": \"Sample Map\",\n" +
            "  \"mapData\": {\n" +
            "    \"type\": \"2D\",\n" +
            "    \"features\": [\n" +
            "      {\"name\": \"River\", \"location\": {\"x\": 10, \"y\": 20}},\n" +
            "      {\"name\": \"Mountain\", \"location\": {\"x\": 30, \"y\": 40}}\n" +
            "    ]\n" +
            "  },\n" +
            "  \"graphData\": {\n" +
            "    \"nodes\": [\n" +
            "      {\"id\": \"A\", \"label\": \"Start\"},\n" +
            "      {\"id\": \"B\", \"label\": \"Finish\"}\n" +
            "    ],\n" +
            "    \"edges\": [\n" +
            "      {\"source\": \"A\", \"target\": \"B\", \"weight\": 5}\n" +
            "    ]\n" +
            "  },\n" +
            "  \"isPublic\": true,\n" +
            "  \"url\": \"http://example.com/map\"\n" +
            "}\n";
    @Bean
    CommandLineRunner mapCmdLineRunner(MapRepository repository){
        return args -> {
            Map martin = new Map("MARTINCE",new DataJson(jsonTest1),true, "url");
            Map stefan = new Map("STEFCE", new DataJson(jsonTest1), true, "url");
            repository.saveAll(
                    List.of(martin, stefan)
            );
        };
    };
}
