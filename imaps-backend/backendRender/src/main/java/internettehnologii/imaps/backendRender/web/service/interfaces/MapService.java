package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;

import java.util.List;

public interface MapService {
    void createMap(String mapName, String username);
    void updateMap(IndoorMap indoorMap);
    void deleteMap(IndoorMap indoorMap);
    IndoorMap getMap(String mapName);
    List<IndoorMap> getAllMapsForUser(String username);
    List<IndoorMap> getPublicMaps();
    IndoorMap getMapForUser(String username, String mapId);
}
