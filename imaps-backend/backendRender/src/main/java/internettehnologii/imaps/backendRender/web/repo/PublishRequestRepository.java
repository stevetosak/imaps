package internettehnologii.imaps.backendRender.web.repo;

import internettehnologii.imaps.backendRender.web.entities.PublishRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublishRequestRepository extends JpaRepository<PublishRequest, Integer> {
    @Query(value = "FROM PublishRequest p WHERE p.resolved = false")
    Optional<List<PublishRequest>> findAllNotResolved();

    @Query(value = "FROM PublishRequest pr WHERE pr.map.name = ?1")
    Optional<PublishRequest> findByMapName(String mapName);

    boolean existsByMapName(String mapName);

}
