package internettehnologii.imaps.backendRender.graph;

import java.util.*;

public class RouteGraph {
    private final Map<MapNode, Set<MapNode>> edges = new HashMap<>();
    Map<String, MapNode> nameToNodeMap = new HashMap<>();

    public RouteGraph(List<MapNode> nodes) {


        for (MapNode node : nodes) {
            nameToNodeMap.put(node.getName(), node);
        }

        for (MapNode mapNode : nodes) {
            for (String connectionName : mapNode.getConnectionNames()) {
                MapNode connectedNode = nameToNodeMap.get(connectionName);
                if (connectedNode != null) {
                    addEdge(mapNode, connectedNode);
                }
            }
        }
    }

    public List<MapNode> getPath(String from, String to){
        MapNode fromNode = nameToNodeMap.get(from);
        MapNode toNode = nameToNodeMap.get(to);

        //TODO

        return new ArrayList<>();

    }

    public void addEdge(MapNode from, MapNode to) {
        if (edges.containsKey(from)) {
            edges.get(from).add(to);
        } else {
            edges.put(from, new HashSet<>());
            edges.get(from).add(to);
        }

        if (edges.containsKey(to)) {
            edges.get(to).add(from);
        } else {
            edges.put(to, new HashSet<>());
            edges.get(to).add(from);
        }

    }

    public double getWeight(MapNode from, MapNode to) {
        return 0;
    }


    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("RouteGraph: \n");

        for (Map.Entry<MapNode, Set<MapNode>> entry : edges.entrySet()) {
            MapNode node = entry.getKey();
            Set<MapNode> connectedNodes = entry.getValue();

            sb.append(node.getName()).append(" -> ");

            if (connectedNodes.isEmpty()) {
                sb.append("No connections");
            } else {
                sb.append("[");
                for (MapNode connectedNode : connectedNodes) {
                    sb.append(connectedNode.getName()).append(", ");
                }
                sb.setLength(sb.length() - 2);
                sb.append("]");
            }

            sb.append("\n");
        }

        return sb.toString();
    }



}
