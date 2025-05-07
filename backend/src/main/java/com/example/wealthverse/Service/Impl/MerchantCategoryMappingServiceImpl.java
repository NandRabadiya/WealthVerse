package com.example.wealthverse.Service.Impl;

import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.MerchantCategoryMappingRepository;
import com.example.wealthverse.Service.MerchantCategoryMappingService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MerchantCategoryMappingServiceImpl implements MerchantCategoryMappingService {

    private final MerchantCategoryMappingRepository mappingRepository;

    public MerchantCategoryMappingServiceImpl(MerchantCategoryMappingRepository mappingRepository) {
        this.mappingRepository = mappingRepository;
    }

    @Override
    public MerchantCategoryMapping addCustomMapping(String merchantName, boolean isGlobalMapping, User user, Category category) {
        MerchantCategoryMapping mapping = new MerchantCategoryMapping();
        mapping.setMerchantName(merchantName);
        mapping.setGlobalMapping(isGlobalMapping);
        mapping.setUser(user); // null if global
        mapping.setCategory(category);
        mapping.setCreatedAt(LocalDateTime.now());
        return mappingRepository.save(mapping);
    }
}
