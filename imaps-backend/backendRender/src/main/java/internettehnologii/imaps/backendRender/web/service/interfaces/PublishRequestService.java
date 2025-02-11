package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.PublishRequest;
import internettehnologii.imaps.backendRender.web.util.DTO.PublishMapDTO;

import java.util.List;

public interface PublishRequestService {
    void addPublishRequest(PublishMapDTO publishRequestDTO, IMapsUser user);
    void denyPublishRequest(int id) throws Exception;
    List<PublishRequest> getAllPublishRequests();
    void save(PublishRequest publishRequest);
    void approvePublishRequest(int id) throws Exception;
    void rejectPublishRequest(PublishRequest publishRequest);
    PublishRequest getPublishRequestByMapName(String mapName);
    void editPublishRequest(PublishRequest publishRequest);
}
