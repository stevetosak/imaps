package internettehnologii.imaps.backendRender.graph;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Getter @Setter
@ToString
public class Shape {
    private Map<String,Object> attrs;
    private String className;
}
