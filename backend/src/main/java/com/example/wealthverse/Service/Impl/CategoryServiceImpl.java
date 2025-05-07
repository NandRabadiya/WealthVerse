package com.example.wealthverse.Service.Impl;

import com.example.wealthverse.DTO.EmissionCalculationRequest;
import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.CategoryRepository;
import com.example.wealthverse.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;


    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category addCustomCategory(String name, boolean isGlobal, User user) {
        Category category = new Category();
        category.setName(name);
        category.setGlobal(isGlobal);
        category.setUser(user); // null if global
        category.setCreatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }


@Override
    public BigDecimal calculateEmission(EmissionCalculationRequest request) {
        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + request.getCategoryName()));

        BigDecimal emissionFactor = category.getEmissionFactor();
        BigDecimal amount = request.getAmountSpent();


        return emissionFactor.multiply(amount);
    }
}
