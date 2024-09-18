package internettehnologii.imaps.backendRender.entities.map;
import jakarta.persistence.*;

@Entity
@Table
public class Map {
    @Id
    @SequenceGenerator(
            name = "map_id_seq",
            sequenceName = "map_id_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "map_id_seq"
    )
    private int id;
    private String name;

    private String mapData; //json

    private String graphData; //json

    private boolean isPublic;
    private String url;


    public Map(String name, String mapData, boolean isPublic, String url) {
        this.name = name;
        this.mapData = mapData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map() {

    }

    public Map(int id, String name, String mapData, boolean isPublic, String url) {
        this.id = id;
        this.name = name;
        this.mapData = mapData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map(int id, String name, String mapData, String graphData, boolean isPublic, String url) {
        this.id = id;
        this.name = name;
        this.mapData = mapData;
        this.graphData = graphData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map(String name, String mapData, String graphData, boolean isPublic, String url) {
        this.name = name;
        this.mapData = mapData;
        this.graphData = graphData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getMapData() {
        return mapData;
    }

    public String getGraphData() {
        return graphData;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public String getUrl() {
        return url;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMapData(String mapData) {
        this.mapData = mapData;
    }

    public void setGraphData(String graphData) {
        this.graphData = graphData;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public String toString() {
        return "Map{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", mapData='" + mapData + '\'' +
                ", graphData='" + graphData + '\'' +
                ", isPublic=" + isPublic +
                ", url='" + url + '\'' +
                '}';
    }
}
