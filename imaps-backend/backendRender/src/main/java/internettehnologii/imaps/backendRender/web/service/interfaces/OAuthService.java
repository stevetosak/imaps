package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;

public interface OAuthService {
    UserAuthSuccessDTO login(String userInfo, String accessToken);
}
