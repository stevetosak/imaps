package internettehnologii.imaps.backendRender.web.util;

import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.util.DTO.FloorDTO;

import java.util.List;

public class Util {

    public static List<FloorDTO> convertToFloorDTO(List<Floor> floors){
        return floors.stream()
                .map(f -> new FloorDTO(
                        f.getFloorNumber(),
                        f.getIndoorMap().getName(),
                        f.getMapData() != null ? f.getMapData().getShapeData() : "")).toList();
    }
}
