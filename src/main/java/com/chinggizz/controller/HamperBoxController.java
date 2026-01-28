package com.chinggizz.controller;

import com.chinggizz.dto.HamperBoxDTO;
import com.chinggizz.service.HamperBoxService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hamper-boxes")
@RequiredArgsConstructor
public class HamperBoxController {
    
    private final HamperBoxService hamperBoxService;

    @GetMapping
    public ResponseEntity<List<HamperBoxDTO>> getAllActiveHamperBoxes() {
        List<HamperBoxDTO> hamperBoxes = hamperBoxService.getAllActiveHamperBoxes();
        return ResponseEntity.ok(hamperBoxes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HamperBoxDTO> getHamperBoxById(@PathVariable Long id) {
        HamperBoxDTO hamperBox = hamperBoxService.getHamperBoxById(id);
        return ResponseEntity.ok(hamperBox);
    }
    
    // Admin endpoints
    @PostMapping
    public ResponseEntity<HamperBoxDTO> createHamperBox(@RequestBody HamperBoxDTO hamperBoxDTO) {
        HamperBoxDTO created = hamperBoxService.createHamperBox(hamperBoxDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HamperBoxDTO> updateHamperBox(@PathVariable Long id, @RequestBody HamperBoxDTO hamperBoxDTO) {
        HamperBoxDTO updated = hamperBoxService.updateHamperBox(id, hamperBoxDTO);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHamperBox(@PathVariable Long id) {
        hamperBoxService.deleteHamperBox(id);
        return ResponseEntity.noContent().build();
    }
}

