package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;

public interface RoomTypeService {
    void addRoomType(String name, IndoorMap indoorMap);
    void deleteRoomType(String name,IndoorMap indoorMap);
}
