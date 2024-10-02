package internettehnologii.imaps.backendRender.web.service;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.repo.MapRepository;
import internettehnologii.imaps.backendRender.web.security.json.DataJson;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MapService {
    private final MapRepository mapRepository;

    @Autowired
    public MapService(MapRepository mapRepository){
        this.mapRepository = mapRepository;
    }

    public List<IndoorMap> getMaps(){
        return mapRepository.findAll();
    }

    public void addNewMap(IndoorMap map) {
        mapRepository.save(map);
    }


    public void deleteMap(Long mapId) {
        boolean exists = mapRepository.existsById(mapId);
        if(!exists){
            throw new IllegalStateException("Map with id: " + mapId + " does not exist");
        }
        mapRepository.deleteById(mapId);

    }

    public Optional<IndoorMap> getMapById(Long id){
        return mapRepository.findById(id);
    }


    @Transactional
    public void updateMap(String mapName, DataJson mapData) {
        IndoorMap map = mapRepository.findMapByName(mapName).orElseThrow(() -> new IllegalStateException("map with name " + mapName + " does not exist"));
        if(mapName != null && !mapName.isEmpty() && !Objects.equals(map.getName(), mapName)){
            map.setMapData(mapData);
        }
    }
}
