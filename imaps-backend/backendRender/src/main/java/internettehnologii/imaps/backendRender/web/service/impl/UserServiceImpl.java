package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.exceptions.EmailTakenException;
import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.exceptions.MapNotFoundException;
import internettehnologii.imaps.backendRender.web.exceptions.UserNotFoundException;
import internettehnologii.imaps.backendRender.web.exceptions.UsernameTakenException;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.UserService;
import internettehnologii.imaps.backendRender.web.util.DTO.UserLoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public IMapsUser register(IMapsUser user) {
        userRepository.findUserByEmail(user.getEmail()).ifPresent((u) -> {
            throw new EmailTakenException("User with email: " + u.getEmail() + " already exists");
        });
        userRepository.findUserByName(user.getUsername()).ifPresent((u) -> {
            throw new UsernameTakenException("User with name: " + u.getUsername() + " already exists");
        });

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }



    public String login(UserLoginDTO user) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        }

        return "Auth failed";
    }

    @Override
    public void addToFavorites(IMapsUser user, IndoorMap map) {
        user.getFavoriteMaps().add(map);
        userRepository.save(user);
    }

    @Override
    public void removeFromFavorites(IMapsUser user, IndoorMap map) {
        boolean removed = user.getFavoriteMaps().remove(map);
        if(!removed) throw new MapNotFoundException("Map not found. " + map.getName());

        userRepository.save(user);

    }

    @Override
    public IMapsUser getUser(String usrnameOrEmail) {
        return userRepository.getIMapsUserByUsernameOrEmail(usrnameOrEmail).orElseThrow(() -> new UserNotFoundException("User " + usrnameOrEmail + " not found"));
    }

}
