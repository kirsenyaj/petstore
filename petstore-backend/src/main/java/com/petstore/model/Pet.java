package com.petstore.model;

import jakarta.persistence.*;

@Entity
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // dog, cat, bird, reptile, fish
    private String breed;
    private Double price;

    public Pet() {}

    public Pet(String name, String type, String breed, Double price) {
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.price = price;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
