package internettehnologii.imaps.backendRender.web.util;

import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.util.DTO.FloorDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.MapDTO;

import java.util.Collection;
import java.util.List;

public class Util {

    public static List<FloorDTO> convertToFloorDTO(List<Floor> floors){
        return floors.stream()
                .map(f -> new FloorDTO(
                        f.getFloorNumber(),
                        f.getIndoorMap().getName(),
                        f.getMapData() != null ? f.getMapData().getShapeData() : "")).toList();
    }

    public static List<MapDTO> convertToMapDTO(Collection<IndoorMap> maps){

        return maps.stream()
                .map(imap -> new MapDTO(imap.getName(),
                        imap.getMapType(),
                        imap.getCreatedAt(),
                        imap.getModifiedAt(),
                        imap.getStatus().name(),
                        imap.getFavouriteCount(),
                        imap.getGmapsUrl()))
                .toList();
    }
}
