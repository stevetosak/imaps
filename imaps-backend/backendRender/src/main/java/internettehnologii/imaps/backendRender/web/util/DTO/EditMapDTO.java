package internettehnologii.imaps.backendRender.web.util.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EditMapDTO {
    String initialName;
    String name;
    String gmapsUrl;
    String type;
}
