package internettehnologii.imaps.backendRender.web.util.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Setter
@ToString
public class SaveMapDTO {

    Object shapes;
    Object roomTypes;
    String mapName;
    int floorNum;
}
