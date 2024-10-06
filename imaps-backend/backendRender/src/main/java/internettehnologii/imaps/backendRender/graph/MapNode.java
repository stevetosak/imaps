package internettehnologii.imaps.backendRender.graph;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter @Getter
public class MapNode {
    private String name;
    private String description;
    private Coordinates<Double,Double> coordinates;
    private List<String> connectionNames = new ArrayList<>();

    public MapNode(String name, String description, Coordinates<Double, Double> coordinates) {
        this.name = name;
        this.description = description;
        this.coordinates = coordinates;
    }

    public MapNode(String name,Coordinates<Double, Double> coordinates,List<String> connectionNames) {
        this.coordinates = coordinates;
        this.name = name;
        this.connectionNames = connectionNames;
    }

    public MapNode() {
    }

    public void addConnectionName(String connection) {
        this.connectionNames.add(connection);
    }

    @Override
    public String toString() {
        return "MapNode{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", coordinates=" + coordinates +
                ", connections=" + connectionNames +
                '}';
    }
}