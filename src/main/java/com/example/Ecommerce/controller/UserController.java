package com.example.Ecommerce.controller;

import com.example.Ecommerce.dto.LoginDTO;
import com.example.Ecommerce.entity.User;
import com.example.Ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user){
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody LoginDTO credentials){
        return userService.loginUser(credentials.getEmail(), credentials.getPassword());
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user){
        return userService.updateUser(id, user);
    }

    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }
}
