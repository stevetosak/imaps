package internettehnologii.imaps.backendRender.web.util.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ReportDTO {
    String username;
    String mapName;
    String subject;
    String content;
    String date;
}
