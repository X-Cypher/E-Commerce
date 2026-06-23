package com.example.Ecommerce.service;

import com.example.Ecommerce.entity.User;
import com.example.Ecommerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepo userRepo, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setCreatedAt(LocalDateTime.now());
            User newUser = userRepo.save(user);
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            System.out.println("User Added to Database");
            return newUser;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id " + id + " not found"));
        existingUser.setName(user.getName());
        existingUser.setPhoneNo(user.getPhoneNo());
        existingUser.setEmail(user.getEmail());
        existingUser.setAddresses(user.getAddresses());
        return userRepo.save(existingUser);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
