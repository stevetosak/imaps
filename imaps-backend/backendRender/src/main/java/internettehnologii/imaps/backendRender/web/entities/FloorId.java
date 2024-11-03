package internettehnologii.imaps.backendRender.web.entities;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
public class FloorId implements Serializable {
    private int indoorMap;
    private int floorNumber;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FloorId floorId = (FloorId) o;
        return indoorMap == floorId.indoorMap && floorNumber == floorId.floorNumber;
    }

    @Override
    public int hashCode() {
        return Objects.hash(indoorMap, floorNumber);
    }
}
