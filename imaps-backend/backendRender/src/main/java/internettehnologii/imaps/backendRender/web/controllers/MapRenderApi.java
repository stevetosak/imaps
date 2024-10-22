package internettehnologii.imaps.backendRender.web.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.MapNodeParser;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import internettehnologii.imaps.backendRender.graph.exceptions.MapParseException;
import internettehnologii.imaps.backendRender.graph.exceptions.NodeNotFoundException;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173/", allowedHeaders = {"Authorization"})
public class MapRenderApi {

    private String jsonData;
    private RouteGraph graph;

    private final MapService mapService;

    @Autowired
    public MapRenderApi(MapService mapService) {
        this.mapService = mapService;
    }

    @PostMapping("/protected/render")
    public ResponseEntity<Map<String, Object>> render(@RequestBody String requestBody) throws Exception {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        jsonData = requestBody;
        try {
            MapNodeParser parser = new MapNodeParser();
            List<MapNode> nodes = parser.parseAndCreateNodes(requestBody);
            graph = new RouteGraph(nodes);
            System.out.println("=======================\n" + graph);
        } catch (MapParseException e) {
            response.put("status", "error: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
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

    @GetMapping("/public/mapData")
    public ResponseEntity<String> getMapData(@RequestParam String mapName) {
        Optional<IndoorMap> map = mapService.getMapByName(mapName);
        if (map.isPresent()) {
            jsonData = map.get().getMapData().getTextData();
            loadGraph(jsonData);
            return ResponseEntity.ok(jsonData);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(jsonData);
    }

    private void loadGraph(String mapData){
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
