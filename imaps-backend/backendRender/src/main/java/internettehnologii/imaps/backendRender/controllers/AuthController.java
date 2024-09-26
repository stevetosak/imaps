package internettehnologii.imaps.backendRender.controllers;

import internettehnologii.imaps.backendRender.entities.user.IMapsUser;
import internettehnologii.imaps.backendRender.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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


    @PostMapping("/register")
    public IMapsUser register(@RequestBody IMapsUser user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public Map<String,Object> login(@RequestBody IMapsUser user) {
        System.out.println(user);
        Map<String,Object> response = new HashMap<>();
        response.put("token",userService.verify(user));
        return response;
    }
    @GetMapping("/list")
    public List<IMapsUser> showUsers() {
        return userService.getUsers();
    }
}
