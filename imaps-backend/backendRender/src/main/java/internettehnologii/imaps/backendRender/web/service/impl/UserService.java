package internettehnologii.imaps.backendRender.web.service;

import internettehnologii.imaps.backendRender.web.exceptions.EmailTakenException;
import internettehnologii.imaps.backendRender.web.exceptions.UserNotFoundException;
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
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<IMapsUser> getUsers() {
        return userRepository.findAll();
    }

    public IMapsUser register(IMapsUser user) {
        userRepository.findUserByEmail(user.getEmail()).ifPresent((u) -> {
            throw new EmailTakenException("User with email: " + u.getEmail() + " already exists");
        });
        userRepository.findUserByName(user.getUsername()).ifPresent((u) -> {
            throw new EmailTakenException("User with name: " + u.getUsername() + " already exists");
        });

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        boolean exists = userRepository.existsById(userId);
        if (!exists) {
            throw new IllegalStateException("User with id: " + userId + " does not exist");
        }

        userRepository.deleteById(userId);
    }

    @Transactional
    public void updateUser(Long userId, String name, String email) {
        IMapsUser user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("user with id " + userId + " does not exist"));
        if (name != null && !name.isEmpty() && !Objects.equals(user.getUsername(), name)) {
            user.setUsername(name);
        }

        if (email != null && !email.isEmpty() && !Objects.equals(user.getEmail(), email)) {
            user.setEmail(email);
        }
    }

    public String verify(IMapsUser user) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        }

        // tuka exception
        return "Auth failed";
    }

}
