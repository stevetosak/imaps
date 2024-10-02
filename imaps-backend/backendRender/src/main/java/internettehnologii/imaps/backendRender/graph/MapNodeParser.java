package internettehnologii.imaps.backendRender.graph;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.stream.Stream;

public class MapNodeParser {

    //private final List<MapNode> mapNodes = new ArrayList<>();

    public List<MapNode> parseAndCreateNodes(String mapJson) throws JsonProcessingException {
        final List<MapNode> mapNodes = new ArrayList<>();

        ObjectMapper objectMapper = new ObjectMapper();
            String[] shapes = objectMapper.readValue(mapJson, String[].class);

            Arrays.stream(shapes).forEach(shape -> {
                try {
                    JsonNode parsedNode = objectMapper.readTree(shape);
                    String type = parsedNode.get("className").asText();

                    if(Objects.equals(type,"Wall") || Objects.equals(type,"Room")) return;

                    JsonNode attrs = parsedNode.get("attrs");
                    MapNode mapNode = createMapNode(attrs);

                    if(attrs.has("connected_pins")){
                        JsonNode connectedPins = attrs.get("connected_pins");
                        if (connectedPins.isArray()) {
                            for (JsonNode pin : connectedPins) {
                                System.out.println("Connected Pin: " + pin.asText() + " of: " + attrs.get("obj_name"));
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




    private static String[] getAttrs(JsonNode node){
        Stream<String> attrs = Arrays.stream(
                        node.get("attrs")
                                .toString()
                                .split(","))
                .map(attr -> attr
                        .replaceAll("\\{","")
                        .replaceAll("}",""));
        return attrs.toArray(String[]::new);
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
        Tuple<Double,Double> coordinates = new Tuple<>(x,y);

        return new MapNode(name, description, coordinates);
    }

}
