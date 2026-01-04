package com.example.demo.controller;
import com.example.demo.model.Order;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    public OrderController(OrderRepository orderRepo, UserRepository userRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
    }

    // Get orders by user
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderRepo.findByUserId(userId);
    }

    // Create order for user
    @PostMapping("/user/{userId}")
    public Order createOrder(
            @PathVariable Long userId,
            @RequestBody Order order) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        order.setUser(user);
        return orderRepo.save(order);
    }

    @PostMapping
    public Order createOrder(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String product = body.get("productName").toString();
        double price = Double.parseDouble(body.get("price").toString());

        User user = this.userRepo.findById(userId).orElseThrow();
        Order order = new Order();
        order.setProductName(product);
        order.setPrice(price);
        order.setUser(user);

        return this.orderRepo.save(order);
    }


    // Delete order
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepo.deleteById(id);
    }
}

