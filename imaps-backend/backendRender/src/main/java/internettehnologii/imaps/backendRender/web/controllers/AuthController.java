package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.entities.IndoorMap;
import internettehnologii.imaps.backendRender.web.service.impl.JWTService;
import internettehnologii.imaps.backendRender.web.service.impl.MapUserDetailsService;
import internettehnologii.imaps.backendRender.web.service.impl.UserServiceImpl;
import internettehnologii.imaps.backendRender.web.service.interfaces.MapService;
import internettehnologii.imaps.backendRender.web.util.DTO.UserAuthSuccessDTO;
import internettehnologii.imaps.backendRender.web.util.DTO.UserLoginDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import javax.management.relation.RoleNotFoundException;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/api/auth")
@RestController
//@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private ApplicationContext context;


    @PostMapping("/register")
    public IMapsUser register(@RequestBody IMapsUser user) throws RoleNotFoundException {
        return userService.register(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody UserLoginDTO user) {
        System.out.println(user);
        Map<String, Object> response = new HashMap<>();

        try{
            UserAuthSuccessDTO userAuthSuccessDTO = userService.login(user);
            response.put("token", userAuthSuccessDTO.getToken());
            response.put("username", userAuthSuccessDTO.getUsername());
            response.put("roles", userAuthSuccessDTO.getRoles());
        } catch (Exception e){
            System.out.println(e.getMessage());
            response.put("error", e.getMessage());
        }

        return response;
    }


    @GetMapping("/verify")
    public ResponseEntity<Map<String,Object>> authenticateUser(@RequestParam String token) {
        System.out.println("VERIFY");
        Map<String, Object> response = new HashMap<>();
        try{
            String username = jwtService.extractUsername(token);
            UserDetails userDetails = context.getBean(MapUserDetailsService.class).loadUserByUsername(username);
            boolean auth = jwtService.validateToken(token, userDetails);

            if(!auth){
                response.put("error", "Token could not be validated");
                return ResponseEntity.status(403).body(response);
            }

            response.put("username", username);
            System.out.println("Authenticated user: " + username);
        } catch (Exception e){
            response.put("auth",false);
            System.out.println("ERROR: NOT AUTHENTICATED: " + e.getMessage());
        }

        return ResponseEntity.ok(response);

    }

    @GetMapping("/test_auth")
    public ResponseEntity<Map<String,Object>> testAuth(){
        Map<String, Object> response = new HashMap<>();
        response.put("auth",true);
        return ResponseEntity.ok(response);
    }

}
