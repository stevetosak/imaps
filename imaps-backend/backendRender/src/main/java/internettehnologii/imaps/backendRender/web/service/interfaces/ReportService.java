package internettehnologii.imaps.backendRender.web.service.interfaces;

import internettehnologii.imaps.backendRender.web.entities.Report;

import java.util.List;

public interface ReportService {

    public void saveReport(Report report);
    public List<Report> getReports();
}
