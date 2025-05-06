package com.example.wealthverse.Repository;

import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantCategoryMappingRepository extends JpaRepository<MerchantCategoryMapping, Long> {

    List<MerchantCategoryMapping> findByUser(User user);

    List<MerchantCategoryMapping> findByIsGlobalMappingTrue();

    Optional<MerchantCategoryMapping> findByMerchantNameAndUser(String merchantName, User user);

    Optional<MerchantCategoryMapping> findByMerchantNameAndIsGlobalMappingTrue(String merchantName);

    List<MerchantCategoryMapping> findByCategory(Category category);
}
