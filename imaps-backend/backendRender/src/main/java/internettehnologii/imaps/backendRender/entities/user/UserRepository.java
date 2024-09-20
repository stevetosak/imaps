package internettehnologii.imaps.backendRender.entities.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<IMapsUser, Long> {

    // za da testiras queries, kaj so imat specijalen karakter primer @, moras vo navodnici da klajs.

    @Query(nativeQuery = true,
            value = "SELECT * FROM users u WHERE email= :usremail LIMIT 1")
    Optional<IMapsUser> findUserByEmail(String usremail);

    @Query(nativeQuery = true,
    value = "SELECT * FROM users u WHERE u.name = ?1 LIMIT 1")
    IMapsUser findUserByName(String usrname);

    @Query(nativeQuery = true,
    value = "SELECT * FROM users u WHERE u.id= ?1")
    IMapsUser getUserById(Long usrid);

}
