package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.entities.Report;
import internettehnologii.imaps.backendRender.web.repo.ReportRepository;
import internettehnologii.imaps.backendRender.web.service.interfaces.ReportService;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Override
    public List<Report> getReports() {
        return reportRepository.findAll();
    }
}
