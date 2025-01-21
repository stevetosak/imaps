package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.MAP_STATUS;
import internettehnologii.imaps.backendRender.web.entities.RoomType;
import internettehnologii.imaps.backendRender.web.util.DTO.EditMapDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.MapDTO;

import java.util.List;

public interface MapService {
    void createMap(String mapName, String username);
    void updateMap(IndoorMap indoorMap);
    MapDTO updateMapInfo(EditMapDTO editMapDTO);
    void deleteMap(IndoorMap indoorMap);
    List<IndoorMap> getAllMapsForUser(String username);
    List<IndoorMap> getPublicMaps();
    IndoorMap getMapForUser(String username, String mapName);
    IndoorMap getPublicMapByName(String mapName);
    IndoorMap getMapByName(String mapName);
    List<IndoorMap> findByStatus(MAP_STATUS status);
}
