package internettehnologii.imaps.backendRender.service;


import internettehnologii.imaps.backendRender.entities.user.IMapsUser;
import internettehnologii.imaps.backendRender.entities.user.UserRepository;
import internettehnologii.imaps.backendRender.model.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MapUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       IMapsUser user = userRepository.findUserByName(username);
       if(user == null) {
           throw new UsernameNotFoundException(username);
       }

       return new UserPrincipal(user);
    }
}
