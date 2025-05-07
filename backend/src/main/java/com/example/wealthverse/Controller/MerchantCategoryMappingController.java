package com.example.wealthverse.Controller;

import com.example.wealthverse.DTO.CategoryMappingResponseDTO;
import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.UserRepository;
import com.example.wealthverse.Service.CategoryService;
import com.example.wealthverse.Service.Impl.CategoryServiceImpl;
import com.example.wealthverse.Service.Impl.MerchantCategoryMappingServiceImpl;
import com.example.wealthverse.Service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category-mapping")
public class MerchantCategoryMappingController {


    @Autowired
    private MerchantCategoryMappingServiceImpl mappingService;

    @Autowired
    private JWTService jwtService;



    @PostMapping("/mappings/custom")
    public ResponseEntity<Void> addCustomMapping(
            @RequestParam String merchantName,
            @RequestParam String categoryName,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = jwtService.getUserIdFromToken(authHeader);

        mappingService.addCustomMapping(merchantName, userId, categoryName);

        return ResponseEntity.status(HttpStatus.CREATED).build(); // 201 Created with no body
    }


}
