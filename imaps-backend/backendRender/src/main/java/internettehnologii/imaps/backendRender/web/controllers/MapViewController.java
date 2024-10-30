package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.MapNodeParser;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import internettehnologii.imaps.backendRender.graph.exceptions.MapParseException;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.service.interfaces.FloorService;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:5173/", allowedHeaders = {"Authorization"})
public class MapViewController {

    private String jsonMapData;
    private RouteGraph graph;

    private final MapService mapService;
    private final FloorService floorService;

    @Autowired
    public MapViewController(MapService mapService, FloorService floorService) {
        this.mapService = mapService;
        this.floorService = floorService;
    }


    @GetMapping("/maps/display")
    public ResponseEntity<List<IndoorMap>> loadPublicMaps(){
        try{
            List<IndoorMap> publicMaps = mapService.getPublicMaps();
            return ResponseEntity.ok(publicMaps);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    @GetMapping("/navigate")
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

    @GetMapping("/map-data")
    public ResponseEntity<Floor> getMapData(@RequestParam String mapName) {
        try{
            Floor floor = floorService.loadFirstAvailableFloor(mapName);
            System.out.println("LOADED FLOOR: " + floor);
            jsonMapData = floor.getMapData().getTextData();
            loadGraph(jsonMapData);
            return ResponseEntity.ok(floor);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    private void loadGraph(String mapData){
        if(mapData == null || mapData.isEmpty()) return;

        try {
            MapNodeParser parser = new MapNodeParser();
            List<MapNode> nodes = parser.parseAndCreateNodes(mapData);
            graph = new RouteGraph(nodes);
            System.out.println("======================= CREATED GRAPH =======================\n" + graph);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

}
