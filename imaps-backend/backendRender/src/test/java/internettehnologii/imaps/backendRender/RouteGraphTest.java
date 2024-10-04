package internettehnologii.imaps.backendRender;

import internettehnologii.imaps.backendRender.graph.Coordinates;
import internettehnologii.imaps.backendRender.graph.MapNode;
import internettehnologii.imaps.backendRender.graph.RouteGraph;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.util.*;
import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

class RouteGraphTest {

    private RouteGraph routeGraph;

    @BeforeEach
    void setUp() {
        MapNode nodeA = new MapNode("A", new Coordinates<>(0.0, 0.0), Arrays.asList("B"));
        MapNode nodeB = new MapNode("B", new Coordinates<>(5.0, 7.0), Arrays.asList("A","C","D"));
        MapNode nodeC = new MapNode("C", new Coordinates<>(9.0, 7.0), Arrays.asList("B","D"));
        MapNode nodeD = new MapNode("D", new Coordinates<>(9.0, 12.0), Arrays.asList("B","C"));

        List<MapNode> nodes = Arrays.asList(nodeA, nodeB, nodeC,nodeD);
        routeGraph = new RouteGraph(nodes);
    }

    @Test
    void testFindRouteBetweenConnectedNodes() {
        List<MapNode> path = routeGraph.findRoute("D", "A");
        for (MapNode node : path) {
            System.out.print(
                    node.getName() + " ---> "
            );
        }
        assertThat(path).isNotEmpty();
        //assertThat(path).extracting(MapNode::getName).containsExactly("A", "B", "C");
    }
}
