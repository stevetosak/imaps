package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.service.interfaces.OAuthService;
import internettehnologii.imaps.backendRender.web.service.interfaces.StateStore;
import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/api/oauth")
public class GitHubAuthController {

    @Value("${github.client.id}")
    private String clientId;
    @Value("${github.client.secret}")
    private String clientSecret;
    @Value("${github.redirect.uri}")
    private String redirectUri;

    private final StateStore stateStore;
    private final OAuthService oAuthService;

    private static final String GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
    private static final String GITHUB_USER_URL = "https://api.github.com/user";

    private final RestTemplate restTemplate = new RestTemplate();

    public GitHubAuthController(StateStore stateStore, OAuthService oAuthService) {
        this.stateStore = stateStore;
        this.oAuthService = oAuthService;
    }


    @GetMapping("/state")
    public ResponseEntity<String> redirectToGitHub() {
        String uuid = UUID.randomUUID().toString();
        stateStore.storeState(uuid);
        return ResponseEntity.ok(uuid);
    }

    @GetMapping("/callback")
    public ResponseEntity<UserAuthSuccessDTO> callback(@RequestParam("code") String code,
                                         @RequestParam("state") String state) {

        if(!stateStore.isValidState(state))
            throw new InvalidStateException("State is null or does not match: ");

        String accessToken = exchangeCodeForAccessToken(code);
        String userInfo = fetchGitHubUserInfo(accessToken);
        System.out.println("User info: " + userInfo);

        UserAuthSuccessDTO userAuthSuccessDTO = oAuthService.login(userInfo,accessToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("http://localhost:5173/auth-callback?token=" + userAuthSuccessDTO.getToken() + "&username=" + userAuthSuccessDTO.getUsername()));
        headers.add("Set-Cookie", "Authorization=Bearer " + userAuthSuccessDTO + "; HttpOnly; Path=/; SameSite=Strict");

        return new ResponseEntity<>(userAuthSuccessDTO,headers, HttpStatus.FOUND);
    }


    private String exchangeCodeForAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("code", code);
        body.put("redirect_uri", redirectUri);
        body.put("scope","user");

        HttpEntity<Map<String,String>> request = new HttpEntity<>(body,headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(GITHUB_TOKEN_URL, request, Map.class);
        Map<String,Object> respBody = response.getBody();


        return (String) respBody.get("access_token");
    }

    private String fetchGitHubUserInfo(String accessToken){
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(GITHUB_USER_URL, HttpMethod.GET, request, String.class);

        return response.getBody();
    }

}
