package com.example.Ecommerce.service;

import com.example.Ecommerce.entity.Order;
import com.example.Ecommerce.entity.OrderItem;
import com.example.Ecommerce.entity.PaymentOrder;
import com.example.Ecommerce.repo.OrderRepo;
import com.example.Ecommerce.repo.PaymentRepo;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final EmailService emailService;

    private final PaymentRepo paymentRepo;

    private final OrderRepo orderRepo;

    @Autowired
    public PaymentService(EmailService emailService, PaymentRepo paymentRepo, OrderRepo orderRepo) {
        this.emailService = emailService;
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }

    @Value("${razorpay.api.key}")
    private String API_KEY;

    @Value("${razorpay.api.secret}")
    private String API_SECRET;

    public String createOrder(PaymentOrder orderDetails) {
        try{
            RazorpayClient client = new RazorpayClient(API_KEY, API_SECRET);
            String transactionId = "txn_" + UUID.randomUUID();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) orderDetails.getAmount() * 100); // *100 because amount is needed to be set in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", transactionId);
            com.razorpay.Order rzp_order = client.orders.create(orderRequest);

            orderDetails.setOrderId(rzp_order.get("id"));
            orderDetails.setStatus("Created");
            orderDetails.setTransactionId(transactionId);
            orderDetails.setCreatedAt(LocalDateTime.now());
            
            paymentRepo.save(orderDetails);
            
            return rzp_order.toString();
        } catch(Exception e){
            logger.error("Failed to create payment order: {}", e.getMessage(), e);
            throw new RuntimeException("Payment order creation failed: " + e.getMessage(), e);
        }
    }

    public void updateOrderStatus(String orderId, String status, List<OrderItem> orderItems){
        try {
            PaymentOrder paymentOrder = paymentRepo.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            paymentOrder.setStatus(status);
            paymentRepo.save(paymentOrder);

            if("Success".equalsIgnoreCase(status)){
                // Create actual Order entity for orders tab
                Order order = new Order();
                order.setId(paymentOrder.getTransactionId()); // Set Order ID to Razorpay order ID
                order.setUser(paymentOrder.getUser());
                order.setOrderDate(new Date());
                order.setStatus("Confirmed");
                order.setOrderItems(orderItems);
                order.setTotalAmount(paymentOrder.getAmount());
                
                // Set the order reference in each order item
                orderItems.forEach(item -> item.setOrder(order));
                
                orderRepo.save(order);
                
                emailService.sendEmail(paymentOrder.getUser().getEmail(), paymentOrder.getUser().getName(), paymentOrder.getAmount(), orderItems);
            }
        } catch(Exception e){
            logger.error("Failed to update order status for orderId {}: {}", orderId, e.getMessage(), e);
            throw new RuntimeException("Failed to update order status: " + e.getMessage(), e);
        }
    }
}
