package com.chinggizz.service;

import com.chinggizz.dto.HamperBoxDTO;
import com.chinggizz.entity.HamperBox;
import com.chinggizz.exception.ResourceNotFoundException;
import com.chinggizz.repository.HamperBoxRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HamperBoxService {
    
    private final HamperBoxRepository hamperBoxRepository;
    
    @Cacheable(value = "hamperBoxes", unless = "#result.isEmpty()")
    public List<HamperBoxDTO> getAllActiveHamperBoxes() {
        return hamperBoxRepository.findByActiveTrueOrderByPriceAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HamperBoxDTO getHamperBoxById(Long id) {
        HamperBox hamperBox = hamperBoxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HamperBox", "id", id));
        return convertToDTO(hamperBox);
    }

    @Transactional
    @CacheEvict(value = "hamperBoxes", allEntries = true)
    public HamperBoxDTO createHamperBox(HamperBoxDTO hamperBoxDTO) {
        HamperBox hamperBox = HamperBox.builder()
                .name(hamperBoxDTO.getName())
                .description(hamperBoxDTO.getDescription())
                .size(hamperBoxDTO.getSize())
                .price(hamperBoxDTO.getPrice())
                .maxItems(hamperBoxDTO.getMaxItems())
                .imageUrl(hamperBoxDTO.getImageUrl())
                .active(true)
                .build();
        
        HamperBox saved = hamperBoxRepository.save(hamperBox);
        return convertToDTO(saved);
    }
    
    @Transactional
    @CacheEvict(value = "hamperBoxes", allEntries = true)
    public HamperBoxDTO updateHamperBox(Long id, HamperBoxDTO hamperBoxDTO) {
        HamperBox hamperBox = hamperBoxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HamperBox", "id", id));

        hamperBox.setName(hamperBoxDTO.getName());
        hamperBox.setDescription(hamperBoxDTO.getDescription());
        hamperBox.setSize(hamperBoxDTO.getSize());
        hamperBox.setPrice(hamperBoxDTO.getPrice());
        hamperBox.setMaxItems(hamperBoxDTO.getMaxItems());
        hamperBox.setImageUrl(hamperBoxDTO.getImageUrl());
        hamperBox.setActive(hamperBoxDTO.getActive());

        HamperBox updated = hamperBoxRepository.save(hamperBox);
        return convertToDTO(updated);
    }

    @Transactional
    @CacheEvict(value = "hamperBoxes", allEntries = true)
    public void deleteHamperBox(Long id) {
        HamperBox hamperBox = hamperBoxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HamperBox", "id", id));
        hamperBox.setActive(false);
        hamperBoxRepository.save(hamperBox);
    }
    
    private HamperBoxDTO convertToDTO(HamperBox hamperBox) {
        return HamperBoxDTO.builder()
                .id(hamperBox.getId())
                .name(hamperBox.getName())
                .description(hamperBox.getDescription())
                .size(hamperBox.getSize())
                .price(hamperBox.getPrice())
                .maxItems(hamperBox.getMaxItems())
                .imageUrl(hamperBox.getImageUrl())
                .active(hamperBox.getActive())
                .lengthCm(hamperBox.getLengthCm())
                .widthCm(hamperBox.getWidthCm())
                .heightCm(hamperBox.getHeightCm())
                .gridRows(hamperBox.getGridRows())
                .gridCols(hamperBox.getGridCols())
                .createdAt(hamperBox.getCreatedAt())
                .updatedAt(hamperBox.getUpdatedAt())
                .build();
    }
}

