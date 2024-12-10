package internettehnologii.imaps.backendRender.web.util.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class FloorDTO {
    int num;
    String mapName;
    String mapData; //json
}
