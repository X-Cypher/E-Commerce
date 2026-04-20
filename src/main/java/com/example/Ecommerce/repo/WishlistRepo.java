package com.example.Ecommerce.repo;

import com.example.Ecommerce.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface WishlistRepo extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser_Id(Long userId);
    Wishlist findByUser_IdAndProduct_Id(Long userId, Long productId);

    @Transactional
    void deleteByUser_IdAndProduct_Id(Long userId, Long productId);
}
