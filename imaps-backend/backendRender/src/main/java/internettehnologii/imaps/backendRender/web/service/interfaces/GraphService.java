package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.graph.RouteGraph;
import internettehnologii.imaps.backendRender.web.entities.Floor;
import org.springframework.stereotype.Service;

import java.util.List;

public interface GraphService {
    RouteGraph construct(List<Floor> floors);
}
