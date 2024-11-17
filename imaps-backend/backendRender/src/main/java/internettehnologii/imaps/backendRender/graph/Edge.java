package internettehnologii.imaps.backendRender.graph;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Setter @Getter
@ToString
public class Edge{
  private MapNode node;
   private double weight;

    public Edge(MapNode node, double weight) {
        this.node = node;
        this.weight = weight;
    }

    public Edge(MapNode node) {
     this.node = node;
    }


}
