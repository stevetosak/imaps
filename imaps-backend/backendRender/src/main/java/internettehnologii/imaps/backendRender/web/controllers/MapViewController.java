package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.MapNodeParser;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import internettehnologii.imaps.backendRender.graph.exceptions.InvalidMapDataException;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.exceptions.EmptyMapException;
import internettehnologii.imaps.backendRender.web.exceptions.FloorNotFoundException;
import internettehnologii.imaps.backendRender.web.security.json.JsonMapData;
import internettehnologii.imaps.backendRender.web.service.interfaces.FloorService;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import internettehnologii.imaps.backendRender.web.util.FloorDTO;
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

    private String currentFloorJsonData;
    private RouteGraph graph;
    private List<Floor> floors = new ArrayList<>();
    private Floor currentFloor = new Floor();
    private boolean loaded = false;

    private final MapService mapService;
    private final FloorService floorService;

    @Autowired
    public MapViewController(MapService mapService, FloorService floorService) {
        this.mapService = mapService;
        this.floorService = floorService;
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

    @GetMapping("/public/map-data")
    public ResponseEntity<Floor> getMapData(@RequestParam String mapName, @RequestParam int floorNum) {
        try {
            this.floors = floorService.getAllPublicFloors(mapName);
            this.currentFloor = getFloorByNum(floorNum);
            this.loadGraph(currentFloor.getMapData().getJsonData());
            return ResponseEntity.ok(currentFloor);
        } catch (EmptyMapException e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/protected/load-map")
    public ResponseEntity<List<FloorDTO>> getMapDataProtected(@RequestParam String mapName, @RequestParam String username, @RequestParam int floorNum) {
        try {
            IndoorMap map = mapService.getMapForUser(username, mapName); // namesto ova samo proverka dali postoet dadena mapa za user, za da ne morat za dzabe mapa promenliva da se cuvat
            this.floors = floorService.getAllFloorsForMap(mapName);
            this.currentFloor = getFloorByNum(floorNum);
            JsonMapData mapData = currentFloor.getMapData();
            if (mapData != null) {
                this.loadGraph(currentFloor.getMapData().getJsonData());
                System.out.println("============================================== graph loaded ==============================================");
            } else {
                System.out.println("============================================== CANT LOAD GRAPH: MAP DATA NULL ==============================================");
            }

            System.out.println("Current floor: " + currentFloor);
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
            currentFloor = floor;
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

    @GetMapping("public/")

    private Floor getFloorByNum(int num) {
        for (Floor floor : floors) {
            if (floor.getFloorNumber() == num) {
                return floor;
            }
        }
        throw new FloorNotFoundException("Floor: " + num + " not found.\n:");
    }

    private void loadGraph(String mapData) {
        if (mapData == null || mapData.isEmpty()){
            throw new InvalidMapDataException("Invalid map data(null or empty string)");
        }

        try {
            MapNodeParser parser = new MapNodeParser();
            List<MapNode> nodes = parser.parseAndCreateNodes(mapData);
            graph = new RouteGraph();
            graph.load(nodes); // tuka vo for ke trevbit parse pa load
            System.out.println("======================= CREATED GRAPH =======================\n" + graph);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
    }

}
