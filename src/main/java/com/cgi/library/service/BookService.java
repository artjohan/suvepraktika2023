package com.cgi.library.service;

import com.cgi.library.entity.Book;
import com.cgi.library.model.BookDTO;
import com.cgi.library.model.BookStatus;
import com.cgi.library.repository.BookRepository;
import com.cgi.library.util.ModelMapperFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Page<BookDTO> getBooks(Pageable pageable, String searchTerm) {
        return searchTerm == null ? getAllBooks(pageable) : getBooksBySearchTerm(pageable, searchTerm);
    }

    public BookDTO getBook(UUID bookId) {
        Book book = bookRepository.getOne(bookId);
        return ModelMapperFactory.getMapper().map(book, BookDTO.class);
    }

    public UUID saveBook(BookDTO bookDTO) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return bookRepository.save(modelMapper.map(bookDTO, Book.class)).getId();
    }

    public void updateStatus(UUID bookId, BookStatus newStatus, String date)  {
        if(date == null) {
            updateToAvailable(bookId, newStatus);
        } else {
            updateToBorrowed(bookId, newStatus, date);
        }
    }

    public void deleteBook(UUID bookId) {
        bookRepository.deleteById(bookId);
    }

    private void updateToBorrowed(UUID bookId, BookStatus newStatus, String date) {
        Book book = bookRepository.getOne(bookId);
        book.setStatus(newStatus);
        book.setCheckOutCount(book.getCheckOutCount()+1);
        book.setDueDate(LocalDate.parse(date));
        bookRepository.save(book);
    }

    private void updateToAvailable(UUID bookId, BookStatus newStatus) {
        Book book = bookRepository.getOne(bookId);
        book.setStatus(newStatus);
        book.setDueDate(null);
        bookRepository.save(book);
    }

    private Page<BookDTO> getBooksBySearchTerm(Pageable pageable, String searchTerm) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return bookRepository.findByTitleContainingIgnoreCase(searchTerm, pageable).map(book -> modelMapper.map(book, BookDTO.class));
    }

    private Page<BookDTO> getAllBooks(Pageable pageable) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return bookRepository.findAll(pageable).map(book -> modelMapper.map(book, BookDTO.class));
    }
}
