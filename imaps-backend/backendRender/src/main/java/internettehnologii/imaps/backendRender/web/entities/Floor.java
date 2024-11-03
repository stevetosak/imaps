package internettehnologii.imaps.backendRender.web.entities;

import internettehnologii.imaps.backendRender.web.security.json.JsonMapData;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "floors")
@Getter @Setter
@IdClass(FloorId.class)
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

    @Enumerated(EnumType.STRING)
    private MAP_STATUS status;

    @PrePersist
    private void onCreate() {
        this.status = MAP_STATUS.PRIVATE;
    }

}
