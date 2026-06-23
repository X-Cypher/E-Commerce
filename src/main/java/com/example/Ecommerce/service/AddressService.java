package com.example.Ecommerce.service;

import com.example.Ecommerce.entity.Address;
import com.example.Ecommerce.entity.User;
import com.example.Ecommerce.repo.AddressRepo;
import com.example.Ecommerce.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    private final AddressRepo addressRepo;
    private final UserRepo userRepo;

    @Autowired
    public AddressService(AddressRepo addressRepo, UserRepo userRepo) {
        this.addressRepo = addressRepo;
        this.userRepo = userRepo;
    }

    public Address addAddress(Long userId, Address address) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        address.setUser(user);
        
        // If this is the first address, make it default
        List<Address> existingAddresses = addressRepo.findByUser(user);
        if (existingAddresses.isEmpty()) {
            address.setIsDefault(true);
        }
        
        return addressRepo.save(address);
    }

    public Address updateAddress(Long addressId, Address address) {
        Address existingAddress = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        existingAddress.setAddressLine1(address.getAddressLine1());
        existingAddress.setAddressLine2(address.getAddressLine2());
        existingAddress.setCity(address.getCity());
        existingAddress.setState(address.getState());
        existingAddress.setZipCode(address.getZipCode());
        existingAddress.setCountry(address.getCountry());
        existingAddress.setPhone(address.getPhone());
        
        return addressRepo.save(existingAddress);
    }

    public void deleteAddress(Long addressId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // If deleting default address, set another address as default
        if (address.getIsDefault()) {
            List<Address> userAddresses = addressRepo.findByUser(address.getUser());
            if (userAddresses.size() > 1) {
                Address newDefault = userAddresses.stream()
                        .filter(a -> !a.getId().equals(addressId))
                        .findFirst()
                        .orElse(null);
                if (newDefault != null) {
                    newDefault.setIsDefault(true);
                    addressRepo.save(newDefault);
                }
            }
        }
        
        addressRepo.delete(address);
    }

    public void setDefaultAddress(Long addressId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // Remove default from all addresses of this user
        List<Address> userAddresses = addressRepo.findByUser(address.getUser());
        userAddresses.forEach(a -> a.setIsDefault(false));
        addressRepo.saveAll(userAddresses);
        
        // Set new default
        address.setIsDefault(true);
        addressRepo.save(address);
    }

    public List<Address> getUserAddresses(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return addressRepo.findByUser(user);
    }

    public Address getDefaultAddress(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return addressRepo.findByUserAndIsDefaultTrue(user).orElse(null);
    }

    public Address getAddressById(Long addressId) {
        return addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
    }
}
