package com.example.wealthverse.Service;

import com.example.wealthverse.DTO.EmissionCalculationRequest;
import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.User;

import java.math.BigDecimal;

public interface CategoryService {
    Category addCustomCategory(String name, boolean isGlobal, User user);
    BigDecimal calculateEmission(EmissionCalculationRequest request);
}
