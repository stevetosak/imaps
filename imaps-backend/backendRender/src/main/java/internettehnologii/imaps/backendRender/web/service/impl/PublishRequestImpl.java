package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.MAP_STATUS;
import internettehnologii.imaps.backendRender.web.entities.PublishRequest;
import internettehnologii.imaps.backendRender.web.repo.MapRepository;
import internettehnologii.imaps.backendRender.web.repo.PublishRequestRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.PublishRequestService;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublishRequestImpl implements PublishRequestService {
    private final PublishRequestRepository publishRequestRepository;
    private final MapRepository mapRepository;

    public PublishRequestImpl(PublishRequestRepository publishRequestRepository, MapRepository mapRepository) {
        this.publishRequestRepository = publishRequestRepository;
        this.mapRepository = mapRepository;
    }

    @Override
    public void addPublishRequest(PublishRequest publishRequest) {
        IndoorMap map = publishRequest.getMap();
        map.setStatus(MAP_STATUS.INVALID);
        this.publishRequestRepository.save(publishRequest);
        this.mapRepository.save(map);
    }

    @Override
    public void deletePublishRequest(PublishRequest publishRequest) {
        this.publishRequestRepository.delete(publishRequest);
    }

    @Override
    public List<PublishRequest> getAllPublishRequests() {
        return this.publishRequestRepository.findAll();
    }

    @Override
    public void save(PublishRequest publishRequest) {

    }

    // todo mail pustanje

    @Override
    public void approvePublishRequest(int id) throws Exception {
        PublishRequest pr = this.publishRequestRepository.findById(id).orElseThrow(Exception::new);

        pr.setResolved(true);
        IndoorMap map = pr.getMap();
        map.setStatus(MAP_STATUS.PUBLIC);
        map.setIsPublished(true);
        map.setGmapsUrl(pr.getGMapsUrl());
        map.setMapType(pr.getMapType());

        this.publishRequestRepository.save(pr);
        this.mapRepository.save(map);
    }

    @Override
    public void rejectPublishRequest(PublishRequest publishRequest) {
        publishRequest.setResolved(false);
        IndoorMap map = publishRequest.getMap();
        map.setStatus(MAP_STATUS.PRIVATE);
    }
}
