package internettehnologii.imaps.backendRender.entities.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class UserConfig {
    @Bean
    CommandLineRunner commandLineRunner(UserRepository repository){
        return args -> {
            User martin = new User("Martin", "martindjakov03@gmail.com", "martin4e");
            User stefan = new User( "Stefan", "stefantoskovski03@gmail.com", "stef4e");
            repository.saveAll(
                    List.of(martin, stefan)
            );
        };

    };
}
