package com.example.wealthverse.Service;

import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.User;

public interface MerchantCategoryMappingService {
    MerchantCategoryMapping addCustomMapping(String merchantName, long user, String categoryName);
}
