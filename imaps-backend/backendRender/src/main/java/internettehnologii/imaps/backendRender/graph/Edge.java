package internettehnologii.imaps.backendRender.graph;


import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Edge <T>{
    private T source;
    private T target;
    private double weight;

    public Edge(T source, T target) {
        this.source = source;
        this.target = target;
    }

    private double calculateWeight(){
        return 0;
    }


}
