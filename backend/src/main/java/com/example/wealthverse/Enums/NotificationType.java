package com.example.wealthverse.Enums;

public enum NotificationType {
    TRANSACTION_ADDED,       // When a new transaction is recorded
    CATEGORY_UPDATED,        // When the category of a transaction is updated
    MONTHLY_REPORT_READY,    // Monthly summary (expenses & emissions)
    BUDGET_LIMIT_EXCEEDED,   // When spending crosses a set budget
    SYSTEM_ALERT             // General system-related notifications
}
