package internettehnologii.imaps.backendRender.graph;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.graph.exceptions.MapParseException;

import java.util.*;

public class MapNodeParser {
    public List<MapNode> parseAndCreate(String mapJson) throws Exception {
        final List<MapNode> mapNodes = new ArrayList<>();

        //System.out.println("======= MAP JSON ====== " + mapJson);

        if(mapJson == null || mapJson.isEmpty() || mapJson.equals("[]")) {
            throw new MapParseException("Cannot parse empty map");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Shape> shapes = objectMapper.readValue(mapJson, objectMapper.getTypeFactory().constructCollectionType(List.class, Shape.class));

        shapes.forEach(shape -> {
            System.out.println(shape.toString() + " -----------sgap");
            try {
                String type = shape.getClassName();

                // Wall i room ne se bitni za navigacija
                if (Objects.equals(type, "Wall") || Objects.equals(type, "Room")) return;

                MapNode mapNode = createMapNode(shape);

                @SuppressWarnings("unchecked")
                List<String> connectedPins = (List<String>) shape.getAttrs().get("connected_pins");


                if (connectedPins != null) {
                    for (String pin : connectedPins) {
                        System.out.println("Connected node (markup) : " + pin + " to: " + shape.getAttrs().get("obj_name"));
                        mapNode.addConnectionName(pin);
                    }

                }

                mapNodes.add(mapNode);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

        mapNodes.forEach(node -> System.out.println("Added node: ----> " + node.toString()));

        return mapNodes;

    }



    private static MapNode createMapNode(Shape shape) {
        String name = (String) shape.getAttrs().get("obj_name");
        String description = (String) shape.getAttrs().get("description");
        String connectedRoom = (String) shape.getAttrs().get("connected_room");
        double x = Double.parseDouble(Objects.requireNonNull(shape.getAttrs().get("x")).toString());
        double y = Double.parseDouble(Objects.requireNonNull(shape.getAttrs().get("y")).toString());
        Coordinates<Double, Double> coordinates = new Coordinates<>(x, y);

        MapNode mapNode = new MapNode(name, description, coordinates,shape.getClassName());
        if (connectedRoom != null) {
            mapNode.setConnectedRoom(connectedRoom);
        }

        return mapNode;
    }

}
