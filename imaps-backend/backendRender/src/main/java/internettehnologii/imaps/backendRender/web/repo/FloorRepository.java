package internettehnologii.imaps.backendRender.web.repo;

import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.security.json.DataJson;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FloorRepository extends JpaRepository<Floor, Integer> {

    @Query("FROM Floor f WHERE f.indoorMap.id = ?1")
    Optional<List<Floor>> getAllFloorsForMapById(Integer indoorMapId);

    @Query("FROM Floor f WHERE f.floorNumber = ?1 AND f.indoorMap = ?2")
    Optional<Floor> findFloorByFloorNumber(Integer floorNumber, IndoorMap indoorMap);

    @Modifying @Transactional
    @Query("UPDATE Floor f SET f.mapData = ?3 WHERE f.floorNumber = ?1 AND f.indoorMap.id = ?2")
    void updateMapData(Integer floorNumber, Integer indoorMapId, DataJson mapData);

    @Query("FROM Floor f WHERE f.indoorMap = ?1 AND f.status = 'PUBLIC'")
    Optional<List<Floor>> getAllPublicFloorsForMap(IndoorMap indoorMap);
    @Query("SELECT COUNT(f) > 0 FROM Floor f WHERE f.floorNumber = ?1 AND f.indoorMap = ?2")
    boolean existsFloorForMap(Integer floorNumber, IndoorMap indoorMap);
}
