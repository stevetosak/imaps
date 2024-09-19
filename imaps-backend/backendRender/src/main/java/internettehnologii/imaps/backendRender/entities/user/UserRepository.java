package internettehnologii.imaps.backendRender.entities.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // za da testiras queries, kaj so imat specijalen karakter primer @, moras vo navodnici da klajs.

    @Query(nativeQuery = true,
            value = "SELECT * FROM users u WHERE email= :usremail LIMIT 1")
    Optional<User> findUserByEmail(String usremail);

    @Query(nativeQuery = true,
    value = "SELECT * FROM users u WHERE u.name = ?1 LIMIT 1")
    User findUserByName(@Param("usrname") String usrname);

    @Query(nativeQuery = true,
    value = "SELECT * FROM users u WHERE u.id= ?1")
    User getUserById(Long usrid);
}
