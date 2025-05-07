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


//    @PostMapping("/add")
//    public ResponseEntity<CategoryMappingResponseDTO> addCategoryAndMapping(
//            @RequestParam String categoryName,
//            @RequestParam String merchantName,
//            @RequestParam boolean isGlobal,
//            @AuthenticationPrincipal User currentUser
//    ) {
//        // Category creation
//        Category category = categoryServiceImpl.addCustomCategory(categoryName, isGlobal, isGlobal ? null : currentUser);
//
//        // Mapping creation
//
//        MerchantCategoryMapping mapping = mappingService.addCustomMapping(
//                merchantName, isGlobal, isGlobal ? null : currentUser, category
//        );
//
//        // Prepare response
//        CategoryMappingResponseDTO response = new CategoryMappingResponseDTO(
//                category.getId(),
//                category.getName(),
//                category.isGlobal(),
//                mapping.getId(),
//                mapping.getMerchantName(),
//                mapping.isGlobalMapping(),
//                "Category and Mapping added successfully"
//        );
//
//        return ResponseEntity.ok(response);
//    }


    @PostMapping("/mappings/custom")
    public ResponseEntity<Void> addCustomMapping(
            @RequestParam String merchantName,
            @RequestParam Long categoryId,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = jwtService.getUserIdFromToken(authHeader);

        mappingService.addCustomMapping(merchantName, userId, categoryId);

        return ResponseEntity.status(HttpStatus.CREATED).build(); // 201 Created with no body
    }


}
