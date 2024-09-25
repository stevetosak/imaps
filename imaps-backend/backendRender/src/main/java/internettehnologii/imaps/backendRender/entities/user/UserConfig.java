package internettehnologii.imaps.backendRender.entities.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Configuration
public class UserConfig {

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    @Bean
    CommandLineRunner commandLineRunner(UserRepository repository){
        return args -> {
            IMapsUser martin = new IMapsUser("martin", "martindjakov03@gmail.com", bCryptPasswordEncoder.encode("dzako"));
            IMapsUser stefan = new IMapsUser( "stefan", "stefantoskovski03@gmail.com", bCryptPasswordEncoder.encode("toska"));
            repository.saveAll(
                    List.of(martin, stefan)
            );
        };

    };
}
