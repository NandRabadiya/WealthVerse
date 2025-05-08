package com.example.wealthverse.Service.Impl;

import com.example.wealthverse.DTO.CategoryResponseDTO;
import com.example.wealthverse.DTO.EmissionCalculationRequest;
import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.CategoryRepository;
import com.example.wealthverse.Repository.UserRepository;
import com.example.wealthverse.Service.CategoryService;
import com.example.wealthverse.Service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final UserRepository userRepository;

    private final JWTService jwtService;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, UserRepository userRepository, JWTService jwtService) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void addCustomCategory(String name, String token) {

        User user = userRepository.getById(jwtService.getUserIdFromToken(token));
        Category category = new Category();
        category.setName(name);
        category.setGlobal(false);
        category.setUser(user); // null if global
        category.setCreatedAt(LocalDateTime.now());
        category.setEmissionFactor(BigDecimal.ZERO);

      try {
          categoryRepository.save(category);
      }catch (Exception e){
          throw new IllegalStateException("Failed to save category", e);
      }


    }


@Override
    public BigDecimal calculateEmission(EmissionCalculationRequest request) {
        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + request.getCategoryName()));

        BigDecimal emissionFactor = category.getEmissionFactor();
        BigDecimal amount = request.getAmountSpent();


        return emissionFactor.multiply(amount);
    }

    @Override
    public List<CategoryResponseDTO> getAllCategoriesByUserId(Long userId) {
        List<Category> categories = categoryRepository.findByUserId(userId);
        return categories.stream()
                .map(category -> {
                    CategoryResponseDTO dto = new CategoryResponseDTO();
                    dto.setId(category.getId());
                    dto.setName(category.getName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
