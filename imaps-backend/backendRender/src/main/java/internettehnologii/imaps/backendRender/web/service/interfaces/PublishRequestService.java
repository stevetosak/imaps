package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.PublishRequest;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface PublishRequestService {
    void addPublishRequest(PublishRequest publishRequest);
    void deletePublishRequest(PublishRequest publishRequest);
    List<PublishRequest> getAllPublishRequests();
    void save(PublishRequest publishRequest);
    void approvePublishRequest(int id) throws Exception;
    void rejectPublishRequest(PublishRequest publishRequest);
}
