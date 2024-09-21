package internettehnologii.imaps.backendRender.security;

import internettehnologii.imaps.backendRender.service.JWTService;
import internettehnologii.imaps.backendRender.service.MapUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jdk.jfr.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ApplicationContext context;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username;

        System.out.println(authHeader);

        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);

            if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = context.getBean(MapUserDetailsService.class).loadUserByUsername(username);
                if(jwtService.validateToken(token,userDetails)){
                    UsernamePasswordAuthenticationToken upAuthToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    upAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(upAuthToken);
                }
            } else {
                System.out.println("Bad auth");
            }

        }else {
            System.out.println("Bad header");
        }

        filterChain.doFilter(request, response);
    }
}
