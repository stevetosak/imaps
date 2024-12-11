package internettehnologii.imaps.backendRender.web.repo;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<IMapsUser, Long> {

    @Query(nativeQuery = true,
            value = "SELECT * FROM users u WHERE email= :usremail LIMIT 1")
    Optional<IMapsUser> findUserByEmail(String usremail);

    @Query(nativeQuery = true,
    value = "SELECT * FROM users u WHERE u.username = ?1 LIMIT 1")
    Optional<IMapsUser> findUserByName(String usrname);

    @Query(value = "FROM IMapsUser u WHERE u.username = ?1 OR u.email = ?1")
    Optional<IMapsUser> getIMapsUserByUsernameOrEmail(String usernameOrEmail);

    @Query(nativeQuery = true,
    value = "SELECT * FROM users u WHERE u.id= ?1")
    Optional<IMapsUser> getUserById(Long usrid);
}
