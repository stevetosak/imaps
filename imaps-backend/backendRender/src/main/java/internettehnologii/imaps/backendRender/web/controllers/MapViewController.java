package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.exceptions.EmptyMapException;
import internettehnologii.imaps.backendRender.web.exceptions.FloorNotFoundException;
import internettehnologii.imaps.backendRender.web.service.interfaces.GraphService;
import internettehnologii.imaps.backendRender.web.service.interfaces.FloorService;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import internettehnologii.imaps.backendRender.web.util.DTO.FloorDTO;
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

    @Autowired
    public MapViewController(MapService mapService, FloorService floorService, GraphService graphService) {
        this.mapService = mapService;
        this.floorService = floorService;
        this.graphService = graphService;
    }


    @GetMapping("/public/maps/display")
    public ResponseEntity<List<IndoorMap>> loadPublicMaps() {
        try {
            List<IndoorMap> publicMaps = mapService.getPublicMaps();
            return ResponseEntity.ok(publicMaps);
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


    @GetMapping("/public/load-floor")
    public ResponseEntity<Floor> loadFloor(@RequestParam int floorNum) {
        try {
            Floor floor = getFloorByNum(floorNum);
            return ResponseEntity.ok(floor);
        } catch (FloorNotFoundException e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/public/floors/get")
    public ResponseEntity<List<Floor>> getFloors() {
        return ResponseEntity.ok(floors);
    }

    
    private Floor getFloorByNum(int num) {
        for (Floor floor : floors) {
            if (floor.getFloorNumber() == num) {
                return floor;
            }
        }
        throw new FloorNotFoundException("Floor: " + num + " not found.\n:");
    }


}
