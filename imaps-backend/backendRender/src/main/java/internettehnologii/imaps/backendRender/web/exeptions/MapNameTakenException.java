package internettehnologii.imaps.backendRender.web.exeptions;

public class MapNameTakenException extends RuntimeException {
    public MapNameTakenException(String message) {
        super(message);
    }
}
