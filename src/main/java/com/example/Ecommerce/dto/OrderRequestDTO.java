package com.example.Ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class OrderRequestDTO {

    private Map<Long, Integer> productQuantity;

    private Double totalAmount;
}
