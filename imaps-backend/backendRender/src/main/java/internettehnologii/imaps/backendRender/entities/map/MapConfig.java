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
            Map martin = new Map("Martin", "martindjakov03@gmail.com", "martin4e");
            Map stefan = new Map( "Stefan", "stefantoskovski03@gmail.com", "stef4e");
            repository.saveAll(
                    List.of(martin, stefan)
            );
        };

    };
}
