package com.cgi.library.repository;

import com.cgi.library.entity.CheckOut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface CheckOutRepository extends JpaRepository<CheckOut, UUID> {
    Page<CheckOut> findByBorrowedBookTitleContainingIgnoreCase(String searchTerm, Pageable pageable);
    Page<CheckOut> findByReturnedDateIsNotNullAndBorrowedBookTitleContainingIgnoreCase(String searchTerm, Pageable pageable);
    Page<CheckOut> findByDueDateGreaterThanEqualAndReturnedDateIsNullAndBorrowedBookTitleContainingIgnoreCase(LocalDate currentDate, String searchTerm, Pageable pageable);
    Page<CheckOut> findByDueDateLessThanAndReturnedDateIsNullAndBorrowedBookTitleContainingIgnoreCase(LocalDate currentDate, String searchTerm, Pageable pageable);
}
