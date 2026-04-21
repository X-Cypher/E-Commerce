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

    private String id;

    private Double totalAmount;

    private String status;

    private Date orderDate;

    private List<OrderItemDTO> orderItems;

}
