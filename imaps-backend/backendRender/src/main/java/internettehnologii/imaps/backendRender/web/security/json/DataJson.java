package internettehnologii.imaps.backendRender.web.security.json;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class DataJson implements Serializable {
    private String textData;
    private byte binaryData;

    public DataJson(String textData) {
        this.textData = textData;
    }

    public DataJson(byte binaryData) {
        this.binaryData = binaryData;
    }

    public DataJson() {}
}
