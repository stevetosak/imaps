package internettehnologii.imaps.backendRender.web.util.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class UserAuthSuccessDTO {
    private String token;
    private String username;
    private String roles;
}
