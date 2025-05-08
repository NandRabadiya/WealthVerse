package com.example.wealthverse.Exception;

public class CSVParsingException extends RuntimeException {
    public CSVParsingException(String message) {
        super(message);
    }

    public CSVParsingException(String message, Throwable cause) {
        super(message, cause);
    }
}