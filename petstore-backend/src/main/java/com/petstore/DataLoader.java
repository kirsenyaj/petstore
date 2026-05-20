package com.petstore;

import com.petstore.model.Pet;
import com.petstore.repository.PetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final PetRepository petRepository;

    public DataLoader(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (petRepository.count() == 0) {
            petRepository.save(new Pet("Buddy", "dog", "Japanese Spitz", 799.0));
            petRepository.save(new Pet("Mittens", "cat", "Sphynx", 399.0));
            petRepository.save(new Pet("Polly", "bird", "Parrot", 149.0));
            petRepository.save(new Pet("Slinky", "reptile", "Iguana", 199.0));
            petRepository.save(new Pet("Goldie", "fish", "Goldfish", 9.99));
        }
    }
}
