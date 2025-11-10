package com.example.Ecommerce.repo;

import com.example.Ecommerce.entity.Order;
import com.example.Ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findAllByUser(User user); //findByUser will also return the same result
}
