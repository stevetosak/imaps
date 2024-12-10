package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.util.DTO.UserLoginDTO;

import javax.naming.AuthenticationException;

public interface UserService {
    IMapsUser register(IMapsUser user);
    String login(UserLoginDTO user) throws AuthenticationException;
    void addToFavorites(IMapsUser user, IndoorMap map);
    void removeFromFavorites(IMapsUser user, IndoorMap map);
    IMapsUser getUser(String username);
}