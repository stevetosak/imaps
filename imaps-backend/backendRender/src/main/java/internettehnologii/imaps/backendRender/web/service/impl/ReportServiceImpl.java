package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.Report;
import internettehnologii.imaps.backendRender.web.repo.ReportRepository;
import internettehnologii.imaps.backendRender.web.repo.UserRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.ReportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;


    public ReportServiceImpl(ReportRepository reportRepository, JavaMailSender mailSender, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }


    @Override
    public void saveReport(Report report) {
        reportRepository.save(report);
        sendMailToAdmins(report);
    }

    @Override
    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    public void sendMailToAdmins(Report report) {
        SimpleMailMessage message = new SimpleMailMessage();
        Optional<List<IMapsUser>> adminsOpt = userRepository.getAllAdmins();
        System.out.println("MAIL " + report);
        adminsOpt.ifPresent(admins -> {
            admins.forEach(admin -> {
                message.setTo(admin.getEmail());
                message.setSubject("New Report Submitted");
                String body = String.format(
                        """
                        A new report has been submitted:
                        
                        Report Details:
                        \tReport Id: %s
                        \tSubject: %s
                        \tContent: %s
                        \tSubmitted By: %s

                        """,
                        report.getId(),
                        report.getSubject(),
                        report.getContent(),
                        report.getUser() != null ? report.getUser().getUsername() : "Unknown"
                );
                message.setText(body);
                System.out.println("MESSAGE: " + message);
                mailSender.send(message);
            });
        });
    }

}
