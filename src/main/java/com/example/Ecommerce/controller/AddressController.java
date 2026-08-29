package com.example.Ecommerce.controller;

import com.example.Ecommerce.entity.Address;
import com.example.Ecommerce.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {

    private final AddressService addressService;

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/add/{userId}")
    public Address addAddress(@PathVariable Long userId, @Valid @RequestBody Address address) {
        return addressService.addAddress(userId, address);
    }

    @PutMapping("/update/{addressId}")
    public Address updateAddress(@PathVariable Long addressId, @Valid @RequestBody Address address) {
        return addressService.updateAddress(addressId, address);
    }

    @DeleteMapping("/delete/{addressId}")
    public void deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
    }

    @PutMapping("/set-default/{addressId}")
    public void setDefaultAddress(@PathVariable Long addressId) {
        addressService.setDefaultAddress(addressId);
    }

    @GetMapping("/user/{userId}")
    public List<Address> getUserAddresses(@PathVariable Long userId) {
        return addressService.getUserAddresses(userId);
    }

    @GetMapping("/default/{userId}")
    public Address getDefaultAddress(@PathVariable Long userId) {
        return addressService.getDefaultAddress(userId);
    }

    @GetMapping("/{addressId}")
    public Address getAddressById(@PathVariable Long addressId) {
        return addressService.getAddressById(addressId);
    }
}
