package internettehnologii.imaps.backendRender.web.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.RBA.Role;
import internettehnologii.imaps.backendRender.web.repo.RoleRepository;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.OAuthService;
import internettehnologii.imaps.backendRender.web.util.DTO.OAuthUserInfo;
import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;
import internettehnologii.imaps.backendRender.web.util.OAuthProviders;
import internettehnologii.imaps.backendRender.web.util.UserPrincipal;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.Optional;

@Service
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
        try {
            OAuthUserInfo oAuthUserInfo = mapper.readValue(userInfo, OAuthUserInfo.class);
            Optional<IMapsUser> userOpt = userRepository.getUserByOAuthId(oAuthUserInfo.getId());

            System.out.println("USER INFO OAUTH: " + oAuthUserInfo);
            IMapsUser user;
            if(userOpt.isPresent()) {
                user = userOpt.get();
            } else {
                user = new IMapsUser();
                System.out.println("ID = " + oAuthUserInfo.getId());
                user.setEmail(oAuthUserInfo.getEmail());
                user.setOAuthId(oAuthUserInfo.getId());
                user.setOAuthProvider(OAuthProviders.GOOGLE.name());

                Role userRole = roleRepository.findByName("USER").orElseThrow(RoleNotFoundException::new);

                userRole.getUsers().add(user);
                user.getRoles().add(userRole);


                user.setUsername(oAuthUserInfo.getLogin() + oAuthUserInfo.getId().substring(oAuthUserInfo.getLogin().length() - 3, oAuthUserInfo.getLogin().length()-1));
            }

            user.setAccessToken(passwordEncoder.encode(accessToken));
            userRepository.save(user);
            String token = jwtService.generateToken(new UserPrincipal(user));
            System.out.println("AUTHORITIES: " + jwtService.getAuthorities(token).toString());
            return new UserAuthSuccessDTO(token,user.getUsername(),jwtService.getAuthorities(token).toString());

        } catch (JsonProcessingException | RoleNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
