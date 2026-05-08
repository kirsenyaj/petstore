package com.petstore.controller;

import com.petstore.model.Pet;
import com.petstore.repository.PetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin
public class PetController {

    private final PetRepository petRepository;

    public PetController(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @GetMapping
    public List<Pet> list(@RequestParam(required = false) String type) {
        if (type == null) return petRepository.findAll();
        return petRepository.findByType(type);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> get(@PathVariable Long id) {
        return petRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Note: write endpoints removed - this backend is read-only for pet browsing
}
