package internettehnologii.imaps.backendRender.web.repo;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.MAP_STATUS;
import internettehnologii.imaps.backendRender.web.util.json.JsonMapData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MapRepository extends JpaRepository<IndoorMap, Long> {


    @Query(nativeQuery = true,
            value = "SELECT * FROM maps WHERE name = ?1")
    Optional<IndoorMap> findMapByName(String name);

    @Query("FROM IndoorMap m WHERE m.status = ?1")
    Optional<List<IndoorMap>> findAllByStatus(String status);

    @Query("FROM IndoorMap m WHERE m.user.id = ?1")
    Optional<List<IndoorMap>> findAllMapsForUser(long userId);

    @Query("FROM IndoorMap m WHERE m.status = 'PUBLIC'")
    Optional<List<IndoorMap>> findAllPublicMaps();

    @Query("FROM IndoorMap m WHERE m.user = ?1 AND m.id = ?2")
    Optional<IndoorMap> getMapForUser(IMapsUser user, int mapId);

    boolean existsByName(String name);


    Optional<IndoorMap> getIndoorMapByName(String name);
    @Query(value = "FROM IndoorMap m where m.name = ?1 and m.status = ?2")
    Optional<IndoorMap> getIndoorMapByNameAndStatus(String name, MAP_STATUS status);
}
