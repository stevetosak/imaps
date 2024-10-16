package internettehnologii.imaps.backendRender.web.service;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public List<IMapsUser> getUsers(){
        return userRepository.findAll();
    }

    public IMapsUser register(IMapsUser user) {
        Optional<IMapsUser> usrOptional = userRepository.findUserByEmail(user.getEmail());
        if(usrOptional.isPresent()){
            throw new IllegalStateException("email taken");
        }

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        boolean exists = userRepository.existsById(userId);
        if(!exists){
            throw new IllegalStateException("User with id: " + userId + " does not exist");
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public void updateUser(Long userId, String name, String email) {
        IMapsUser user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("user with id " + userId + " does not exist"));
        if(name != null && !name.isEmpty() && !Objects.equals(user.getUsername(), name)){
            user.setUsername(name);
        }

        if(email != null && !email.isEmpty() && !Objects.equals(user.getEmail(), email)){
            Optional<IMapsUser> userOptional = userRepository.findUserByEmail(email);
            if(userOptional.isPresent()){
                throw new IllegalStateException("email taken");
            }

            user.setEmail(email);
        }
    }

    public String verify(IMapsUser user) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if(authentication.isAuthenticated()){
            return jwtService.generateToken(user.getUsername());
        }

        return "Auth failed";
    }

}
