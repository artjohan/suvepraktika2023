package com.cgi.library.service;

import com.cgi.library.entity.CheckOut;
import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.model.CheckOutStatus;
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

    public Page<CheckOutDTO> getCheckOuts(Pageable pageable, String searchTerm, CheckOutStatus status) {
        return status == null ? getCheckoutsBySearchTerm(pageable, searchTerm) : getCheckoutsByStatusAndSearchTerm(pageable, searchTerm, status);
    }

    public CheckOutDTO getCheckOut(UUID checkOutId) {
        CheckOut checkOut = checkOutRepository.getOne(checkOutId);
        return ModelMapperFactory.getMapper().map(checkOut, CheckOutDTO.class);
    }

    public void saveCheckOut(CheckOutDTO checkOutDTO) {
        checkOutRepository.save(ModelMapperFactory.getMapper().map(checkOutDTO, CheckOut.class));
    }

    public void deleteCheckOut(UUID checkOutId) {
        checkOutRepository.deleteById(checkOutId);
    }

    private Page<CheckOutDTO> getCheckoutsBySearchTerm(Pageable pageable, String searchTerm) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return checkOutRepository.findByBorrowedBookTitleContainingIgnoreCase(searchTerm, pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
    }

    private Page<CheckOutDTO> getCheckoutsByStatusAndSearchTerm(Pageable pageable, String searchTerm, CheckOutStatus status) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        LocalDate currentDate = LocalDate.now();
        switch(status) {
            case OVERDUE: // finds results where due date is earlier than the current date and returned date doesn't exist (book hasn't been returned), also filters by search term
                return checkOutRepository.findByDueDateLessThanAndReturnedDateIsNullAndBorrowedBookTitleContainingIgnoreCase(currentDate, searchTerm, pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
            case BORROWED: // finds results where due date is later than or equal to the current date and returned date doesn't exist (book hasn't been returned), also filters by search term
                return checkOutRepository.findByDueDateGreaterThanEqualAndReturnedDateIsNullAndBorrowedBookTitleContainingIgnoreCase(currentDate, searchTerm, pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
            default: // finds results where returned date isn't null, meaning the book has been returned, also filters by search term
                return checkOutRepository.findByReturnedDateIsNotNullAndBorrowedBookTitleContainingIgnoreCase(searchTerm, pageable).map(checkout -> modelMapper.map(checkout, CheckOutDTO.class));
        }
    }
}
