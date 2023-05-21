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

    public Page<BookDTO> getBooks(Pageable pageable, String searchTerm, BookStatus status) {
        return status == null ? getBooksBySearchTerm(pageable, searchTerm) : getBooksByStatusAndSearchTerm(pageable, searchTerm, status);
    }

    public BookDTO getBook(UUID bookId) {
        Book book = bookRepository.getOne(bookId);
        return ModelMapperFactory.getMapper().map(book, BookDTO.class);
    }

    public void saveBook(BookDTO bookDTO) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        bookRepository.save(modelMapper.map(bookDTO, Book.class));
    }

    public void deleteBook(UUID bookId) {
        bookRepository.deleteById(bookId);
    }

    private Page<BookDTO> getBooksBySearchTerm(Pageable pageable, String searchTerm) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return bookRepository.findByTitleContainingIgnoreCase(searchTerm, pageable).map(book -> modelMapper.map(book, BookDTO.class));
    }

    private Page<BookDTO> getBooksByStatusAndSearchTerm(Pageable pageable, String searchTerm, BookStatus status) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return bookRepository.findByStatusAndTitleContainingIgnoreCase(status, searchTerm, pageable).map(book -> modelMapper.map(book, BookDTO.class));
    }
}
