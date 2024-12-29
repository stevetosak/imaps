package internettehnologii.imaps.backendRender.web.service.impl;

import internettehnologii.imaps.backendRender.web.service.interfaces.StateStore;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OAuthStateStore implements StateStore {

    private final Map<String, Long> stateStore = new ConcurrentHashMap<>();

    @Override
    public void storeState(String state) {
        stateStore.put(state, System.currentTimeMillis());
    }

    @Override
    public boolean isValidState(String state) {
        Long timestamp = stateStore.remove(state);
        return timestamp != null && System.currentTimeMillis() - timestamp < 300000; // 5min
    }
}
