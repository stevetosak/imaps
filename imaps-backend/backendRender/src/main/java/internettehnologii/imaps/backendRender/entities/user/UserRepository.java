package internettehnologii.imaps.backendRender.entities.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT s FROM User s where s.email = ?1")

    //SELECT * FROM user WHERE emalil = ?
    Optional<User>  findUserByEmail(String email);
}
