package internettehnologii.imaps.backendRender.util.json;

import java.io.Serializable;

public class DataJson implements Serializable {
    private String textData;
    private byte binaryData;

    public byte getBinaryData() {
        return binaryData;
    }

    public void setBinaryData(byte binaryData) {
        this.binaryData = binaryData;
    }

    public String getTextData() {
        return textData;
    }

    public void setTextData(String textData) {
        this.textData = textData;
    }

    public DataJson(String textData) {
        this.textData = textData;
    }

    public DataJson(byte binaryData) {
        this.binaryData = binaryData;
    }

    public DataJson() {}
}
