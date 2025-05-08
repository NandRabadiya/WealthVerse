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




    @Query(value = "SELECT m FROM MerchantCategoryMapping m " +
            "WHERE m.merchantName = :merchantName " +
            "AND (m.user.id = :userId OR m.user.id = 1) " +
            "ORDER BY CASE WHEN m.user.id = :userId THEN 0 ELSE 1 END " +
            "LIMIT 1")
    Optional<MerchantCategoryMapping> findBestMapping(
            @Param("merchantName") String merchantName,
            @Param("userId") Long userId);

}