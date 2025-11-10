package com.example.Ecommerce.controller;

import com.example.Ecommerce.dto.OrderDTO;
import com.example.Ecommerce.dto.OrderRequestDTO;
import com.example.Ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place/{userId}")
    public OrderDTO placeOrder(@PathVariable Long userId, @RequestBody OrderRequestDTO orderRequestDTO){
        return orderService.placeOrder(userId, orderRequestDTO.getProductQuantities());
    }

    @GetMapping("/all")
    public List<OrderDTO> getAllOrders(){
        return orderService.getAllOrders();
    }

    @GetMapping("/user/{userId}")
    public List<OrderDTO> getUserOrders(@PathVariable Long userId){
        return orderService.getUserOrders(userId);
    }

}
