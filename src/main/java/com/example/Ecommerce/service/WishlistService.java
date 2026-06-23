package com.example.Ecommerce.service;

import com.example.Ecommerce.entity.Wishlist;
import com.example.Ecommerce.repo.ProductRepo;
import com.example.Ecommerce.repo.UserRepo;
import com.example.Ecommerce.repo.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepo wishlistRepo;
    private final UserRepo userRepo;
    private final ProductRepo productRepo;

    @Autowired
    public WishlistService(WishlistRepo wishlistRepo, UserRepo userRepo, ProductRepo productRepo) {
        this.wishlistRepo = wishlistRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepo.findByUser_Id(userId);
    }

    public Wishlist addToWishlist(Long userId, Long productId) {
        Wishlist existing = wishlistRepo.findByUser_IdAndProduct_Id(userId, productId);
        if (existing != null) {
            return existing;
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
        wishlist.setProduct(productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found")));
        return wishlistRepo.save(wishlist);
    }

    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepo.deleteByUser_IdAndProduct_Id(userId, productId);
    }
}
