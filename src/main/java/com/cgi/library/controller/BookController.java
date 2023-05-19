package com.cgi.library.controller;

import com.cgi.library.model.BookDTO;
import com.cgi.library.model.BookStatus;
import com.cgi.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/book")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping(value = "books")
    public ResponseEntity<Page<BookDTO>> getBooks(Pageable pageable,
                                                  @RequestParam(required = false) String search,
                                                  @RequestParam(required = false) BookStatus status)
    {
        Page<BookDTO> books = bookService.getBooks(pageable, search, status);
        return ResponseEntity.ok(books);
    }

    @GetMapping(value = "book")
    public ResponseEntity<BookDTO> getBook(@RequestParam(value = "id") UUID bookId) {
        return ResponseEntity.ok(bookService.getBook(bookId));
    }

    @PatchMapping(value = "book")
    public ResponseEntity<String> updateBookStatus(@RequestParam(value = "id") UUID bookId,
                                                   @RequestParam(value = "status") BookStatus newStatus,
                                                   @RequestParam(required = false) String date)
    {
        bookService.updateStatus(bookId, newStatus, date);
        return ResponseEntity.ok("");
    }

    @PostMapping(value = "book")
    public ResponseEntity<String> saveBook(@RequestBody BookDTO book) {
        return ResponseEntity.ok(String.valueOf(bookService.saveBook(book)));
    }

    @DeleteMapping(value = "book")
    public ResponseEntity<String> deleteBook(@RequestParam(value = "id") UUID bookId) {
        bookService.deleteBook(bookId);
        return ResponseEntity.ok("");
    }
}
