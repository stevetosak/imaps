package internettehnologii.imaps.backendRender.graph;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

public class MapNodeParser {
    public List<MapNode> parseAndCreateNodes(String mapJson) throws JsonProcessingException {
        final List<MapNode> mapNodes = new ArrayList<>();

        ObjectMapper objectMapper = new ObjectMapper();
            String[] shapes = objectMapper.readValue(mapJson, String[].class);

            Arrays.stream(shapes).forEach(shape -> {
                try {
                    JsonNode parsedNode = objectMapper.readTree(shape);
                    String type = parsedNode.get("className").asText();

                    // Wall i room ne se bitni za navigacija
                    if(Objects.equals(type,"Wall") || Objects.equals(type,"Room")) return;

                    JsonNode attrs = parsedNode.get("attrs");
                    MapNode mapNode = createMapNode(attrs);

                    if(attrs.has("connected_pins")){
                        JsonNode connectedPins = attrs.get("connected_pins");
                        if (connectedPins.isArray()) {
                            for (JsonNode pin : connectedPins) {
                                System.out.println("Connected node (markup) : " + pin.asText() + " to: " + attrs.get("obj_name"));
                                mapNode.addConnectionName(pin.asText());
                            }
                        }
                    }

                    mapNodes.add(mapNode);

                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            });

           mapNodes.forEach(node -> System.out.println("Added node: ----> " + node.toString()));

           return mapNodes;

    }


    private static String findAttr(String key,JsonNode attrs){
        if(attrs.has(key)){
            return attrs.get(key).asText();
        } else {
            return "No attribute found for key: " + key;
        }

    }


    private static MapNode createMapNode(JsonNode attrs) {
        String name = findAttr("obj_name",attrs);
        String description = findAttr("description",attrs);
        double x = Double.parseDouble(Objects.requireNonNull(findAttr("x", attrs)));
        double y = Double.parseDouble(Objects.requireNonNull(findAttr("y", attrs)));
        Coordinates<Double,Double> coordinates = new Coordinates<>(x,y);

        return new MapNode(name, description, coordinates);
    }

}
