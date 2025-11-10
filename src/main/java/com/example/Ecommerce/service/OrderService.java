package com.example.Ecommerce.service;

import com.example.Ecommerce.dto.OrderDTO;
import com.example.Ecommerce.dto.OrderItemDTO;
import com.example.Ecommerce.entity.Order;
import com.example.Ecommerce.entity.OrderItem;
import com.example.Ecommerce.entity.Product;
import com.example.Ecommerce.entity.User;
import com.example.Ecommerce.repo.OrderRepo;
import com.example.Ecommerce.repo.ProductRepo;
import com.example.Ecommerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private OrderRepo orderRepo;

    // We are returning OrderDTO because we want to display only the relevant data to the user, not the whole order. So unlike Order, OrderDto contains only the relevant order details not all
    public OrderDTO placeOrder(Long userId, Map<Long, Integer> productQuantities) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("No user with id " + userId + " found"));

        Order order = new Order(); //create new order
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus("Pending");
        order.setTotalAmount(productQuantities.values().stream().mapToDouble(i -> i).sum());

        // for order we need order items
        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderItemDTO> orderItemsDTO = new ArrayList<>(); //ye isliye bnaya hai kyuki return OrderDTO krna hai and usme OrderItemsDTO chaiye

        for(Map.Entry<Long, Integer> entry: productQuantities.entrySet()){

            Long productId = entry.getKey();
            Integer quantity = entry.getValue();
            if(quantity <= 0){
                throw new RuntimeException("Product Quantity must be greater than 0");
            }

            OrderItem orderItem = new OrderItem(); //create new order item

            // for order item we need product
            Product product = productRepo.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product with id " + productId + " not found"));
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setOrder(order);

            // add curr order item to order items list
            orderItems.add(orderItem);
            orderItemsDTO.add(new OrderItemDTO(product.getName(), product.getPrice(), quantity));
        }

        order.setOrderItems(orderItems);
        Order savedOrder = orderRepo.save(order);

        return new OrderDTO(savedOrder.getId(), savedOrder.getTotalAmount(), savedOrder.getStatus(), savedOrder.getOrderDate(), orderItemsDTO);
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepo.findAll();

        List<OrderDTO> orderDTOS = new ArrayList<>();
        for(Order order: orders){
            List<OrderItemDTO> orderItemDTOS = order.getOrderItems()
                    .stream()
                        .map(item -> new OrderItemDTO(
                            item.getProduct().getName(),
                            item.getProduct().getPrice(),
                            item.getQuantity())).collect(Collectors.toList());

            orderDTOS.add(new OrderDTO(order.getId(), order.getTotalAmount(), order.getStatus(), order.getOrderDate(), orderItemDTOS));
        }

        return orderDTOS;
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id " + userId + " not found, hence orders could not be retrieved"));

        List<Order> orders = orderRepo.findAllByUser(user);

        List<OrderDTO> orderDTOS = new ArrayList<>();
        for(Order order: orders){
            List<OrderItemDTO> orderItemDTOS = order.getOrderItems()
                    .stream()
                    .map(item -> new OrderItemDTO(
                            item.getProduct().getName(),
                            item.getProduct().getPrice(),
                            item.getQuantity())).collect(Collectors.toList());

            orderDTOS.add(new OrderDTO(order.getId(), order.getTotalAmount(), order.getStatus(), order.getOrderDate(), orderItemDTOS));
        }
        return orderDTOS;
    }

}
