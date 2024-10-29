package internettehnologii.imaps.backendRender.web.service;


import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.util.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MapUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       Optional<IMapsUser> user = userRepository.findUserByName(username);
       if(user.isEmpty()) {
           throw new UsernameNotFoundException(username);
       }

       return new UserPrincipal(user.get());
    }
}
