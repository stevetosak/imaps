package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.service.MapService;
import internettehnologii.imaps.backendRender.web.util.CreateMapDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api")
public class MapController {
    private final MapService mapService;

    @Autowired
    public MapController(MapService mapService){
        this.mapService = mapService;
    }

    @GetMapping("/protected/maps")
    public List<IndoorMap> getMaps(){
        return mapService.getMaps();
    }

    @PutMapping("/protected/maps/save")
    public ResponseEntity<Map<String,Object>> saveMap(@RequestBody String mapData, @RequestParam String mapName) {
        HashMap<String,Object> response = new HashMap<>();
        try {
            mapService.saveMap(mapName, mapData);
            response.put("status","ok");
            Optional<IndoorMap> map = mapService.getMapByName(mapName);
            if(map.isPresent()){
                response.put("map",map.get());
            } else {
                response.put("map","rip");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PutMapping("/protected/maps/create")
    public ResponseEntity<Map<String,Object>> createMap(@RequestBody CreateMapDTO mapData) {
        HashMap<String,Object> response = new HashMap<>();
        IndoorMap indoorMap = new IndoorMap();
        System.out.println("MAP NAME TO ADD: " + mapData.getName());
        indoorMap.setName(mapData.getName());
        indoorMap.setPublic(false);
        mapService.addNewMap(indoorMap);
        response.put("status","ok");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/protected/maps/load")
    public ResponseEntity<Map<String,Object>> loadMapProtected(@RequestParam String mapName) {
        return getMapByName(mapName);
    }

    @GetMapping("/public/maps/load")
    public ResponseEntity<Map<String,Object>> loadMapPublic(@RequestParam String mapName) {
        return getMapByName(mapName);
    }


    @GetMapping("/public/maps/loadPublic")
    public ResponseEntity<Map<String,Object>> loadPublicMaps(){
        return getAllMaps(true);
    }

    @GetMapping("/protected/maps/loadPersonal")
    public ResponseEntity<Map<String,Object>> loadPersonalMaps(){
        //user specific ne samo site so se false;
        return getAllMaps(false);
    }

    private List<IndoorMap> getAllPersonalMapsForUser(String username){
        return null;
    }

    private ResponseEntity<Map<String, Object>> getAllMaps(boolean status) {
        HashMap<String,Object> response = new HashMap<>();

        mapService.findAllMapsByPublicStatus(status)
                .ifPresentOrElse(maps -> {
                    response.put("status","ok");
                    response.put("maps",maps);
                },() -> response.put("status","error: public maps not found"));


        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, Object>> getMapByName(@RequestParam String mapName) {
        HashMap<String,Object> response = new HashMap<>();
        Optional<IndoorMap> map = mapService.getMapByName(mapName);
        if (map.isPresent()) {
            response.put("status","ok");
            response.put("map",map.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("status","error: map " + mapName + " not found");
        }
        return ResponseEntity.ok(response);
    }
}
