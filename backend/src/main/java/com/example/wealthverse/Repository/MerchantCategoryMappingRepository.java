package com.example.wealthverse.Repository;

import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface MerchantCategoryMappingRepository extends JpaRepository<MerchantCategoryMapping, Long> {

    List<MerchantCategoryMapping> findByUser(User user);

    List<MerchantCategoryMapping> findByIsGlobalMappingTrue();

    Optional<MerchantCategoryMapping> findByMerchantNameAndUser(String merchantName, User user);

    Optional<MerchantCategoryMapping> findByMerchantNameAndIsGlobalMappingTrue(String merchantName);

    List<MerchantCategoryMapping> findByCategory(Category category);

    Optional<MerchantCategoryMapping> findByUserIdAndMerchantName(Long userId, String merchantName);

    /**
     * Find the best mapping for a merchant name and user ID.
     * Prioritizes user-specific mappings over global mappings.
     * Returns only the first (best) match to avoid non-unique result errors.
     */
    @Query("""
    SELECT m FROM MerchantCategoryMapping m 
    WHERE m.merchantName IN (:merchantName, 'MISCELLANEOUS') 
      AND (m.user.id = :userId OR m.isGlobalMapping = true)
    ORDER BY 
      CASE WHEN m.merchantName = :merchantName AND m.user.id = :userId THEN 1
           WHEN m.merchantName = :merchantName AND m.isGlobalMapping = true THEN 2
           WHEN m.merchantName = 'MISCELLANEOUS' AND m.user.id = :userId THEN 3
           WHEN m.merchantName = 'MISCELLANEOUS' AND m.isGlobalMapping = true THEN 4
      END
    """)
    List<MerchantCategoryMapping> findAllMappingsOrdered(@Param("merchantName") String merchantName, @Param("userId") Long userId);

    /**
     * Find the best mapping for a merchant name and user ID by selecting
     * the first result from the ordered list.
     */
    default Optional<MerchantCategoryMapping> findBestMapping(String merchantName, Long userId) {
        List<MerchantCategoryMapping> mappings = findAllMappingsOrdered(merchantName, userId);
        return mappings.isEmpty() ? Optional.empty() : Optional.of(mappings.get(0));
    }

    /**
     * Find all global mappings (for emission calculation requirements)
     */
    @Query("SELECT m FROM MerchantCategoryMapping m WHERE m.isGlobalMapping = true")
    List<MerchantCategoryMapping> findAllGlobalMappings();

    /**
     * Check if a merchant has a global mapping
     */
    @Query("SELECT COUNT(m) > 0 FROM MerchantCategoryMapping m WHERE m.merchantName = :merchantName AND m.isGlobalMapping = true")
    boolean hasGlobalMapping(@Param("merchantName") String merchantName);
}