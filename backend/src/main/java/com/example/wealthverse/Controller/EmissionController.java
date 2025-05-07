package com.example.wealthverse.Controller;


import com.example.wealthverse.DTO.EmissionCalculationRequest;
import com.example.wealthverse.Service.Impl.CategoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/emission")
public class EmissionController {

    @Autowired
    private CategoryServiceImpl categoryServiceImpl;


    @PostMapping("/calculate")
    public BigDecimal calculateEmission(@RequestBody EmissionCalculationRequest request) {
        return categoryServiceImpl.calculateEmission(request);
    }

}

