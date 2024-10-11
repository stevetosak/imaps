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
@CrossOrigin(origins = "http://localhost:5173/",allowedHeaders = {"Authorization"})
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
        Map<String,Object> response = new HashMap<>();
        response.put("status","ok");
        jsonData = requestBody;
        try{
            MapNodeParser parser = new MapNodeParser();
            List<MapNode> nodes = parser.parseAndCreateNodes(requestBody);
            graph = new RouteGraph(nodes);
            System.out.println("=======================\n" + graph);
        } catch (MapParseException e){
            response.put("status","error: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }


    @GetMapping("/public/navigate")
    public ResponseEntity<List<MapNode>> navigate(@RequestParam String from, @RequestParam String to){

        String entranceFrom = graph.findNodeConnectedToEntrance(from);
        String entranceTo = graph.findNodeConnectedToEntrance(to);
        if(entranceFrom == null){
            throw new NodeNotFoundException("Could not find entrance related to room: " + from);
        }
        if(entranceTo == null){
            throw new NodeNotFoundException("Could not find entrance related to room: " + to);
        }
        List<MapNode> path = graph.findRoute(entranceFrom, entranceTo);
        return ResponseEntity.ok(path);
    }

    @GetMapping("/public/mapData")
    public ResponseEntity<String> getMapData(){
        //tuka povik do baza
        System.out.println(jsonData);
        if(jsonData != null && !jsonData.isEmpty()){
            return ResponseEntity.ok(jsonData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
