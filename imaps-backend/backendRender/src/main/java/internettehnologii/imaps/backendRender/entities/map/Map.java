package internettehnologii.imaps.backendRender.entities.map;
import com.fasterxml.jackson.databind.JsonNode;
import internettehnologii.imaps.backendRender.util.JsonNodeConverter;
import internettehnologii.imaps.backendRender.util.json.DataJson;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import javax.xml.crypto.Data;

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

    @JdbcTypeCode(SqlTypes.JSON)
    private DataJson mapData; //json

    @JdbcTypeCode(SqlTypes.JSON)
    private DataJson graphData; //json

    private boolean isPublic;
    private String url;


    public Map(String name, DataJson mapData, boolean isPublic, String url) {
        this.name = name;
        this.mapData = mapData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map() {

    }

    public Map(Integer id, String name, DataJson mapData, boolean isPublic, String url) {
        this.id = id;
        this.name = name;
        this.mapData = mapData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map(Integer id, String name, DataJson mapData, DataJson graphData, boolean isPublic, String url) {
        this.id = id;
        this.name = name;
        this.mapData = mapData;
        this.graphData = graphData;
        this.isPublic = isPublic;
        this.url = url;
    }

    public Map(String name, DataJson mapData, DataJson graphData, boolean isPublic, String url) {
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

    public DataJson getMapData() {
        return mapData;
    }

    public DataJson getGraphData() {
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

    public void setMapData(DataJson mapData) {
        this.mapData = mapData;
    }

    public void setGraphData(DataJson graphData) {
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
