package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.*;
import internettehnologii.imaps.backendRender.web.exceptions.MapNameTakenException;
import internettehnologii.imaps.backendRender.web.exceptions.MapNotFoundException;
import internettehnologii.imaps.backendRender.web.repo.FloorRepository;
import internettehnologii.imaps.backendRender.web.repo.MapRepository;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MapServiceImpl implements MapService {
    private final MapRepository mapRepository;
    private final UserRepository userRepository;
    private final FloorRepository floorRepository;

    @Autowired
    public MapServiceImpl(MapRepository mapRepository, UserRepository userRepository, FloorRepository floorRepository) {
        this.mapRepository = mapRepository;
        this.userRepository = userRepository;
        this.floorRepository = floorRepository;
    }

    @Override
    public void createMap(String mapName,String mapType, String username) {

        Optional<IMapsUser> user = userRepository.findUserByName(username);

        if (mapRepository.existsByName(mapName))
            throw new MapNameTakenException("Map with name " + mapName + " already exists");

        if(user.isEmpty()){
            throw new UsernameNotFoundException("User " + username + " not found");
        }

        IndoorMap indoorMap = new IndoorMap();
        indoorMap.setName(mapName);
        indoorMap.setUser(user.get());

        Floor floor = new Floor();
        floor.setFloorNumber(0);
        floor.setIndoorMap(indoorMap);

        mapRepository.save(indoorMap);
        floorRepository.save(floor);

    }

    @Override
    public void updateMap(IndoorMap indoorMap) {
        mapRepository.save(indoorMap);
    }

    @Override
    public void deleteMap(IndoorMap indoorMap) {
        mapRepository.delete(indoorMap);
    }

    @Override
    public List<IndoorMap> getAllMapsForUser(String username) {
        IMapsUser user = userRepository.findUserByName(username).orElseThrow(() -> new UsernameNotFoundException(username));
        Optional<List<IndoorMap>> indoorMaps = mapRepository.findAllMapsForUser(user.getId());
        return indoorMaps.orElseGet(ArrayList::new);
    }

    @Override
    public List<IndoorMap> getPublicMaps() {
        Optional<List<IndoorMap>> maps = mapRepository.findAllByStatus(MAP_STATUS.PUBLIC);
        return maps.orElseGet(ArrayList::new);
    }

    @Override
    public IndoorMap getMapForUser(String username, String mapName) {
        IMapsUser user = userRepository.findUserByName(username).orElseThrow(() -> new UsernameNotFoundException(username));
        IndoorMap map = mapRepository.findMapByName(mapName).orElseThrow(() -> new MapNotFoundException(mapName));

        boolean isAdmin = user.getRoles().stream().anyMatch(role -> Objects.equals(role.getName(), "ADMIN"));

        if(isAdmin){
            return map;
        }

        return mapRepository.getMapForUser(user, map.getId()).orElseThrow(() -> new MapNotFoundException("No map found for user: " + username));
    }

    @Override
    public IndoorMap getPublicMapByName(String mapName) {
        return mapRepository.getIndoorMapByNameAndStatus(mapName, MAP_STATUS.PUBLIC).orElseThrow(() -> new MapNotFoundException(mapName));
    }

    @Override
    public IndoorMap getMapByName(String mapName) {
       return mapRepository.getIndoorMapByName(mapName).orElseThrow(() -> new MapNotFoundException(mapName));
    }

    @Override
    public List<IndoorMap> findByStatus(MAP_STATUS status) {
        return mapRepository.findAllByStatus(status).orElseGet(ArrayList::new);
    }


//    public List<IndoorMap> getMaps() {
//        return mapRepository.findAll();
//    }
//
//    public void addNewMap(IndoorMap map) {
//        getMapByName(map.getName())
//                .ifPresentOrElse(lMap -> {
//                    System.out.println("Map with name " + map.getName() + " already exists");
//                }, () -> mapRepository.save(map));
//    }
//
//
//    public void deleteMap(Long mapId) {
//        boolean exists = mapRepository.existsById(mapId);
//        if (!exists) {
//            throw new IllegalStateException("Map with id: " + mapId + " does not exist");
//        }
//        mapRepository.deleteById(mapId);
//
//    }
//
//    public Optional<IndoorMap> getMapById(Long id) {
//        return mapRepository.findById(id);
//    }

//    public Optional<List<IndoorMap>> findAllPublicMaps(){
//       return mapRepository.findAllByStatus(true);
//    }
//    public Optional<List<IndoorMap>> findAllPersonalMaps(){
//        return mapRepository.findAllByStatus(false);
//    }

//    public Optional<List<IndoorMap>> findAllMapsByPublicStatus(boolean publicStatus) {
//        return mapRepository.findAllByStatus(publicStatus);
//    }
//
//    // repository.save zavisit od state na object sho sakas da zacuvas. Ako napres direktno new obj, pa save, pret INSERT, a ako napres get na object od baza pa mu setnis attrib so setter pa save, pret UPDATE.
//    @Transactional
//    public void saveFloor(String mapName, String mapData,int floorNum) {
//        Optional<IndoorMap> indoorMap = mapRepository.findMapByName(mapName);
//
//        if(indoorMap.isPresent()) {
//            Optional<Floor> floor = mapRepository.getFloorForMap(indoorMap.get().getId(), floorNum);
//            if(floor.isPresent()) {
//
//            }
//        }
//
//        indoorMap.ifPresentOrElse(map -> {
//            map.setName(mapName);
//            map.setMapData(new DataJson(mapData));
//            mapRepository.save(map);
//        }, () -> {
//            System.out.println("Map with name: " + mapName + " does not exist");
//        });
//    }
//
//    public Optional<IndoorMap> getMapByName(String name) {
//        return mapRepository.findMapByName(name);
//    }
//
//    public Floor getFloorForMap(String mapName, int floorNum) {
//        Optional<IndoorMap> map = mapRepository.findMapByName(mapName);
//
//        if(map.isPresent()) {
//            Optional<Floor> floor = mapRepository.getFloorForMap(map.get().getId(), floorNum);
//            if(floor.isPresent()) {
//                return floor.get();
//            } else {
//                throw new FloorNotFoundException("Floor num: " + floorNum + "for map with name " + mapName + " does not exist")
//            }
//        } else {
//            throw new MapNotFoundException("Map with name: " + mapName + " does not exist");
//        }
//    }
//
//
//    @Transactional
//    public void updateMap(String mapName, DataJson mapData) {
//        IndoorMap map = mapRepository.findMapByName(mapName).orElseThrow(() -> new IllegalStateException("map with name " + mapName + " does not exist"));
//        if (mapName != null && !mapName.isEmpty() && !Objects.equals(map.getName(), mapName)) {
//            map.setMapData(mapData);
//        }
//    }
}
