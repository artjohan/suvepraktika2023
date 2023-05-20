package com.cgi.library.service;

import com.cgi.library.entity.CheckOut;
import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.repository.CheckOutRepository;
import com.cgi.library.util.ModelMapperFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Service
public class CheckOutService {

    @Autowired
    private CheckOutRepository checkOutRepository;

    public Page<CheckOutDTO> getCheckOuts(Pageable pageable, String searchTerm, String status) {
        return status == null ? getCheckoutsBySearchTerm(pageable, searchTerm) : getCheckoutsByStatusAndSearchTerm(pageable, searchTerm, status);
    }

    public CheckOutDTO getCheckOut(UUID checkOutId) {
        CheckOut checkOut = checkOutRepository.getOne(checkOutId);
        return ModelMapperFactory.getMapper().map(checkOut, CheckOutDTO.class);
    }

    public void saveCheckOut(CheckOutDTO checkOutDTO) {
        checkOutRepository.save(ModelMapperFactory.getMapper().map(checkOutDTO, CheckOut.class));
    }

    public void updateReturnedDate(UUID checkOutId, String date)  {
        CheckOut checkOut = checkOutRepository.getOne(checkOutId);
        checkOut.setReturnedDate(LocalDate.parse(date));
        checkOutRepository.save(checkOut);
    }

    public void deleteCheckOut(UUID checkOutId) {
        checkOutRepository.deleteById(checkOutId);
    }

    @Transactional
    public void deleteCheckoutsByBookId(UUID bookId) { checkOutRepository.deleteAllByBorrowedBookId(bookId); }

    private Page<CheckOutDTO> getCheckoutsBySearchTerm(Pageable pageable, String searchTerm) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return checkOutRepository.findByBorrowedBookTitleContainingIgnoreCase(searchTerm, pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
    }

    private Page<CheckOutDTO> getCheckoutsByStatusAndSearchTerm(Pageable pageable, String searchTerm, String status) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        LocalDate currentDate = LocalDate.now();
        if(Objects.equals(status, "BORROWED"))  { // finds results where due date is later than or equal to the current date and returned date doesn't exist (book hasn't been returned), also filters by search term
            return checkOutRepository.findByDueDateGreaterThanEqualAndReturnedDateIsNullAndBorrowedBookTitleContainingIgnoreCase(currentDate, searchTerm, pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
        }
        if(Objects.equals(status, "OVERDUE")) { // finds results where due date is earlier than the current date and returned date doesn't exist (book hasn't been returned), also filters by search term
            return checkOutRepository.findByDueDateLessThanAndReturnedDateIsNullAndBorrowedBookTitleContainingIgnoreCase(currentDate, searchTerm, pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
        }
        // finds results where returned date isn't null, meaning the book has been returned, also filters by search term
        return checkOutRepository.findByReturnedDateIsNotNullAndBorrowedBookTitleContainingIgnoreCase(searchTerm, pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
    }

    private Page<CheckOutDTO> getAllCheckouts(Pageable pageable) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return checkOutRepository.findAll(pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
    }
}
