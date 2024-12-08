package internettehnologii.imaps.backendRender.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.service.interfaces.RoomTypeService;
import internettehnologii.imaps.backendRender.web.util.DTO.*;
import internettehnologii.imaps.backendRender.web.util.Util;
import internettehnologii.imaps.backendRender.web.util.json.JsonMapData;
import internettehnologii.imaps.backendRender.web.service.interfaces.FloorService;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/protected")
public class MapDrawController {
    private final MapService mapService;
    private final FloorService floorService;
    private final RoomTypeService roomTypeService;


    @Autowired
    public MapDrawController(MapService mapService, FloorService floorService, RoomTypeService roomTypeService) {
        this.mapService = mapService;
        this.floorService = floorService;
        this.roomTypeService = roomTypeService;
    }

    @GetMapping("/my-maps")
    public ResponseEntity<List<MapDTO>> getMapsForUser(@RequestParam String username) {
        try {
            List<IndoorMap> maps = mapService.getAllMapsForUser(username);
            List<MapDTO> mapDTOS = maps.stream()
                    .map(imap -> new MapDTO(imap.getName(),
                            imap.getMapType(),
                            imap.getCreatedAt(),
                            imap.getModifiedAt(),
                            imap.getStatus().name()))
                    .toList();

            return ResponseEntity.ok().body(mapDTOS);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/my-maps/save")
    public ResponseEntity<FloorDTO> updateMapData
            (@RequestBody SaveMapDTO mapDTO, @RequestParam String username) {

        System.out.println("MAP DTO: " + mapDTO);

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

            map.setModifiedAt(LocalDateTime.now());

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
    public ResponseEntity<MapDTO> createMap(@RequestBody CreateMapDTO mapData, @RequestParam String username) {
        try{
            mapService.createMap(mapData.getName(), mapData.getMapType() , username);
            IndoorMap map = mapService.getMapForUser(username,mapData.getName());
            MapDTO mapDTO = new MapDTO(map.getName(),map.getMapType(),map.getCreatedAt(),map.getModifiedAt(),map.getStatus().name());
            return ResponseEntity.ok(mapDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
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

    @PostMapping("/room-types/add")
    public ResponseEntity<Map<String,Object>> addRoomType(@RequestParam String roomTypeName,
                                                          @RequestParam String username,
                                                          @RequestParam String mapName) {
        try {
            IndoorMap map = mapService.getMapForUser(username,mapName);
            roomTypeService.addRoomType(roomTypeName,map);
            return ResponseEntity.ok(new HashMap<>());

        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/room-types")
    public ResponseEntity<List<RoomTypeDTO>> getRoomTypesForMap(@RequestParam String mapName, @RequestParam String username) {

        IndoorMap map = mapService.getMapForUser(username,mapName);

        List<RoomTypeDTO> roomTypeDTOS = map.getRoomTypes().stream().map(r -> new RoomTypeDTO(r.getName())).toList();
        return ResponseEntity.ok(roomTypeDTOS);
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
            return ResponseEntity.ok(new HashMap<>());
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
