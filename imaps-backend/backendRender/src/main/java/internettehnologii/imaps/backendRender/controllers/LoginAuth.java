package internettehnologii.imaps.backendRender.controllers;

import internettehnologii.imaps.backendRender.entities.UserLoginDTO;
import internettehnologii.imaps.backendRender.util.JwtUtil;
import internettehnologii.imaps.backendRender.auth.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@CrossOrigin("http://localhost:5173")
public class LoginAuth {
    String username = "admin";
    String password = "admin";

    // tuka inject service za pristap do baza

    @PostMapping
    public ResponseEntity<?> login(@RequestBody UserLoginDTO userLoginDTO) {
        // 1. proverka vo baza dali imat entry
        // 2. ako imat generiraj JWT token
        // 3. pusti go tokenot na frontend

        // ova e samo za test bez baza:

        if(userLoginDTO.getUsername().equals(username) && userLoginDTO.getPassword().equals(password)) {
            JwtUtil jwtUtil = new JwtUtil();
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(new AuthResponse(token));
        }
        else return ResponseEntity.notFound().build();

    }

}
