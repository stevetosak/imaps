package internettehnologii.imaps.backendRender.graph;

import java.util.*;

public class RouteGraph {
    private final Map<MapNode, Set<Edge>> graph = new HashMap<>();
    private final Map<String, MapNode> nameToNodeMap = new HashMap<>();


    public void load(List<MapNode> nodes){
        for (MapNode node : nodes) {
            nameToNodeMap.put(node.getName(), node);
        }


        System.out.println("NAME NODE MAP:");
        for(Map.Entry<String,MapNode> entries : nameToNodeMap.entrySet()) {
            System.out.println(entries.getKey() + " " + entries.getValue());
        }

        for (MapNode mapNode : nodes) {
            for (String connectionName : mapNode.getConnectionNames()) {
                System.out.println("CONN: " + mapNode.getName() + " " + connectionName);
                MapNode connectedNode = nameToNodeMap.get(connectionName);
                if (connectedNode != null) {
                    addEdge(mapNode, connectedNode);
                }else {
                    System.out.println("CANT ADD EDGE+========== " + mapNode.getName());
                }
            }
        }
    }


    private double getDistanceBetweenPoints(MapNode a, MapNode b){
        double x1 = a.getCoordinates().x;
        double y1 = a.getCoordinates().y;

        double x2 = b.getCoordinates().x;
        double y2 = b.getCoordinates().y;


        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    }

    public List<MapNode> findRoute(String source, String target){
        MapNode sourceNode = nameToNodeMap.get(source);
        MapNode targetNode = nameToNodeMap.get(target);


        if (sourceNode == null || targetNode == null) {
            System.out.println(this.toString());
            System.out.println("SOURCE NODE FROM MAP " + sourceNode);
            System.out.println("TARGET NODE FROM MAP " + targetNode);
            throw new IllegalArgumentException("Source or target node not found. SOURCE: " + source + " TARGET: " + target);
        }


        PriorityQueue<Edge> queue = new PriorityQueue<>(Comparator.comparingDouble(Edge::getWeight));
        queue.add(new Edge(sourceNode,0));

        Map<MapNode,Double> dist = new HashMap<>();
        Map<MapNode,MapNode> parent = new HashMap<>();
        Set<MapNode> visited = new HashSet<>();

        for(MapNode mapNode : graph.keySet()){
            dist.put(mapNode,Double.MAX_VALUE);
        }
        dist.put(sourceNode, 0.0);


        while(!queue.isEmpty()){
            Edge currentEdge = queue.poll();
            MapNode currentNode = currentEdge.getNode();

            if(visited.contains(currentNode)){
                continue;
            }

            if (currentNode.equals(targetNode)) {
                return getPath(sourceNode, targetNode, parent);
            }

            visited.add(currentNode);

            for(Edge neighbor : graph.get(currentNode)){
                double newDist = dist.get(currentNode) + neighbor.getWeight();
                if(newDist < dist.get(neighbor.getNode())){
                    dist.put(neighbor.getNode(), newDist);
                    parent.put(neighbor.getNode(),currentNode);
                    queue.add(new Edge(neighbor.getNode(),newDist));
                }
            }

        }

        System.out.println("No path found from: " + source + " to " + target);
        return new ArrayList<>();

    }

    private List<MapNode> getPath(MapNode sourceNode, MapNode targetNode, Map<MapNode, MapNode> parent) {
        List<MapNode> path = new ArrayList<>();
        for (MapNode at = targetNode; at != null; at = parent.get(at)) {
            path.add(at);
        }

        Collections.reverse(path);// deka se staveni vo obraten redosled, pa reverse ni dava pateka od pocetok do kraj.

        if (!path.isEmpty() && path.get(0).equals(sourceNode)) {
            System.out.println("FOUND PATH: " + path);
            return path;
        } else {
            System.out.println("err");
            return new ArrayList<>();
        }
    }

    public void addEdge(MapNode from, MapNode to) {

        if (!graph.containsKey(from)) {
            graph.put(from, new HashSet<>());
        }

        if (!graph.containsKey(to)) {
            graph.put(to, new HashSet<>());
        }

        double distance = getDistanceBetweenPoints(from, to);
        graph.get(from).add(new Edge(to,distance));
        graph.get(to).add(new Edge(from,distance));

    }


    public String findNodeConnectedToEntrance(String roomName){
        for(MapNode node : graph.keySet()){
            if(node.getConnectedRoom().equals(roomName)){
                return node.getName();
            }
        }
        return null;
        //throw new IllegalArgumentException("Cant find room connected to entrance: " + roomName);
    }


    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("RouteGraph: \n");

        for (Map.Entry<MapNode, Set<Edge>> entry : graph.entrySet()) {
            MapNode node = entry.getKey();
            Set<Edge> connectedNodes = entry.getValue();

            System.out.println("CONN NODES PRINT: " + connectedNodes);

            sb.append(node.getName()).append(" -> ");

            if (connectedNodes.isEmpty()) {
                sb.append("No connections");
            } else {
                sb.append("[");
                for (Edge connectedNode : connectedNodes) {
                    sb.append(connectedNode.getNode().getName()).append(", ");
                }
                sb.setLength(sb.length() - 2);
                sb.append("]");
            }

            sb.append("\n");
        }

        return sb.toString();
    }



}
