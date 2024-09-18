package internettehnologii.imaps.backendRender.entities.map;

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

    public List<Map> getMaps(){
        return mapRepository.findAll();
    }

    public void addNewMap(Map map) {
        Optional<Map> studentOptional = mapRepository.findMapByEmail(map.getEmail());
        if(studentOptional.isPresent()){
            throw new IllegalStateException("email taken");
        }

        mapRepository.save(map);
    }

    public void deleteMap(Long mapId) {
        boolean exists = mapRepository.existsById(mapId);
        if(!exists){
            throw new IllegalStateException("Map with id: " + mapId + " does not exist");
        }
        mapRepository.deleteById(mapId);
    }

    @Transactional
    public void updateMap(Long mapId, String name, String email) {
        Map map = mapRepository.findById(mapId).orElseThrow(() -> new IllegalStateException("map with id " + mapId + " does not exist"));
        if(name != null && name.length() > 0 && !Objects.equals(map.getName(), name)){
            map.setName(name);
        }

        if(email != null && email.length() > 0 && !Objects.equals(map.getEmail(), email)){
            Optional<Map> mapOptional = mapRepository.findMapByEmail(email);
            if(mapOptional.isPresent()){
                throw new IllegalStateException("email taken");
            }

            map.setEmail(email);
        }
    }
}
