package internettehnologii.imaps.backendRender.web.util;

import internettehnologii.imaps.backendRender.web.entities.Floor;

import java.util.List;

public class Util {

    public static List<FloorDTO> convertToFloorDTO(List<Floor> floors){
        return floors.stream().map(f -> new FloorDTO(f.getFloorNumber(),f.getIndoorMap().getName(), f.getMapData().getJsonData())).toList();
    }
}
