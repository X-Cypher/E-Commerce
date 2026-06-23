package com.example.Ecommerce.dto;

import com.example.Ecommerce.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PaymentUpdateRequest {

    private String orderId;
    private String status;
    private List<OrderItem> orderItems;

}
