package internettehnologii.imaps.backendRender.entities.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/map")
public class MapController {
    private final MapService mapService;

    @Autowired
    public MapController(MapService mapService){
        this.mapService = mapService;
    }

    @GetMapping
    public List<Map> getMaps(){
        return mapService.getMaps();
    }

    @PostMapping
    public void registerNewMap(@RequestBody Map map){
        mapService.addNewMap(map);

    }

    @DeleteMapping(path = "{mapId}")
    public void deleteMap(@PathVariable("mapId") Long mapId){
        mapService.deleteMap(mapId);
    }

    @PutMapping(path = "{mapId}")
    public void updateMap(
            @PathVariable("mapId") Long mapId,
            @RequestParam(required = false) String name) {
        mapService.updateMap(mapId, name);
    }
}
