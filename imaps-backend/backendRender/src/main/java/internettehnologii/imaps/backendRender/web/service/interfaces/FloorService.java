package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;

import java.util.List;

public interface FloorService {
    void addFloor(int num, String mapName);
    void updateFloor(Floor floor);
    void deleteFloor(Floor floor);
    List<Floor> getAllFloorsForMap(String mapName);
    Floor getFloorByNum(Integer floorNum, IndoorMap indoorMap);
    Floor loadFirstAvailableFloor(String mapName);
    List<Floor> getAllPublicFloors(String mapName);
    void save(int floorNum, IndoorMap map);

}
