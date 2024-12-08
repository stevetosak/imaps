package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.exceptions.*;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.repo.FloorRepository;
import internettehnologii.imaps.backendRender.web.repo.MapRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.FloorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FloorServiceImpl implements FloorService {

    private final FloorRepository floorRepository;
    private final MapRepository mapRepository;

    @Autowired
    public FloorServiceImpl(FloorRepository floorRepository, MapRepository mapRepository) {
        this.floorRepository = floorRepository;
        this.mapRepository = mapRepository;
    }

    @Override
    public void addFloor(int num, String mapName) {
        IndoorMap indoorMap = mapRepository.findMapByName(mapName).orElseThrow(() -> new MapNotFoundException(mapName));

        if(floorRepository.existsFloorForMap(num,indoorMap)){
            throw new FloorAlreadyExistsException("Floor: " + num + " already exists for map: " + indoorMap.getName());
        }

        Floor floor = new Floor();
        floor.setFloorNumber(num);
        floor.setIndoorMap(indoorMap);
        floorRepository.save(floor);
    }

    @Override
    public void updateFloor(Floor floor) {
        floorRepository.save(floor);
    }

    @Override
    public void deleteFloor(int floorNum,String mapName) {
        IndoorMap map = mapRepository.findMapByName(mapName).orElseThrow(() -> new MapNotFoundException(mapName));
        if(!floorRepository.existsFloorForMap(floorNum,map)) throw new FloorNotFoundException("Floor: " + floorNum + " does not exist for map: " + map.getName());

        floorRepository.deleteFloorByFloorNumberAndIndoorMap(floorNum,map);
    }

    @Override
    public List<Floor> getAllFloorsForMap(String mapName) {
        IndoorMap map = mapRepository.findMapByName(mapName).orElseThrow(() -> new MapNotFoundException(mapName));

        return floorRepository.getAllFloorsForMapById(map.getId()).orElseGet(ArrayList::new);
    }

    @Override
    public Floor getFloorByNum(Integer floorNum, IndoorMap indoorMap) throws InvalidParametersException {
        return floorRepository.findFloorByFloorNumber(floorNum, indoorMap).orElseThrow(
                () -> new InvalidParametersException("Could not find floor.\n floorNum: " + floorNum + "\n indoorMap: " + indoorMap)
        );
    }

    @Override
    public List<Floor> getAllPublicFloors(String mapName) throws EmptyMapException {

        Optional<IndoorMap> map = mapRepository.findMapByName(mapName);

        if(map.isPresent()) {
            return floorRepository.getAllPublicFloorsForMap(map.get()).orElseThrow(
                    () ->  new EmptyMapException("Map: " + map.get().getName() + " has no public floors"));
        }

        throw new MapNotFoundException("Map: " + mapName + " does not exist" );

    }

}
