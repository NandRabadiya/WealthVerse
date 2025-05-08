package com.example.wealthverse.Service.Impl;

import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.CategoryRepository;
import com.example.wealthverse.Repository.MerchantCategoryMappingRepository;
import com.example.wealthverse.Repository.UserRepository;
import com.example.wealthverse.Service.MerchantCategoryMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MerchantCategoryMappingServiceImpl implements MerchantCategoryMappingService {

    private final MerchantCategoryMappingRepository mappingRepository;

    private  final UserRepository userRepository;

    private  final CategoryRepository categoryRepository;

    @Autowired
    public MerchantCategoryMappingServiceImpl(MerchantCategoryMappingRepository mappingRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public MerchantCategoryMapping addCustomMapping(String merchantName,long userId, String categoryName) {
        MerchantCategoryMapping mapping = new MerchantCategoryMapping();
        mapping.setMerchantName(merchantName.toUpperCase());
        mapping.setIsGlobalMapping(false);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found with id: " + userId));

        mapping.setUser(user); // null if global

        Category category = categoryRepository.findByName(categoryName.toUpperCase())
                .orElseThrow(() -> new IllegalStateException("Category not found with Name: " + categoryName));

        mapping.setCategory(category);
        mapping.setCreatedAt(LocalDateTime.now());
        return mappingRepository.save(mapping);

    }


}
