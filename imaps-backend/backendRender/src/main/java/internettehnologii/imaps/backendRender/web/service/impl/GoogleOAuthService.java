package internettehnologii.imaps.backendRender.web.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.RBA.Role;
import internettehnologii.imaps.backendRender.web.repo.RoleRepository;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.OAuthService;
import internettehnologii.imaps.backendRender.web.util.DTO.GitHubUserInfo;
import internettehnologii.imaps.backendRender.web.util.DTO.GoogleUserInfo;
import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;
import internettehnologii.imaps.backendRender.web.util.OAuthProviders;
import internettehnologii.imaps.backendRender.web.util.UserPrincipal;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("googleOAuth")
public class GoogleOAuthService implements OAuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final RoleRepository roleRepository;

    public GoogleOAuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JWTService jwtService, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public UserAuthSuccessDTO login(String userInfo, String accessToken) {
        ObjectMapper mapper = new ObjectMapper();
        GoogleUserInfo oAuthUserInfo;

        try {
            oAuthUserInfo = mapper.readValue(userInfo, GoogleUserInfo.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Google user info.", e);
        }

        Optional<IMapsUser> userOpt = userRepository.getUserByOAuthId(oAuthUserInfo.getId());
        IMapsUser user = userOpt.orElseGet(() -> createNewUser(oAuthUserInfo));
        user.setAccessToken(passwordEncoder.encode(accessToken));
        userRepository.save(user);

        String token = jwtService.generateToken(new UserPrincipal(user));

        return new UserAuthSuccessDTO(
                token,
                user.getUsername(),
                jwtService.getAuthorities(token).toString()
        );
    }

    private IMapsUser createNewUser(GoogleUserInfo oAuthUserInfo) {
        IMapsUser newUser = new IMapsUser();

        newUser.setEmail(oAuthUserInfo.getEmail());
        newUser.setOAuthId(oAuthUserInfo.getId());
        newUser.setOAuthProvider(OAuthProviders.GOOGLE.name());
        newUser.setUsername(generateUniqueUsername(oAuthUserInfo));

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("User role not found."));

        userRole.getUsers().add(newUser);
        newUser.getRoles().add(userRole);

        return newUser;
    }

    private String generateUniqueUsername(GoogleUserInfo oAuthUserInfo) {
        String username = oAuthUserInfo.getName();
        String idSubstring = oAuthUserInfo.getId()
                .substring(username.length() - 3, username.length() - 1);
        return username + idSubstring;
    }
}
