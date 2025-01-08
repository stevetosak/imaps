package internettehnologii.imaps.backendRender.web.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.web.controllers.InvalidStateException;
import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.RBA.Role;
import internettehnologii.imaps.backendRender.web.repo.RoleRepository;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.OAuthService;
import internettehnologii.imaps.backendRender.web.util.DTO.GitHubUserInfo;
import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;
import internettehnologii.imaps.backendRender.web.util.OAuthProviders;
import internettehnologii.imaps.backendRender.web.util.UserPrincipal;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.Optional;

@Service("githubOAuth")
public class GitHubOAuthService implements OAuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final RoleRepository roleRepository;

    public GitHubOAuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JWTService jwtService, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }


    @Override
    @Transactional
    public UserAuthSuccessDTO login(String userInfo, String accessToken) {
        ObjectMapper mapper = new ObjectMapper();
        GitHubUserInfo oAuthUserInfo;

        try {
            oAuthUserInfo = mapper.readValue(userInfo, GitHubUserInfo.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse GitHub user info.", e);
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

    private IMapsUser createNewUser(GitHubUserInfo oAuthUserInfo) {
        IMapsUser newUser = new IMapsUser();

        newUser.setEmail(oAuthUserInfo.getEmail());
        newUser.setOAuthId(oAuthUserInfo.getId());
        newUser.setOAuthProvider(OAuthProviders.GITHUB.name());
        newUser.setUsername(generateUniqueUsername(oAuthUserInfo));

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("User role not found."));

        userRole.getUsers().add(newUser);
        newUser.getRoles().add(userRole);

        return newUser;
    }

    private String generateUniqueUsername(GitHubUserInfo oAuthUserInfo) {
        String login = oAuthUserInfo.getLogin();
        String idSubstring = oAuthUserInfo.getId()
                .substring(login.length() - 3, login.length() - 1);
        return login + idSubstring;
    }

}
