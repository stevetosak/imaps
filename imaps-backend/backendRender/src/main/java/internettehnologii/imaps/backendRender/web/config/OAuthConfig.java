package internettehnologii.imaps.backendRender.web.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class OAuthConfig {
    @Value("${github.client.id}")
    private String GITHUB_CLIENT_ID;
    @Value("${github.client.secret}")
    private String GITHUB_CLIENT_SECRET;
    @Value("${github.redirect.uri}")
    private String GITHUB_REDIRECT_URI;
    @Value("${google.redirect.uri}")
    private String GOOGLE_REDIRECT_URI;
    @Value("${google.client.id}")
    private String GOOGLE_CLIENT_ID;
    @Value("${google.client.secret}")
    private String GOOGLE_CLIENT_SECRET;

    private final String GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
    private final String GITHUB_USER_URL = "https://api.github.com/user";

    private final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    private final String GOOGLE_USER_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

}
