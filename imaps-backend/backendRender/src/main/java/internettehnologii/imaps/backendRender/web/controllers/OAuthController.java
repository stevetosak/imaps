package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.config.OAuthConfig;
import internettehnologii.imaps.backendRender.web.service.interfaces.OAuthService;
import internettehnologii.imaps.backendRender.web.service.interfaces.StateStore;
import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;
import internettehnologii.imaps.backendRender.web.util.OAuthProviders;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Controller
@RequestMapping("/api/oauth")
public class OAuthController {

    private final StateStore stateStore;

    private final OAuthService githubOAuthService;
    private final OAuthService googleOAuthService;
    private final OAuthConfig oAuthConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    public OAuthController(StateStore stateStore,
                           @Qualifier("githubOAuth") OAuthService githubOAuthService,
                           @Qualifier("googleOAuth") OAuthService googleOAuthService,
                           OAuthConfig oAuthConfig) {

        this.stateStore = stateStore;
        this.githubOAuthService = githubOAuthService;
        this.googleOAuthService = googleOAuthService;
        this.oAuthConfig = oAuthConfig;
    }


    @GetMapping("/state")
    public ResponseEntity<String> getState() {
        String uuid = UUID.randomUUID().toString();
        stateStore.storeState(uuid);
        return ResponseEntity.ok(uuid);
    }


    @GetMapping("/callback/github")
    public ResponseEntity<UserAuthSuccessDTO> callbackGithub(@RequestParam("code") String code,
                                                             @RequestParam("state") String state) {

        if(!stateStore.isValidState(state))
            throw new InvalidStateException("State is not valid: " + state);


        String accessToken = exchangeCodeForAccessToken(code,OAuthProviders.GITHUB.name());
        String userInfo = fetchUserInfo(accessToken,OAuthProviders.GITHUB.name());
        System.out.println("User info: " + userInfo);
        UserAuthSuccessDTO userAuthSuccessDTO = githubOAuthService.login(userInfo,accessToken);


        String encodedUsrname = URLEncoder.encode(userAuthSuccessDTO.getUsername(), StandardCharsets.UTF_8);
        String encodedToken = URLEncoder.encode(userAuthSuccessDTO.getToken(), StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("https://imaps.mk/auth-callback?token=" + encodedToken + "&username=" + encodedUsrname));
        headers.add("Set-Cookie", "Authorization=Bearer " + userAuthSuccessDTO + "; HttpOnly; Path=/; SameSite=Strict");

        return new ResponseEntity<>(userAuthSuccessDTO,headers, HttpStatus.FOUND);
    }
    @GetMapping("/callback/google")
    public ResponseEntity<UserAuthSuccessDTO> callbackGoogle(@RequestParam("code") String code,
                                                             @RequestParam("state") String state){

        if(!stateStore.isValidState(state))
            throw new InvalidStateException("State is not valid: " + state);

        String accessToken = exchangeCodeForAccessToken(code,OAuthProviders.GOOGLE.name());
        String userInfo = fetchUserInfo(accessToken,OAuthProviders.GOOGLE.name());
        UserAuthSuccessDTO userAuthSuccessDTO = googleOAuthService.login(userInfo,accessToken);

        String encodedUsrname = URLEncoder.encode(userAuthSuccessDTO.getUsername(), StandardCharsets.UTF_8);
        String encodedToken = URLEncoder.encode(userAuthSuccessDTO.getToken(), StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("https://imaps.mk/auth-callback?token=" + encodedToken + "&username=" + encodedUsrname));
        headers.add("Set-Cookie", "Authorization=Bearer " + userAuthSuccessDTO + "; HttpOnly; Path=/; SameSite=Strict");
        return new ResponseEntity<>(userAuthSuccessDTO,headers, HttpStatus.FOUND);
    }

    Map<String,String> getBodyByProvider(String provider,String code) {
        Map<String, String> body = new HashMap<>();
        if(provider.equals(OAuthProviders.GOOGLE.name())){
            body.put("client_id", oAuthConfig.getGOOGLE_CLIENT_ID());
            body.put("client_secret", oAuthConfig.getGOOGLE_CLIENT_SECRET());
            body.put("code", code);
            body.put("redirect_uri", oAuthConfig.getGOOGLE_REDIRECT_URI());
            body.put("grant_type", "authorization_code");
        } else {
            body.put("client_id", oAuthConfig.getGITHUB_CLIENT_ID());
            body.put("client_secret", oAuthConfig.getGITHUB_CLIENT_SECRET());
            body.put("code", code);
            body.put("redirect_uri", oAuthConfig.getGITHUB_REDIRECT_URI());
            body.put("scope","user");
        }

        return body;
    }



    private String exchangeCodeForAccessToken(String code,String provider) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        String url = Objects.equals(provider, OAuthProviders.GOOGLE.name()) ? oAuthConfig.getGOOGLE_TOKEN_URL() : oAuthConfig.getGITHUB_TOKEN_URL();

        Map<String, String> body = getBodyByProvider(provider,code);
        HttpEntity<Map<String,String>> request = new HttpEntity<>(body,headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        Map<String,Object> respBody = response.getBody();

        return (String) respBody.get("access_token");
    }

    private String fetchUserInfo(String accessToken,String provider){
        String url = Objects.equals(provider, OAuthProviders.GOOGLE.name()) ? oAuthConfig.getGOOGLE_USER_URL() : oAuthConfig.getGITHUB_USER_URL();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        return response.getBody();
    }

}
