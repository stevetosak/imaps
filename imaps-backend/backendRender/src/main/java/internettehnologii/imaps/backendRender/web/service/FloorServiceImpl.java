package internettehnologii.imaps.backendRender.web.service;

import internettehnologii.imaps.backendRender.web.exeptions.EmptyMapException;
import internettehnologii.imaps.backendRender.web.exeptions.FloorAlreadyExistsException;
import internettehnologii.imaps.backendRender.web.exeptions.InvalidParametersException;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.exeptions.MapNotFoundException;
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
    public void deleteFloor(Floor floor) {
        floorRepository.delete(floor);
    }

    @Override
    public List<Floor> getAllFloorsForMap(IndoorMap indoorMap) {
        return floorRepository.getAllFloorsForMapById(indoorMap.getId()).orElseGet(ArrayList::new);
    }

    @Override
    public Floor getFloorByNum(Integer floorNum, IndoorMap indoorMap) throws InvalidParametersException {
        return floorRepository.findFloorByFloorNumber(floorNum, indoorMap).orElseThrow(
                () -> new InvalidParametersException("Could not find floor.\n floorNum: " + floorNum + "\n indoorMap: " + indoorMap)
        );
    }

    @Override
    public Floor loadFirstAvailableFloor(String mapName) throws EmptyMapException {

        Optional<IndoorMap> map = mapRepository.findMapByName(mapName);

        if(map.isPresent()) {
            Optional<List<Floor>> floors = floorRepository.getAllPublicFloorsForMap(map.get());
            System.out.println("FLOORS REPO: " + floors);
            if(floors.isPresent()){
                for(Floor floor : floors.get()){
                    System.out.println("Iterating floors: " + floor);
                    if(floor.getFloorNumber() == 0){
                        return floor;
                    }
                }
                return floors.get().get(0); // bravo java
            }
            throw new EmptyMapException("Map: " + mapName + " has no floors saved" );
        }

        throw new MapNotFoundException("Map: " + mapName + " does not exist" );

    }

    @Override
    public List<Floor> getAllPublicFloors(IndoorMap indoorMap) throws EmptyMapException {
        return floorRepository.getAllPublicFloorsForMap(indoorMap).orElseThrow(
                () ->  new EmptyMapException("Map: " + indoorMap.getName() + " has no public floors"));
    }

    @Override
    public void save(int floorNum, IndoorMap map) {
        
    }
}
