package internettehnologii.imaps.backendRender.web.service.interfaces;

public interface StateStore {
    void storeState(String state);
    boolean isValidState(String state);
}
