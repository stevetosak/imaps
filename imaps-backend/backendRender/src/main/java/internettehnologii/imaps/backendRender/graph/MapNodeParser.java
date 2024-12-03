package internettehnologii.imaps.backendRender.graph;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.graph.exceptions.MapParseException;

import java.util.*;

public class MapNodeParser {
    public List<MapNode> parseAndCreateNodes(String mapJson) throws Exception {
        final List<MapNode> mapNodes = new ArrayList<>();

        System.out.println("======= MAP JSON ====== " + mapJson);

//        if(mapJson == null || mapJson.isEmpty() || mapJson.equals("[]")) {
//            throw new MapParseException("Cannot parse empty map");
//        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Shape> shapes = objectMapper.readValue(mapJson, objectMapper.getTypeFactory().constructCollectionType(List.class, Shape.class));

        shapes.forEach(shape -> {
            System.out.println(shape.toString() + " -----------sgap");
            try {
                String type = shape.getClassName();

                // Wall i room ne se bitni za navigacija
                if (Objects.equals(type, "Wall") || Objects.equals(type, "Room")) return;

                Map<String, Object> attrs = shape.getAttrs();
                MapNode mapNode = createMapNode(attrs);

                List<String> connectedPins = (List<String>) attrs.get("connected_pins");


                if (connectedPins != null) {
                    for (String pin : connectedPins) {
                        System.out.println("Connected node (markup) : " + pin + " to: " + attrs.get("obj_name"));
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


    private static String findAttr(String key, JsonNode attrs) {
        if (attrs.has(key)) {
            return attrs.get(key).asText();
        } else {
            System.out.println("No attribute found for key:" + key);
            return null;
        }

    }


    private static MapNode createMapNode(Map<String, Object> attrs) {
        String name = (String) attrs.get("obj_name");
        String description = (String) attrs.get("description");
        String connectedRoom = (String) attrs.get("connected_room");
        double x = Double.parseDouble(Objects.requireNonNull(attrs.get("x")).toString());
        double y = Double.parseDouble(Objects.requireNonNull(attrs.get("y")).toString());
        Coordinates<Double, Double> coordinates = new Coordinates<>(x, y);

        MapNode mapNode = new MapNode(name, description, coordinates);
        if (connectedRoom != null) {
            mapNode.setConnectedRoom(connectedRoom);
        }

        return mapNode;
    }

}
