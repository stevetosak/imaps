package internettehnologii.imaps.backendRender.web.entities;

import internettehnologii.imaps.backendRender.web.security.json.DataJson;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "floors")
@Getter @Setter
public class Floor {

    @Id
    @SequenceGenerator(name = "floors_id_seq",sequenceName = "floors_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "floors_id_seq")
    private int id;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "map_data")
    private DataJson mapData;

    @Column(name = "num")
    private int floorNumber;

    @ManyToOne
    @JoinColumn(name = "map_id",referencedColumnName = "id", nullable = false)
    private IndoorMap indoorMap;

    @Enumerated(EnumType.STRING)
    private MAP_STATUS status;

    @Override
    public String toString() {
        return "Floor{" +
                "id=" + id +
                ", mapData=" + mapData +
                ", floorNumber=" + floorNumber +
                ", indoorMap=" + indoorMap +
                ", status=" + status +
                '}';
    }
}

// @Id
//    @SequenceGenerator(
//            name = "users_id_seq",
//            sequenceName = "users_id_seq",
//            allocationSize = 1
//    )
//    @GeneratedValue(
//            strategy = GenerationType.SEQUENCE,
//            generator = "users_id_seq"
//    )
//    private int id;
//    @Setter
//    @Column(name = "name")
//    private String username;