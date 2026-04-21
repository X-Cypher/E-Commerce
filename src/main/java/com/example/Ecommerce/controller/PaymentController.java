package com.example.Ecommerce.controller;

import com.example.Ecommerce.dto.PaymentUpdateRequest;
import com.example.Ecommerce.entity.PaymentOrder;
import com.example.Ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createOrder(@RequestBody PaymentOrder orderDetails) {
        String orderResponse = paymentService.createOrder(orderDetails);
        return ResponseEntity.ok(orderResponse);
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateOrderStatus(@RequestBody PaymentUpdateRequest request) {
        paymentService.updateOrderStatus(request.getOrderId(), request.getStatus(), request.getOrderItems());
        return ResponseEntity.ok("Order placed successfully, invoice has been sent to your email");
    }
}
