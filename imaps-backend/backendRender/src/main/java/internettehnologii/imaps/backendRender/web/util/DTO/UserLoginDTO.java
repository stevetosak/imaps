package internettehnologii.imaps.backendRender.web.util.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
@AllArgsConstructor
public class UserLoginDTO {
    private String username;
    private String password;
}
