package internettehnologii.imaps.backendRender.web.repo;

import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.util.json.JsonMapData;
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

    @Query("SELECT COUNT(f) > 0 FROM Floor f WHERE f.floorNumber = ?1 AND f.indoorMap = ?2")
    boolean existsFloorForMap(Integer floorNumber, IndoorMap indoorMap);
    void deleteFloorByFloorNumberAndIndoorMap(Integer floorNumber,IndoorMap indoorMap);

    Optional<Floor> findFloorByFloorNumberAndIndoorMap(Integer floorNumber,IndoorMap indoorMap);
}
