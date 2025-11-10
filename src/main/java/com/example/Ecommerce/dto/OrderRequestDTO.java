package com.example.Ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class OrderRequestDTO {

    //product id and quantity
    private Map<Long, Integer> productQuantities;

    private Double totalAmount;
}
