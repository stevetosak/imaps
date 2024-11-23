package internettehnologii.imaps.backendRender.web.util.json;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class JsonMapData implements Serializable {
    private String jsonData;
    public JsonMapData(String textData) {
        this.jsonData = textData;
    }
    public JsonMapData() {
    }

}
