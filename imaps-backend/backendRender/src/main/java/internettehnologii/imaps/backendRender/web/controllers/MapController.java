package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.security.json.DataJson;
import internettehnologii.imaps.backendRender.web.service.interfaces.FloorService;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import internettehnologii.imaps.backendRender.web.util.FloorDTO;
import internettehnologii.imaps.backendRender.web.util.MapDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api")
public class MapController {
    private final MapService mapService;
    private final FloorService floorService;

    @Autowired
    public MapController(MapService mapService, FloorService floorService) {
        this.mapService = mapService;
        this.floorService = floorService;
    }

    @GetMapping("/protected/maps")
    public List<IndoorMap> getMapsForUser(@RequestParam String username) {
        return mapService.getAllMapsForUser(username);
    }

    @PutMapping("/protected/maps/save")
    public ResponseEntity<Map<String,Object>> updateMapData
            (@RequestBody String mapData, @RequestParam String mapName, @RequestParam String username, @RequestParam int floorNum) {

        Map<String,Object> response = new HashMap<>();
        try {
            IndoorMap map = mapService.getMapForUser(username,mapName);
            Floor f = floorService.getFloorByNum(floorNum, map);

            DataJson jsonMapData = new DataJson(mapData);
            f.setMapData(jsonMapData);
            floorService.updateFloor(f);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/protected/maps/create")
    public ResponseEntity<Void> createMap(@RequestBody MapDTO mapData, @RequestParam String username) {
        try{
            mapService.createMap(mapData.getName(), username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @GetMapping("/protected/maps/load")
    public ResponseEntity<Floor> loadPrivateMap(@RequestParam String mapName, @RequestParam String username, @RequestParam int floorNum) {
        try{
            IndoorMap map = mapService.getMapForUser(username,mapName);
            Floor floor = floorService.getFloorByNum(floorNum,map);
            return ResponseEntity.ok().body(floor);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/protected/myMaps/loadAllFloors")
    public ResponseEntity<List<Floor>> loadAllFloors(@RequestParam String mapName) {
        try{
            IndoorMap map = mapService.getMap(mapName);
            List<Floor> floors = floorService.getAllFloorsForMap(map);
            return ResponseEntity.ok(floors);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/protected/myMaps/addFloor")
    public ResponseEntity<Map<String,Object>> addFloor(@RequestBody FloorDTO floorDTO) {
        Map<String,Object> response = new HashMap<>();
        try{
            floorService.addFloor(floorDTO.getNum(),floorDTO.getMapName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // nezz dali sa koristit
//    @GetMapping("/public/maps/load")
//    public ResponseEntity<Map<String,Object>> loadMapPublic(@RequestParam String mapName) {
//        return getMapByName(mapName);
//    }


    @GetMapping("/public/maps/display")
    public ResponseEntity<List<IndoorMap>> loadPublicMaps(){
        try{
            List<IndoorMap> publicMaps = mapService.getPublicMaps();
            return ResponseEntity.ok(publicMaps);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/protected/myMaps/display")
    public ResponseEntity<List<IndoorMap>> loadPersonalMaps(@RequestParam String username) {
        //user specific ne samo site so se false;
        try {
            List<IndoorMap> maps = mapService.getAllMapsForUser(username);
            return ResponseEntity.ok().body(maps);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


}
