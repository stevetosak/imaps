package internettehnologii.imaps.backendRender.web.entities;

import internettehnologii.imaps.backendRender.web.util.json.JsonMapData;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "floors")
@Getter @Setter
@IdClass(FloorId.class)
@ToString
public class Floor {

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "map_data")
    private JsonMapData mapData;

    @Id
    @Column(name = "num")
    private int floorNumber;

    @Id
    @ManyToOne
    @JoinColumn(name = "map_id",referencedColumnName = "id", nullable = false)
    private IndoorMap indoorMap;

    @PreUpdate
    public void preUpdate() {
        indoorMap.setModifiedAt(LocalDateTime.now());
    }

}
