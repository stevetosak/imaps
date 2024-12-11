package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.RBA.Role;
import internettehnologii.imaps.backendRender.web.exceptions.EmailTakenException;
import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.exceptions.MapNotFoundException;
import internettehnologii.imaps.backendRender.web.exceptions.UserNotFoundException;
import internettehnologii.imaps.backendRender.web.exceptions.UsernameTakenException;
import internettehnologii.imaps.backendRender.web.repo.RoleRepository;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.UserService;
import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.UserLoginDTO;
import jakarta.transaction.Transactional;
import jdk.jfr.TransitionTo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    @Autowired
    private JWTService jwtService;

    private final RoleRepository roleRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository repository) {
        this.userRepository = userRepository;
        this.roleRepository = repository;
    }


    @Transactional
    public IMapsUser register(IMapsUser user) throws RoleNotFoundException {
        userRepository.findUserByEmail(user.getEmail()).ifPresent((u) -> {
            throw new EmailTakenException("User with email: " + u.getEmail() + " already exists");
        });
        userRepository.findUserByName(user.getUsername()).ifPresent((u) -> {
            throw new UsernameTakenException("User with name: " + u.getUsername() + " already exists");
        });

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        Role userRole = roleRepository.findByName("USER").orElseThrow(RoleNotFoundException::new);

        userRole.getUsers().add(user);
        user.getRoles().add(userRole);

        return userRepository.save(user);
    }



    public UserAuthSuccessDTO login(UserLoginDTO user) throws Exception {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));


        if (authentication.isAuthenticated()) {
            String token =  jwtService.generateToken((UserDetails) authentication.getPrincipal());
            return new UserAuthSuccessDTO(token, user.getUsername(),jwtService.getAuthorities(token).toString());
        }

        throw new Exception("CANT LOGIN ERR");
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
