package com.example.Ecommerce.controller;

import com.example.Ecommerce.entity.Wishlist;
import com.example.Ecommerce.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin("*")
public class WishlistController {

    private final WishlistService wishlistService;

    @Autowired
    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/add/{userId}/{productId}")
    public Wishlist addToWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        return wishlistService.addToWishlist(userId, productId);
    }

    @GetMapping("/user/{userId}")
    public List<Wishlist> getUserWishlist(@PathVariable Long userId) {
        return wishlistService.getUserWishlist(userId);
    }

    @DeleteMapping("/remove/{userId}/{productId}")
    public void removeFromWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userId, productId);
    }
}
