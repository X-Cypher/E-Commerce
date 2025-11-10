package com.example.Ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference //user will manage serialization
    private User user;

    private Double totalAmount;

    private String status;

    private Date orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL) //order delete toh orderItems bhi delete ho jayenge
    private List<OrderItem> orderItems;
}
