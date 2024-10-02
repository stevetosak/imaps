package internettehnologii.imaps.backendRender.web.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.MapNodeParser;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/protected")
@CrossOrigin(origins = "http://localhost:5173/",allowedHeaders = {"Authorization"})
public class MapRenderApi {

    private String jsonData;

    @PostMapping("/render")
    public ResponseEntity<Map<String, Object>> render(@RequestBody String requestBody) throws JsonProcessingException {
        Map<String,Object> response = new HashMap<>();
        response.put("status","ok");
        jsonData = requestBody;
        MapNodeParser parser = new MapNodeParser();
        List<MapNode> nodes = parser.parseAndCreateNodes(requestBody);
        RouteGraph graph = new RouteGraph(nodes);
        System.out.println("=======================\n" + graph.toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/mapData")
    public ResponseEntity<String> getMapData(){
        System.out.println(jsonData);
        if(!jsonData.isEmpty()){
            return ResponseEntity.ok(jsonData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
