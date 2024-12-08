package internettehnologii.imaps.backendRender.web.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "room_types")
@Getter
@Setter
public class RoomType {
    @Id
    @SequenceGenerator(name = "room_types_id_seq", sequenceName = "room_types_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "room_types_id_seq")
    private int id;
    private String name;
    @ManyToOne
    @JoinColumn(name = "map_id")
    private IndoorMap indoorMap;

    public RoomType(String name, IndoorMap map) {
        this.name = name;
        this.indoorMap = map;
    }

    public RoomType() {

    }
}
