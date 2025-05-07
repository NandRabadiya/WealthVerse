package com.example.wealthverse.Interface;

import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.User;

public interface MerchantCategoryMappingService {
    MerchantCategoryMapping addCustomMapping(String merchantName, boolean isGlobalMapping, User user, Category category);
}
