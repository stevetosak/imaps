package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.MapNodeParser;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import internettehnologii.imaps.backendRender.web.service.interfaces.GraphService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GraphServiceImpl implements GraphService {
    @Override
    public RouteGraph construct(List<Floor> floors) {
        RouteGraph graph = new RouteGraph();
        MapNodeParser parser = new MapNodeParser();

        floors.forEach(floor -> {
            try {
                List<MapNode> nodes = parser.parseAndCreate(floor.getMapData().getShapeData());
                graph.loadNodeNames(nodes);
            } catch (Exception e) {
                System.out.println("Nodes for floor " + floor.getFloorNumber() + " could not be parsed. " + e.getMessage());
                e.printStackTrace();
            }
        });

        graph.loadEdges();

        return graph;
    }
}
