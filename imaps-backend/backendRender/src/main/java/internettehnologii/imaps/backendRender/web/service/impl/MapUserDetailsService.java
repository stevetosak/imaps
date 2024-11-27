package internettehnologii.imaps.backendRender.web.service.impl;


import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.util.UserPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MapUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public MapUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       Optional<IMapsUser> user = userRepository.findUserByName(username);
       if(user.isEmpty()) {
           throw new UsernameNotFoundException(username);
       }

       return new UserPrincipal(user.get());
    }
}
