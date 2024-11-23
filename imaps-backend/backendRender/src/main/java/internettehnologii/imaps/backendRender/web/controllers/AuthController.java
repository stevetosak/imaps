package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.service.JWTService;
import internettehnologii.imaps.backendRender.web.service.MapUserDetailsService;
import internettehnologii.imaps.backendRender.web.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/auth")
@RestController
@CrossOrigin(origins = "http://localhost:5173/")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private ApplicationContext context;


    @PostMapping("/register")
    public IMapsUser register(@RequestBody IMapsUser user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody IMapsUser user, HttpServletRequest request) {
        System.out.println(user);
        Map<String, Object> response = new HashMap<>();
        String token = userService.verify(user);
        response.put("token", token);
        response.put("username", user.getUsername());
        return response;
    }


    //ZA TESTIRANJE
    @GetMapping("/list")
    public List<IMapsUser> showUsers() {
        return userService.getUsers();
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
}
