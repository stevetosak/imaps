package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.Report;
import internettehnologii.imaps.backendRender.web.repo.ReportRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.ReportService;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;

    public ReportServiceImpl(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }


    @Override
    public void saveReport(Report report) {
        reportRepository.save(report);
    }
}
