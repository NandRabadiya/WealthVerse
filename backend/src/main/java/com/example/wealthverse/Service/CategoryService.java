package com.example.wealthverse.Service;

import com.example.wealthverse.DTO.EmissionCalculationRequest;
import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.User;

import java.math.BigDecimal;
import java.util.List;

public interface CategoryService {
    void addCustomCategory(String name,String token);
    BigDecimal calculateEmission(EmissionCalculationRequest request);
    List<Category> getAllCategoriesByUserId(Long userId);

}
