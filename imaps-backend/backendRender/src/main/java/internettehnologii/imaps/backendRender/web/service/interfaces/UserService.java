package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.UserLoginDTO;

import javax.management.relation.RoleNotFoundException;

public interface UserService {
    IMapsUser register(IMapsUser user) throws RoleNotFoundException;
    UserAuthSuccessDTO login(UserLoginDTO user) throws Exception;
    void addFavoriteMap(IMapsUser user, IndoorMap map);
    void removeFavoriteMap(IMapsUser user, IndoorMap map);
    IMapsUser getUser(String username);
}
