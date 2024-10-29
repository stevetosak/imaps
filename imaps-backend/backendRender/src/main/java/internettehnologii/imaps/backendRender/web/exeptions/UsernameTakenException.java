package internettehnologii.imaps.backendRender.web.exeptions;

public class UsernameTakenException extends RuntimeException {
    public UsernameTakenException(String message) {
        super(message);
    }
}
