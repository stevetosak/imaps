package internettehnologii.imaps.backendRender.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.PublishRequest;
import internettehnologii.imaps.backendRender.web.service.interfaces.*;
import internettehnologii.imaps.backendRender.web.util.DTO.*;
import internettehnologii.imaps.backendRender.web.util.Util;
import internettehnologii.imaps.backendRender.web.util.json.JsonMapData;
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
    private final UserService userService;
    private final PublishRequestService publishRequestService;


    @Autowired
    public MapDrawController(MapService mapService, FloorService floorService, RoomTypeService roomTypeService, UserService userService, PublishRequestService publishRequestService) {
        this.mapService = mapService;
        this.floorService = floorService;
        this.roomTypeService = roomTypeService;
        this.userService = userService;
        this.publishRequestService = publishRequestService;
    }

    @GetMapping("/my-maps")
    public ResponseEntity<List<MapDTO>> getMapsForUser(@RequestParam String username) {
        try {
            List<IndoorMap> maps = mapService.getAllMapsForUser(username);
            List<MapDTO> mapDTOS = Util.convertToMapDTO(maps);
            return ResponseEntity.ok().body(mapDTOS);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/publish/add")
    public ResponseEntity<MapDTO> sendPublishRequest(@RequestBody PublishMapDTO formData, @RequestParam String username) {

        System.out.println("FORM DATA: -------------------------------------------- " + formData);
        try{
            IMapsUser user = userService.getUser(username);

            MapDTO updatedMap = publishRequestService.addPublishRequest(formData,user);

            return ResponseEntity.ok(updatedMap);

        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    @GetMapping("/publish/get")
    public ResponseEntity<PublishMapDTO> getPublishRequestForMap(@RequestParam String mapName) {
        PublishRequest pr = publishRequestService.getPublishRequestByMapName(mapName);
        PublishMapDTO dto = new PublishMapDTO(pr.getId(),pr.getName(), pr.getLastName(), pr.getMap().getName(), pr.getMapType(), pr.getGMapsUrl());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/favourites")
    public ResponseEntity<List<MapDTO>> getFavouriteMapsForUser(@RequestParam String username) {

        try{
            IMapsUser user = userService.getUser(username);
            List<MapDTO> mapDTOS = Util.convertToMapDTO(user.getFavoriteMaps());
            return ResponseEntity.ok().body(mapDTOS);

        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/my-maps/save")
    public ResponseEntity<FloorDTO> updateMapData
            (@RequestBody SaveMapDTO saveMapDTO, @RequestParam String username) {

        System.out.println("MAP DTO: " + saveMapDTO);

        try {

            System.out.println("=================================");
            System.out.println("MAPDTO: " + saveMapDTO);
            System.out.println("USERNAME:" + username);
            IndoorMap map = mapService.getMapForUser(username, saveMapDTO.getMapName());
            Floor f = floorService.getFloorByNum(saveMapDTO.getFloorNum(), map);


            ObjectMapper objectMapper = new ObjectMapper();
            String roomTypesJson = objectMapper.writeValueAsString(saveMapDTO.getRoomTypes());
            JsonMapData jsonMapData = new JsonMapData(saveMapDTO.getShapes().toString(), roomTypesJson);

            System.out.println("ROOM TYPES JSON : " + roomTypesJson);
            f.setMapData(jsonMapData);
            floorService.updateFloor(f);

            map.setModifiedAt(LocalDateTime.now());

            System.out.println("UPDATED FLOOR " + f.getFloorNumber());

            FloorDTO floorDTO = new FloorDTO(f.getFloorNumber(), saveMapDTO.getMapName(),f.getMapData().getShapeData());

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
            MapDTO mapDTO = new MapDTO(map.getName(),
                    map.getMapType(),
                    map.getCreatedAt(),
                    map.getModifiedAt(),
                    map.getStatus().name(),
                    map.getFavouriteCount(),
                    map.getGmapsUrl());
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
            List<Floor> floors = map.getFloors();
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
