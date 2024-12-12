package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.entities.MAP_STATUS;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import internettehnologii.imaps.backendRender.web.service.interfaces.PublishRequestService;
import internettehnologii.imaps.backendRender.web.util.DTO.MapDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.PublishMapDTO;
import internettehnologii.imaps.backendRender.web.util.Util;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/admin")
public class AdminController {
    private final MapService mapService;
    private final PublishRequestService publishRequestService;

    public AdminController(MapService mapService, PublishRequestService publishRequestService) {
        this.mapService = mapService;
        this.publishRequestService = publishRequestService;
    }

    @GetMapping
    public ResponseEntity<List<MapDTO>> getPendingMapRequests() {
        try {
            List<MapDTO> maps = Util.convertToMapDTO(mapService.findByStatus(MAP_STATUS.INVALID));
            return ResponseEntity.ok(maps);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/load-pr")
    public ResponseEntity<List<PublishMapDTO>> getPublishedMapRequests() {
        try {
            List<PublishMapDTO> pmdto = publishRequestService.getAllPublishRequests()
                    .stream()
                    .map(pr -> new PublishMapDTO(
                            pr.getId(),
                            pr.getName(),
                            pr.getLastName(),
                            pr.getMap().getName(),
                            pr.getMapType(),
                            pr.getGMapsUrl()
                            ))
                    .toList();
            return ResponseEntity.ok(pmdto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/pr/approve")
    public ResponseEntity<Map<String,Object>> approvePR(@RequestParam("id") Integer id) {
        try{
            publishRequestService.approvePublishRequest(id);
        } catch (Exception e){
            e.printStackTrace();
        }
        return ResponseEntity.ok(new HashMap<>());
    }
    @PostMapping("/pr/deny")
    public ResponseEntity<Map<String,Object>> denyPR(@RequestParam("id") Integer id) {
        try{
            publishRequestService.denyPublishRequest(id);
        } catch (Exception e){
            e.printStackTrace();
        }
        return ResponseEntity.ok(new HashMap<>());
    }
}
