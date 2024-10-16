package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.service.MapService;
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

    @GetMapping("/protected/maps/load")
    public ResponseEntity<Map<String,Object>> loadMap(@RequestParam String mapName) {
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

//    @PostMapping
//    public void registerNewMap(@RequestBody IndoorMap map){
//        mapService.addNewMap(map);
//    }
//
//    @DeleteMapping(path = "{mapId}")
//    public void deleteMap(@PathVariable("mapId") Long mapId){
//        mapService.deleteMap(mapId);
//    }
//
//    @PutMapping(path = "{mapId}")
//    public void updateMap(
//            @PathVariable("mapId") Long mapId,
//            @RequestParam(required = false) String name){
//
//        //mapService.updateMap(name);
//    }
}
