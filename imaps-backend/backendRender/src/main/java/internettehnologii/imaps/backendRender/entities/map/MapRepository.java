package internettehnologii.imaps.backendRender.entities.map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MapRepository extends JpaRepository<IndoorMap, Long> {

}
