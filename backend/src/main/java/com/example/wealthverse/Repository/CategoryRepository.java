package com.example.wealthverse.Repository;

import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUser(User user);
    List<Category> findByUserId(Long userId);

    List<Category> findByIsGlobalTrue();

    Optional<Category> findByNameAndUser(String name, User user);

    Optional<Category> findByNameAndIsGlobalTrue(String name);

    Optional<Category> findByName(String name);


}
