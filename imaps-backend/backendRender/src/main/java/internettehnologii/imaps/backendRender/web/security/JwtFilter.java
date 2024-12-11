package internettehnologii.imaps.backendRender.web.security;

import internettehnologii.imaps.backendRender.web.service.impl.JWTService;
import internettehnologii.imaps.backendRender.web.service.impl.MapUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ApplicationContext context;


    private void sendErrorResponse(HttpServletResponse response, String message, int status) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println(request.getRequestURI());
        if(request.getRequestURI().contains("/login") || request.getRequestURI().contains("/register")) {
            filterChain.doFilter(request, response);
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username;

        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try{
                username = jwtService.extractUsername(token);
                if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = context.getBean(MapUserDetailsService.class).loadUserByUsername(username);
                    if(jwtService.validateToken(token,userDetails)){
                        UsernamePasswordAuthenticationToken upAuthToken = new UsernamePasswordAuthenticationToken(userDetails, null, jwtService.getAuthorities(token));
                        System.out.println("TOKEN CLAIMS: " + jwtService.getAuthorities(token));
                        upAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(upAuthToken);
                    } else {
                        System.out.println("Invalid token");
                        sendErrorResponse(response, "The token could not be validated, please try logging in again", HttpServletResponse.SC_UNAUTHORIZED);
                    }
                } else {
                    System.out.println("Bad auth");
                    sendErrorResponse(response, "Username could not be extracted or token not authenticated", HttpServletResponse.SC_UNAUTHORIZED);
                }
            } catch (Exception e){
                System.out.println("ERROR: " + e.getMessage());
            }

        }

        filterChain.doFilter(request, response);
    }
}
