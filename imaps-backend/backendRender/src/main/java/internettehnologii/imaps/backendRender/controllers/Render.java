package internettehnologii.imaps.backendRender.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/protected")
@CrossOrigin(origins = "http://localhost:5173/")
public class Render {

    private Map<String,Object> jsonData = new HashMap<>();

    @PostMapping("/render")
    public ResponseEntity<Map<String, Object>> render(@RequestBody Map<String, Object> requestBody, HttpServletRequest request) {
        String senderUrl = request.getHeader("Sender-Url");
        String viewUrl = senderUrl.replace("Draw","View");
        Map<String,Object> response = new HashMap<>();
        response.put("status","ok");
        jsonData = requestBody;
        return ResponseEntity.ok(response);
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
