package com.example.Ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderItemsDTO {

    private String productName;

    private Double productPrice;

    private int quantity;

    public OrderItemsDTO(String productName, Double productPrice, int quantity) {
        this.productName = productName;
        this.productPrice = productPrice;
        this.quantity = quantity;
    }

}
