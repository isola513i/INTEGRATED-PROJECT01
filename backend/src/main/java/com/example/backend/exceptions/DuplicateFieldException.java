package com.example.backend.exceptions;

public class DuplicateFieldException extends RuntimeException {
    private final String field;
    private final String value;

    public DuplicateFieldException(String field, String value) {
        super(field + " '" + value + "' already exists");
        this.field = field;
        this.value = value;
    }
    public String getField() { return field; }
    public String getValue() { return value; }

}
