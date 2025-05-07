package com.example.wealthverse.Controller;

import com.example.wealthverse.DTO.EmissionCalculationRequest;
import com.example.wealthverse.Service.CategoryService;
import com.example.wealthverse.Service.Impl.CategoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("api/category")
public class CategoryController {


    @Autowired
    private CategoryService categoryService;


    @PostMapping("/calculate")
    public BigDecimal calculateEmission(@RequestBody EmissionCalculationRequest request) {
        return categoryService.calculateEmission(request);
    }

    @PostMapping("/custom")
    public ResponseEntity<String> addCustomCategory(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody String category) {

        categoryService.addCustomCategory(category, authHeader);
        return ResponseEntity.status(HttpStatus.CREATED).body("Category created successfully");

    }

}
