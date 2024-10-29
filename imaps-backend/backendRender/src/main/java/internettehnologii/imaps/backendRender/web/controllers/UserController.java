package internettehnologii.imaps.backendRender.web.controllers;

import internettehnologii.imaps.backendRender.web.entities.IMapsUser;
import internettehnologii.imaps.backendRender.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


//test klasa
//@RestController
//@RequestMapping(path = "api/v1/user")
//public class UserController {
//    private final UserService userService;
//
//    @Autowired
//    public UserController(UserService userService){
//        this.userService = userService;
//    }
//
//    @GetMapping
//    public List<IMapsUser> getUsers(){
//        return userService.getUsers();
//    }
//
//
//    @DeleteMapping(path = "{userId}")
//    public void deleteUser(@PathVariable("userId") Long userId){
//        userService.deleteUser(userId);
//    }
//
//    @PutMapping(path = "{userId}")
//    public void updateUser(
//            @PathVariable("userId") Long userId,
//            @RequestParam(required = false) String name,
//            @RequestParam(required = false) String email){
//        userService.updateUser(userId, name, email);
//    }
//}
