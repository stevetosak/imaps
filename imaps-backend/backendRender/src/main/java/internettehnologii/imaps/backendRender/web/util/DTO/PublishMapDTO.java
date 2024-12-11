package internettehnologii.imaps.backendRender.web.util.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @AllArgsConstructor
@ToString
public class PublishMapDTO {
    private int id;
    private String name;
    private String lastName;
    private String mapName;
    private String mapType;
    private String googleMapsUrl;
}
