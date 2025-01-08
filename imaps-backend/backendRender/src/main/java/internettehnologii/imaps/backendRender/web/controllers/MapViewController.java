package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.Report;
import internettehnologii.imaps.backendRender.web.exceptions.EmptyMapException;
import internettehnologii.imaps.backendRender.web.service.interfaces.*;
import internettehnologii.imaps.backendRender.web.util.DTO.FloorDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.MapDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.ReportDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.RoomTypeDTO;
import internettehnologii.imaps.backendRender.web.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:5173/", allowedHeaders = {"Authorization"})
public class MapViewController {

    private RouteGraph graph;

    private final MapService mapService;
    private final FloorService floorService;
    private final GraphService graphService;
    private final UserService userService;
    private final ReportService reportService;

    @Autowired
    public MapViewController(MapService mapService, FloorService floorService, GraphService graphService, UserService userService, ReportService reportService) {
        this.mapService = mapService;
        this.floorService = floorService;
        this.graphService = graphService;
        this.userService = userService;
        this.reportService = reportService;
    }


    @GetMapping("/public/maps")
    public ResponseEntity<List<MapDTO>> loadPublicMaps() {
        try {
            List<IndoorMap> maps = mapService.getPublicMaps();
            List<MapDTO> mapDTOS = Util.convertToMapDTO(maps);
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
    public ResponseEntity<List<FloorDTO>> getMapData(@RequestParam String mapName) {
        try {
            IndoorMap map = mapService.getPublicMapByName(mapName);
            List<Floor> floors  = floorService.getAllFloorsForMap(mapName);
            this.graph = graphService.construct(floors);
            return ResponseEntity.ok(Util.convertToFloorDTO(map.getFloors())); // tuka re
        } catch (EmptyMapException e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/protected/load-map")
    public ResponseEntity<List<FloorDTO>> getMapDataProtected(@RequestParam String mapName, @RequestParam String username) {
        try {
            IndoorMap map = mapService.getMapForUser(username, mapName);// namesto ova samo proverka dali postoet dadena mapa za user, za da ne morat za dzabe mapa promenliva da se cuvat
            List<Floor> floors  = floorService.getAllFloorsForMap(mapName);
            this.graph = graphService.construct(floors);

            return ResponseEntity.ok(Util.convertToFloorDTO(map.getFloors())); // tuka return site floors trebit
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
            userService.addFavoriteMap(user, map);
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
            userService.removeFavoriteMap(user, map);
            return ResponseEntity.ok(new HashMap<>());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(404).body(new HashMap<>());
        }
    }
    @PostMapping("/protected/reports/create")
    public ResponseEntity<Map<String, Object>> createReport(
            @RequestBody ReportDTO reportBody) {
        try {
            IMapsUser user = userService.getUser(reportBody.getUsername());

            IndoorMap map = mapService.getMapByName(reportBody.getMapName());

            Report report = new Report(user, map, reportBody.getSubject(), reportBody.getContent());
            reportService.saveReport(report);

            Map<String, Object> response = new HashMap<>();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body(new HashMap<>());
        }
    }

}
