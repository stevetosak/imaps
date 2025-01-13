package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.entities.MAP_STATUS;
import internettehnologii.imaps.backendRender.web.entities.PublishRequest;
import internettehnologii.imaps.backendRender.web.repo.MapRepository;
import internettehnologii.imaps.backendRender.web.repo.PublishRequestRepository;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import internettehnologii.imaps.backendRender.web.service.interfaces.PublishRequestService;
import internettehnologii.imaps.backendRender.web.service.interfaces.UserService;
import internettehnologii.imaps.backendRender.web.util.DTO.MapDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.PublishMapDTO;
import jakarta.transaction.Transactional;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PublishRequestServiceImpl implements PublishRequestService {
    private final PublishRequestRepository publishRequestRepository;
    private final MapRepository mapRepository;
    private final MapService mapService;
    private final UserService userService;
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    public PublishRequestServiceImpl(PublishRequestRepository publishRequestRepository, MapRepository mapRepository, MapService mapService, UserService userService, JavaMailSender mailSender, UserRepository userRepository) {
        this.publishRequestRepository = publishRequestRepository;
        this.mapRepository = mapRepository;
        this.mapService = mapService;
        this.userService = userService;
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public MapDTO addPublishRequest(PublishMapDTO formData, IMapsUser user) {
        Optional<PublishRequest> prOptional = publishRequestRepository.findById(formData.getId());
        PublishRequest pr;
        IndoorMap map = mapService.getMapByName(formData.getMapName());
        if (prOptional.isPresent()) {
            pr = prOptional.get();
            pr.setName(formData.getName());
            pr.setLastName(formData.getLastName());
            pr.setGMapsUrl(formData.getGoogleMapsUrl());
            pr.setMapType(formData.getMapType());
            map.setStatus(MAP_STATUS.PENDING);
        } else {
            pr = new PublishRequest(formData.getName(), formData.getLastName(), formData.getGoogleMapsUrl(), formData.getMapType());
            pr.setMap(map);
            pr.setUser(user);
            map.setStatus(MAP_STATUS.PENDING);

        }
        this.mapRepository.save(map);
        this.publishRequestRepository.save(pr);
        sendMailToAdmins(user,pr);
        return map.toMapDTO();

    }

    @Override
    public void denyPublishRequest(int id,String reason) throws Exception {
        PublishRequest pr = this.publishRequestRepository.findById(id).orElseThrow(Exception::new);

        pr.setResolved(true);
        IndoorMap map = pr.getMap();
        map.setStatus(MAP_STATUS.PRIVATE);
        map.setIsPublished(false);

        this.publishRequestRepository.save(pr);
        this.mapRepository.save(map);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(pr.getMap().getUser().getEmail());
        message.setSubject("Denied Publish Request");
        message.setText(String.format("Your publish request for map: %s has been denied." +
                "\nReason:\n%s",pr.getMap().getName(),reason));
        mailSender.send(message);
    }

    @Override
    public List<PublishRequest> getAllPublishRequests() {
        return this.publishRequestRepository.findAll();
    }

    @Override
    public void save(PublishRequest publishRequest) {

    }
    @Override
    public void sendMailToAdmins(IMapsUser user, PublishRequest pr){
        System.out.println("test");
        SimpleMailMessage message = new SimpleMailMessage();
        Optional<List<IMapsUser>> adminsOpt = userRepository.getAllAdmins();
        adminsOpt.ifPresent(admins -> {
            admins.forEach(admin -> {
                message.setTo(admin.getEmail());
                message.setSubject("New Publish Request");
                String body = String.format(
                        """
                                Publish Request Details:
                                \tRequest Id: %s
                                \tMap Id: %s
                                \tMap Name: %s
                                
                                User Details:
                                \tId: %s
                                \tUsername: %s
                                \tEmail: %s
                                \tFirst Name: %s
                                \t Last Name: %s
                                """,
                        pr.getId(), pr.getMap().getId(),
                        pr.getMap().getName(),
                        user.getId(),user.getUsername(),user.getEmail(),
                        pr.getName(),pr.getLastName());

                message.setText(body);
                mailSender.send(message);
            });
        });

    }


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

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(pr.getMap().getUser().getEmail());
        message.setSubject("Approved Publish Request");
        message.setText(String.format("Your publish request for map: %s has been approved!\nYour map is now public. That means that anyone can view and use your map.\nThank you for building!",pr.getMap().getName()));
        mailSender.send(message);

    }

    @Override
    public void rejectPublishRequest(PublishRequest publishRequest) {
        publishRequest.setResolved(false);
        IndoorMap map = publishRequest.getMap();
        map.setStatus(MAP_STATUS.PRIVATE);
    }

    @Override
    public PublishRequest getPublishRequestByMapName(String mapName) {
        return this.publishRequestRepository.findByMapName(mapName).orElse(new PublishRequest());
    }

    @Override
    public void editPublishRequest(PublishRequest publishRequest) {
        if (!publishRequestRepository.existsById(publishRequest.getId())) return;

        publishRequestRepository.save(publishRequest);
    }
}
