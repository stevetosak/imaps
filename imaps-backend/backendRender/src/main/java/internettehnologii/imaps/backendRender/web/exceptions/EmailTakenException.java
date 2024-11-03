package internettehnologii.imaps.backendRender.web.exceptions;

public class EmailTakenException extends RuntimeException {
    public EmailTakenException(String message) {
        super(message);
    }
}
