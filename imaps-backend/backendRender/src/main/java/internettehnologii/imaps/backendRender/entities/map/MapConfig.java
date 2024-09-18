package internettehnologii.imaps.backendRender.entities.map;

import internettehnologii.imaps.backendRender.entities.map.Map;
import internettehnologii.imaps.backendRender.entities.map.MapRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class MapConfig {
    @Bean
    CommandLineRunner commandLineRunner(MapRepository repository){
        return args -> {
            Map martin = new Map("MARTINCE", "json1", true, "url");
            Map stefan = new Map("STEFCE", "json1", true, "url");
            repository.saveAll(
                    List.of(martin, stefan)
            );
        };

    };
}
