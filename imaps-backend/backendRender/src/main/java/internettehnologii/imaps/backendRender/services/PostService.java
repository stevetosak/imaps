package internettehnologii.imaps.backendRender.services;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.http.HttpHeaders;

@Service
public class PostService {
    private final WebClient webClient;

    public PostService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:5173").build();
    }

    public Mono<String> sendPostRequest(String jsonBody,String targetUri){
        return webClient.post()
                .uri(targetUri)
                .header("Content-Type","application/json")
                .bodyValue(jsonBody)
                .retrieve()
                .bodyToMono(String.class);
    }
}
