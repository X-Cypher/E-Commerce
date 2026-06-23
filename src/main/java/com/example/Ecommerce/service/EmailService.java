package com.example.Ecommerce.service;

import com.example.Ecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String name, double amount, List<OrderItem> orderItems){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to); // Email address of the user
        message.setSubject("MavenMart - Order Placed Successfully");
        
        StringBuilder emailBody = new StringBuilder();
        emailBody.append("Hello ").append(name).append(",\n\n");
        emailBody.append("Your order has been placed successfully.\n\n");
        emailBody.append("Order amount: ₹").append(amount).append("\n\n");
        emailBody.append("Order Items:\n");
        emailBody.append("-------------------\n");
        
        if (orderItems != null && !orderItems.isEmpty()) {
            for (OrderItem item : orderItems) {
                emailBody.append("- ").append(item.getProduct().getName())
                        .append(" x ").append(item.getQuantity())
                        .append(" (₹").append(item.getProduct().getPrice()).append(" each)\n");
            }
        } else {
            emailBody.append("No items in this order.\n");
        }
        
        emailBody.append("-------------------\n");
        emailBody.append("Thank you for shopping with us!");
        
        message.setText(emailBody.toString());
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String name){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to MavenMart!");
        
        StringBuilder emailBody = new StringBuilder();
        emailBody.append("Hello ").append(name).append(",\n\n");
        emailBody.append("Welcome to MavenMart! We're excited to have you with us.\n\n");
        emailBody.append("Your account has been successfully created.\n\n");
        emailBody.append("Start shopping now and enjoy our wide range of products.\n\n");
        emailBody.append("Happy Shopping!\n");
        emailBody.append("The MavenMart Team");
        
        message.setText(emailBody.toString());
        mailSender.send(message);
    }
}
