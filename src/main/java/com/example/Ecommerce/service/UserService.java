package com.example.Ecommerce.service;

import com.example.Ecommerce.entity.User;
import com.example.Ecommerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepo userRepo;

    @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User registerUser(User user) {
        try {
            user.setCreatedAt(LocalDateTime.now());
            User newUser = userRepo.save(user);
            System.out.println("User Added to Database");
            return newUser;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public User loginUser(String email, String password) {
        User user = userRepo.findByEmail(email);
        if(user != null && user.getPassword().equals(password)){
            return user;
        }
        //invalid credentials
        return null;
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id " + id + " not found"));
        existingUser.setName(user.getName());
        existingUser.setPhoneNo(user.getPhoneNo());
        existingUser.setEmail(user.getEmail());
        existingUser.setAddress(user.getAddress());
        return userRepo.save(existingUser);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
