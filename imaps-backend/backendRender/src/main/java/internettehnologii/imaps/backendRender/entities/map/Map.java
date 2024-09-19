package internettehnologii.imaps.backendRender.entities.map;
import com.fasterxml.jackson.databind.JsonNode;
import internettehnologii.imaps.backendRender.util.JsonNodeConverter;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;

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
    private Integer id;
    private String name;

    @Column(name = "map_data", columnDefinition = "jsonb")
    @Convert(converter = JsonNodeConverter.class)
    private JsonNode mapData; //json

    @Column(name = "graph_data", columnDefinition = "jsonb")
    @Convert(converter = JsonNodeConverter.class)
    private JsonNode graphData; //json

    private boolean isPublic;
    private String url;


    public Map(String name, JsonNode mapData, boolean isPublic, String url) {
        this.name = name;
        this.mapData = mapData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map() {

    }

    public Map(Integer id, String name, JsonNode mapData, boolean isPublic, String url) {
        this.id = id;
        this.name = name;
        this.mapData = mapData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map(Integer id, String name, JsonNode mapData, JsonNode graphData, boolean isPublic, String url) {
        this.id = id;
        this.name = name;
        this.mapData = mapData;
        this.graphData = graphData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map(String name, JsonNode mapData, JsonNode graphData, boolean isPublic, String url) {
        this.name = name;
        this.mapData = mapData;
        this.graphData = graphData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public JsonNode getMapData() {
        return mapData;
    }

    public JsonNode getGraphData() {
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

    public void setMapData(JsonNode mapData) {
        this.mapData = mapData;
    }

    public void setGraphData(JsonNode graphData) {
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
