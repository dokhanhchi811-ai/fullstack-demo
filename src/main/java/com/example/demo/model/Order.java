package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private Double price;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Order() {}

    public Order(String productName, Double price, User user) {
        this.productName = productName;
        this.price = price;
        this.user = user;
        
    }

    // getters & setters
    public Long getId() { return id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
