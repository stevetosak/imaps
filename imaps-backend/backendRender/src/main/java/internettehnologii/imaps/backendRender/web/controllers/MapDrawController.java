package internettehnologii.imaps.backendRender.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.util.DTO.SaveMapDTO;
import internettehnologii.imaps.backendRender.web.util.Util;
import internettehnologii.imaps.backendRender.web.util.json.JsonMapData;
import internettehnologii.imaps.backendRender.web.service.interfaces.FloorService;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import internettehnologii.imaps.backendRender.web.util.DTO.FloorDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.MapDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/protected")
public class MapDrawController {
    private final MapService mapService;
    private final FloorService floorService;


    @Autowired
    public MapDrawController(MapService mapService, FloorService floorService) {
        this.mapService = mapService;
        this.floorService = floorService;
    }

    @GetMapping("/my-maps")
    public List<IndoorMap> getMapsForUser(@RequestParam String username) {
        return mapService.getAllMapsForUser(username);
    }

    @PutMapping("/my-maps/save")
    public ResponseEntity<FloorDTO> updateMapData
            (@RequestBody SaveMapDTO mapDTO, @RequestParam String username) {

        System.out.println("MAP DTO: " + mapDTO);

        Map<String,Object> response = new HashMap<>();
        try {

            System.out.println("=================================");
            System.out.println("MAPDTO: " + mapDTO);
            System.out.println("USERNAME:" + username);
            IndoorMap map = mapService.getMapForUser(username, mapDTO.getMapName());
            Floor f = floorService.getFloorByNum(mapDTO.getFloorNum(), map);


            ObjectMapper objectMapper = new ObjectMapper();
            String roomTypesJson = objectMapper.writeValueAsString(mapDTO.getRoomTypes());
            JsonMapData jsonMapData = new JsonMapData(mapDTO.getShapes().toString(), roomTypesJson);

            System.out.println("ROOM TYPES JSON : " + roomTypesJson);
            f.setMapData(jsonMapData);
            floorService.updateFloor(f);

            System.out.println("UPDATED FLOOR " + f.getFloorNumber());

            FloorDTO floorDTO = new FloorDTO(f.getFloorNumber(), mapDTO.getMapName(),f.getMapData().getShapeData());

            return ResponseEntity.ok(floorDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/my-maps/create")
    public ResponseEntity<Map<String,Object>> createMap(@RequestBody MapDTO mapData, @RequestParam String username) {
        Map<String,Object> response = new HashMap<>();
        try{
            mapService.createMap(mapData.getName(), username);
            response.put("created",true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @GetMapping("/my-maps/load")
    public ResponseEntity<List<FloorDTO>> loadPersonalMap(@RequestParam String mapName, @RequestParam String username) {
        try{
            IndoorMap map = mapService.getMapForUser(username,mapName);
            List<Floor> floors = floorService.getAllFloorsForMap(map.getName());
            return ResponseEntity.ok().body(Util.convertToFloorDTO(floors));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/floors/load")
    public ResponseEntity<List<Floor>> loadAllFloors(@RequestParam String mapName) {
        try{
            List<Floor> floors = floorService.getAllFloorsForMap(mapName);
            return ResponseEntity.ok(floors);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    @DeleteMapping("/floors/delete")
    public ResponseEntity<Map<String,Object>> deleteFloor(@RequestParam String mapName,
                                                          @RequestParam int floorNum) {
        try{
            floorService.deleteFloor(floorNum,mapName);
            return ResponseEntity.ok().build();
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/floors/add")
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

    @GetMapping("/my-maps/display")
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

    @DeleteMapping("/my-maps/delete")
    public ResponseEntity<Map<String, Object>> deleteMap(
            @RequestParam String mapName,
            @RequestParam String username) {
        Map<String, Object> response = new HashMap<>();
        try {
            IndoorMap map = mapService.getMapForUser(username, mapName);
            mapService.deleteMap(map);
            response.put("deleted", true);
            response.put("mapName", mapName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error during map deletion: " + e.getMessage());
            e.printStackTrace();
            response.put("error", "Map not found or does not belong to the user.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }




}
