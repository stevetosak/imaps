package internettehnologii.imaps.backendRender.auth;

import internettehnologii.imaps.backendRender.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtRequestFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //todo
        // Ova funkcija sa vikat na sekoj http request. Tuka trebit da sa provervit dali e validen tokenot.
    }
}
