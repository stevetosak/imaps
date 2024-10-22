package internettehnologii.imaps.backendRender.web.repo;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.security.json.DataJson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MapRepository extends JpaRepository<IndoorMap, Long> {

//    @Modifying
//    @Query(nativeQuery = true,
//            value = "UPDATE maps SET map_data = ?2 WHERE name = ?1")
//    void updateMapData(IndoorMap map);
//
//    @Modifying
//    @Query(nativeQuery = true,
//            value = "INSERT INTO maps(name,map_data) VALUES (?1, ?2)")
//    void insertMapData(String name, DataJson data);

    @Query(nativeQuery = true,
            value = "SELECT * FROM maps WHERE name = ?1")
    Optional<IndoorMap> findMapByName(String name);

    @Query(nativeQuery = true,
            value = "SELECT maps.map_data FROM maps WHERE name = ?1")
    Optional<DataJson> findMapDataByName(String name);


    @Query(nativeQuery = true,
    value = "SELECT * FROM maps WHERE is_public = false")
    Optional<List<IndoorMap>> findAllByStatus();
}
