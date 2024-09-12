package internettehnologii.imaps.backendRender.controllers;

import com.google.gson.Gson;
import internettehnologii.imaps.backendRender.services.PostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.View;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173/")
public class Root {
    private final PostService postService;

    private Map<String,Object> jsonData = new HashMap<>();

    public Root(PostService postService) {
        this.postService = postService;
    }
    @PostMapping("/render")
    public ResponseEntity<Map<String, Object>> render(@RequestBody Map<String, Object> requestBody, HttpServletRequest request) {
        String senderUrl = request.getHeader("Sender-Url");
        String viewUrl = senderUrl.replace("Draw","View");
        Map<String,Object> response = new HashMap<>();
        response.put("status","ok");
        jsonData = requestBody;
        return ResponseEntity.ok(response);
    }

    public Mono<String> sendPost(Map<String,Object> body,String url){
        Gson gson = new Gson();
        return postService.sendPostRequest(gson.toJson(body),url);
    }

    @GetMapping("/mapData")
    public ResponseEntity<Map<String,Object>> getMapData(){
        if(!jsonData.isEmpty()){
            return ResponseEntity.ok(jsonData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
