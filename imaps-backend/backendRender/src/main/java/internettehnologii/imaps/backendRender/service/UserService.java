package internettehnologii.imaps.backendRender.service;

import internettehnologii.imaps.backendRender.entities.user.IMapsUser;
import internettehnologii.imaps.backendRender.entities.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

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

        if(email != null && email.length() > 0 && !Objects.equals(user.getEmail(), email)){
            Optional<IMapsUser> userOptional = userRepository.findUserByEmail(email);
            if(userOptional.isPresent()){
                throw new IllegalStateException("email taken");
            }

            user.setEmail(email);
        }
    }
}
