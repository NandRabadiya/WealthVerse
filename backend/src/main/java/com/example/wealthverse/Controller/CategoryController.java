package com.example.wealthverse.Controller;

import com.example.wealthverse.Model.Category;
import com.example.wealthverse.DTO.EmissionCalculationRequest;
import com.example.wealthverse.Service.CategoryService;
import com.example.wealthverse.Service.Impl.CategoryServiceImpl;
import com.example.wealthverse.Service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
public class CategoryController {


    @Autowired
    private CategoryService categoryService;

    @Autowired
    private JWTService jwtService;

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

    @GetMapping("/user")
    public List<Category> getCategoriesByUserId(@RequestHeader("Authorization") String token) {

        Long userId= jwtService.getUserIdFromToken(token);

        return categoryService.getAllCategoriesByUserId(userId);
    }

}
