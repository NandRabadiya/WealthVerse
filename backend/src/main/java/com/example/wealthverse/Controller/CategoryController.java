package com.example.wealthverse.Controller;

import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Service.CategoryService;
import com.example.wealthverse.Service.Impl.CategoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryServiceImpl categoryServiceImpl;

    @Autowired
    public CategoryController(CategoryServiceImpl categoryServiceImpl) {
        this.categoryServiceImpl = categoryServiceImpl;
    }

    @GetMapping("/user/{userId}")
    public List<Category> getCategoriesByUserId(@PathVariable Long userId) {
        return categoryServiceImpl.getAllCategoriesByUserId(userId);
    }
}
