package com.example.Ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String phoneNo;

    @Column(unique = true)
    private String email;

    private String password;

    private String address;

    @JsonIgnore //means orders ko serialize mat kro jab user ki baat ho
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL) //user field in the order entity will manage the relationship
    private List<Order> orders;
}
