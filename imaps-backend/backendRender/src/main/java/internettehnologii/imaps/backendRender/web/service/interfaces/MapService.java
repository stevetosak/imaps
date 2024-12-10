package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.RoomType;

import java.util.List;

public interface MapService {
    void createMap(String mapName, String mapType, String username);
    void updateMap(IndoorMap indoorMap);
    void deleteMap(IndoorMap indoorMap);
    List<IndoorMap> getAllMapsForUser(String username);
    List<IndoorMap> getPublicMaps();
    IndoorMap getMapForUser(String username, String mapName);
    IndoorMap getPublicMapByName(String mapName);
    IndoorMap getMapByName(String mapName);
}
