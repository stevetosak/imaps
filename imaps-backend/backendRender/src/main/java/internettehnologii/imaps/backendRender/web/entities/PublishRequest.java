package internettehnologii.imaps.backendRender.web.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "publish_form")
@Getter @Setter
public class PublishRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "gmaps_url")
    private String gMapsUrl;
    @Column(name = "map_type")
    private String mapType;
    private boolean resolved;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private IMapsUser user;

    @ManyToOne
    @JoinColumn(name = "map_id",referencedColumnName = "id")
    private IndoorMap map;

    public PublishRequest(String name, String lastName, String googleMapsUrl, String mapType) {
        this.name = name;
        this.lastName = lastName;
        this.gMapsUrl = googleMapsUrl;
        this.mapType = mapType;

    }
    public PublishRequest() {
        this.id = -1;
        this.name = "";
        this.lastName = "";
        this.gMapsUrl = "";
        this.mapType = "";
        this.resolved = false;
        this.map = new IndoorMap();
    }

    public PublishRequest(int id, String name, String lastName, String googleMapsUrl, String mapType) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.gMapsUrl = googleMapsUrl;
        this.mapType = mapType;
    }

    @Override
    public String toString() {
        return "PublishRequest{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gMapsUrl='" + gMapsUrl + '\'' +
                ", mapType='" + mapType + '\'' +
                ", resolved=" + resolved +
                '}';
    }
}
