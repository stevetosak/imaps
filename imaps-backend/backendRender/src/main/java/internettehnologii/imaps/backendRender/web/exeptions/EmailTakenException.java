package internettehnologii.imaps.backendRender.web.exeptions;

public class EmailTakenException extends RuntimeException {
    public EmailTakenException(String message) {
        super(message);
    }
}
