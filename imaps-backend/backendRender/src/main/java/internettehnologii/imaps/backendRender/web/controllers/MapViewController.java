package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.exceptions.EmptyMapException;
import internettehnologii.imaps.backendRender.web.exceptions.FloorNotFoundException;
import internettehnologii.imaps.backendRender.web.service.interfaces.GraphService;
import internettehnologii.imaps.backendRender.web.service.interfaces.FloorService;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import internettehnologii.imaps.backendRender.web.service.interfaces.UserService;
import internettehnologii.imaps.backendRender.web.util.DTO.FloorDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.MapDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.RoomTypeDTO;
import internettehnologii.imaps.backendRender.web.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173/", allowedHeaders = {"Authorization"})
public class MapViewController {

    private RouteGraph graph;
    private List<Floor> floors = new ArrayList<>();

    private final MapService mapService;
    private final FloorService floorService;
    private final GraphService graphService;
    private final UserService userService;

    @Autowired
    public MapViewController(MapService mapService, FloorService floorService, GraphService graphService, UserService userService) {
        this.mapService = mapService;
        this.floorService = floorService;
        this.graphService = graphService;
        this.userService = userService;
    }


    @GetMapping("/public/maps")
    public ResponseEntity<List<MapDTO>> loadPublicMaps() {
        try {
            List<IndoorMap> maps = mapService.getPublicMaps();
            List<MapDTO> mapDTOS = maps.stream()
                    .map(imap -> new MapDTO(imap.getName(),
                            imap.getMapType(),
                            imap.getCreatedAt(),
                            imap.getModifiedAt(),
                            imap.getStatus().name(),
                            imap.getFavouriteCount()))
                    .toList();
            return ResponseEntity.ok(mapDTOS);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/public/room-types")
    public ResponseEntity<List<RoomTypeDTO>> loadRoomTypesPublic(@RequestParam String mapName) {
        IndoorMap map = mapService.getPublicMapByName(mapName);

        List<RoomTypeDTO> roomTypeDTOS = map.getRoomTypes().stream().map(r -> new RoomTypeDTO(r.getName())).toList();
        return ResponseEntity.ok(roomTypeDTOS);
    }


    @GetMapping("/public/navigate")
    public ResponseEntity<List<MapNode>> navigate(@RequestParam String from, @RequestParam String to) {

        String startNode = from;
        String endNode = to;

        String roomConnectedToEntranceFrom = graph.findNodeConnectedToEntrance(from);
        String roomConnectedToEntranceTo = graph.findNodeConnectedToEntrance(to);

        if (roomConnectedToEntranceFrom != null) {
            startNode = roomConnectedToEntranceFrom;
        }
        if (roomConnectedToEntranceTo != null) {
            endNode = roomConnectedToEntranceTo;
        }

        List<MapNode> path = graph.findRoute(startNode, endNode);
        return ResponseEntity.ok(path);
    }


    @GetMapping("/public/load-map")
    public ResponseEntity<List<FloorDTO>> getMapData(@RequestParam String mapName, @RequestParam int floorNum) {
        try {
            this.floors = floorService.getAllPublicFloors(mapName);
            this.graph = graphService.construct(floors);
            return ResponseEntity.ok(Util.convertToFloorDTO(floors)); // tuka re
        } catch (EmptyMapException e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/protected/load-map")
    public ResponseEntity<List<FloorDTO>> getMapDataProtected(@RequestParam String mapName, @RequestParam String username, @RequestParam int floorNum) {
        try {
            mapService.getMapForUser(username, mapName);// namesto ova samo proverka dali postoet dadena mapa za user, za da ne morat za dzabe mapa promenliva da se cuvat
            this.floors = floorService.getAllFloorsForMap(mapName);
            this.graph = graphService.construct(floors);

            return ResponseEntity.ok(Util.convertToFloorDTO(floors)); // tuka return site floors trebit
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/protected/favourites/add")
    public ResponseEntity<Map<String,Object>> addFavourites(@RequestParam String username, @RequestParam String mapName) {
        try{
            IndoorMap map = mapService.getMapByName(mapName);
            IMapsUser user = userService.getUser(username);
            userService.addToFavorites(user, map);
            return ResponseEntity.ok(new HashMap<>());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(404).body(new HashMap<>());
        }
    }
    @DeleteMapping("/protected/favourites/delete")
    public ResponseEntity<Map<String,Object>> removeFavourites(@RequestParam String username, @RequestParam String mapName) {
        try{
            IndoorMap map = mapService.getMapByName(mapName);
            IMapsUser user = userService.getUser(username);
            userService.removeFromFavorites(user, map);
            return ResponseEntity.ok(new HashMap<>());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(404).body(new HashMap<>());
        }
    }


}
