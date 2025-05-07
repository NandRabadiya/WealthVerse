package com.example.wealthverse.Repository;

import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    Optional<MerchantCategoryMapping> findByUserIdAndMerchantName(Long userId, String merchantName);


    @Query("""
    SELECT m FROM MerchantCategoryMapping m 
    WHERE m.merchantName IN (:merchantName, 'MISCELLANEOUS') 
      AND (m.user.id = :userId OR m.isGlobalMapping = true)
    ORDER BY 
      CASE WHEN m.merchantName = :merchantName AND m.user.id = :userId THEN 1
           WHEN m.merchantName = :merchantName AND m.isGlobalMapping = true THEN 2
           WHEN m.merchantName = 'MISCELLANEOUS' THEN 3
      END
""")
    Optional<MerchantCategoryMapping> findBestMapping(@Param("merchantName") String merchantName, @Param("userId") Long userId);




}
