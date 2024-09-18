package internettehnologii.imaps.backendRender.entities.map;

import internettehnologii.imaps.backendRender.entities.map.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MapRepository extends JpaRepository<Map, Long> {

    @Query("SELECT s FROM Map s where s.email = ?1")

    //SELECT * FROM map WHERE emalil = ?
    Optional<internettehnologii.imaps.backendRender.entities.map.Map>  findMapByEmail(String email);
}
