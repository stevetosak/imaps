package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.RoomType;
import internettehnologii.imaps.backendRender.web.repo.RoomTypeRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.RoomTypeService;
import org.springframework.stereotype.Service;

@Service
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public RoomTypeServiceImpl(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    @Override
    public void addRoomType(String name, IndoorMap map) {
        roomTypeRepository.save(new RoomType(name, map));
    }

    @Override
    public void deleteRoomType(String name, IndoorMap indoorMap) {
        roomTypeRepository.delete(new RoomType(name, indoorMap));
    }
}
