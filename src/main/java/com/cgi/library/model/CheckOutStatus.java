package com.cgi.library.model;

public enum CheckOutStatus {

    BORROWED("BORROWED"), // book has been checked out but not past due date
    OVERDUE("OVERDUE"), // book has been checked out and is overdue
    RETURNED("RETURNED"); // book has been returned
    private String value;
    private CheckOutStatus(String value) {
        this.value = value;
    }
}
