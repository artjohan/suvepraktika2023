package com.cgi.library.controller;

import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.model.CheckOutStatus;
import com.cgi.library.service.CheckOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/checkout")
public class CheckOutController {

    @Autowired
    private CheckOutService checkOutService;

    @GetMapping(value = "checkouts")
    public ResponseEntity<Page<CheckOutDTO>> getCheckOuts(Pageable pageable,
                                                          @RequestParam(required = false) String search,
                                                          @RequestParam(required = false) CheckOutStatus status) {
        Page<CheckOutDTO> checkouts = checkOutService.getCheckOuts(pageable, search, status);
        return ResponseEntity.ok(checkouts);
    }

    @GetMapping(value = "checkout")
    public ResponseEntity<CheckOutDTO> getCheckOut(@RequestParam(value = "id") UUID checkOutId) {
        return ResponseEntity.ok(checkOutService.getCheckOut(checkOutId));
    }

    @PostMapping(value = "checkout")
    public ResponseEntity<String> saveCheckOut(@RequestBody CheckOutDTO checkOutDTO) {
        checkOutService.saveCheckOut(checkOutDTO);
        return ResponseEntity.ok("");
    }

    @DeleteMapping(value = "checkout")
    public ResponseEntity<String> deleteCheckOut(@RequestParam(value = "id") UUID checkOutId) {
        checkOutService.deleteCheckOut(checkOutId);
        return ResponseEntity.ok("");
    }
}
