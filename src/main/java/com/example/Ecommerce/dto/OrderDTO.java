package com.example.Ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
public class OrderDTO {

    private Long id;

    private Double totalAmount;

    private String status;

    private Date orderDate;

    private String userName;

    private String email;

    private List<OrderItemsDTO> orderItems;

}
