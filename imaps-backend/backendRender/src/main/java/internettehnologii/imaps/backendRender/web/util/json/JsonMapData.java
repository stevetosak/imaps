package internettehnologii.imaps.backendRender.web.util.json;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
public class JsonMapData implements Serializable {
    private String shapeData;
    private String  roomTypes;
    public JsonMapData(String shapeData, String roomTypes) {
        this.shapeData = shapeData;
        this.roomTypes = roomTypes;
    }
    public JsonMapData() {
        shapeData = "";
        roomTypes = "";
    }

}
