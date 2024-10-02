package internettehnologii.imaps.backendRender.web.repo;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.security.json.DataJson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MapRepository extends JpaRepository<IndoorMap, Long> {

    @Modifying
    @Query(nativeQuery = true,
    value = "UPDATE map SET map_data = ?1 WHERE name = ?2")
    void updateMapData(DataJson jsonMapData, String name);

    @Query(nativeQuery = true,
    value = "SELECT * FROM map WHERE name = ?1")
    Optional<IndoorMap> findMapByName(String name);
}
