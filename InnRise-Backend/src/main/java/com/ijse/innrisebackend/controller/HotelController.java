package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import com.ijse.innrisebackend.dto.HotelDTO;
import com.ijse.innrisebackend.entity.Hotel;
import com.ijse.innrisebackend.repository.HotelRepository;
import com.ijse.innrisebackend.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/innrise/hotel")
@RequiredArgsConstructor
@CrossOrigin
public class HotelController {
    private final HotelService hotelService;
    private final HotelRepository hotelRepository;

    @GetMapping("/test")
    public String testEndpoint() {
        return "Security is working ✅";
    }

    @GetMapping("/test-db")
    public ResponseEntity<ApiResponse> testDatabase() {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            return ResponseEntity.ok(
                    new ApiResponse(
                            200,
                            "Database test successful",
                            "Found " + hotels.size() + " hotels"
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse(
                            500,
                            "Database test failed",
                            e.getMessage()
                    )
            );
        }
    }

    @PostMapping("/create-test-data")
    public ResponseEntity<ApiResponse> createTestData() {
        try {
            // Create a test hotel
            Hotel testHotel = new Hotel();
            testHotel.setName("Test Hotel");
            testHotel.setLocation("Test City");
            testHotel.setAddress("123 Test Street");
            testHotel.setContact_number("123-456-7890");
            testHotel.setEmail("test@hotel.com");
            testHotel.setDescription("A test hotel for development");
            testHotel.setStar_rating(4);
            
            hotelRepository.save(testHotel);
            
            return ResponseEntity.ok(
                    new ApiResponse(
                            200,
                            "Test data created successfully",
                            "Created test hotel with ID: " + testHotel.getHotelId()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse(
                            500,
                            "Failed to create test data",
                            e.getMessage()
                    )
            );
        }
    }

    @GetMapping("search/{keyword}")
    public ResponseEntity<ApiResponse> getHotel(@PathVariable String keyword) {
        List<HotelDTO> hotelDTOS = hotelService.getAllHotelsByKeyword(keyword);
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "Hotels found",
                        hotelDTOS
                )
        );
    }

    @PostMapping("create")
    public ResponseEntity<ApiResponse> createHotel(@Valid @RequestBody HotelDTO hotelDTO) {
        log.info("Hotel Created");
        hotelService.saveHotel(hotelDTO);
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "Success",
                        "Hotel Created"
                )
        );
    }

    @PutMapping("update")
    public ResponseEntity<ApiResponse> updateHotel(@Valid @RequestBody HotelDTO hotelDTO) {
        log.info("Hotel Updated");
        hotelService.saveHotel(hotelDTO);
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "Success",
                        "Hotel Updated"
                )
        );
    }

    @GetMapping("filter")
    public ResponseEntity<ApiResponse> filterHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String priceRange
    ) {
        List<HotelDTO> hotelDTOS = hotelService.filterHotels(location, priceRange);
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "Hotels filtered",
                        hotelDTOS
                )
        );
    }



    @GetMapping("getAll")
    public ResponseEntity<ApiResponse> getAllHotels() {
        try {
            List<HotelDTO> hotelDTOS = hotelService.getAllHotels();
            return ResponseEntity.ok(
                    new ApiResponse(
                            200,
                            "Hotels found",
                            hotelDTOS
                    )
            );
        } catch (Exception e) {
            log.error("Error in getAllHotels: ", e);
            return ResponseEntity.status(500).body(
                    new ApiResponse(
                            500,
                            "Error fetching hotels",
                            e.getMessage()
                    )
            );
        }
    }

    @GetMapping("all")
    public ResponseEntity<ApiResponse> getAllHotelsAlt() {
        try {
            List<HotelDTO> hotelDTOS = hotelService.getAllHotels();
            return ResponseEntity.ok(
                    new ApiResponse(
                            200,
                            "Hotels found",
                            hotelDTOS
                    )
            );
        } catch (Exception e) {
            log.error("Error in getAllHotels: ", e);
            return ResponseEntity.status(500).body(
                    new ApiResponse(
                            500,
                            "Error fetching hotels",
                            e.getMessage()
                    )
            );
        }
    }

    @GetMapping("getAllSimple")
    public ResponseEntity<ApiResponse> getAllHotelsSimple() {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            return ResponseEntity.ok(
                    new ApiResponse(
                            200,
                            "Hotels found (simple)",
                            "Found " + hotels.size() + " hotels"
                    )
            );
        } catch (Exception e) {
            log.error("Error in getAllHotelsSimple: ", e);
            return ResponseEntity.status(500).body(
                    new ApiResponse(
                            500,
                            "Error fetching hotels (simple)",
                            e.getMessage()
                    )
            );
        }
    }

    @GetMapping("getAllBasic")
    public ResponseEntity<ApiResponse> getAllHotelsBasic() {
        try {
            return ResponseEntity.ok(
                    new ApiResponse(
                            200,
                            "Basic test successful",
                            "This is a basic test without database access"
                    )
            );
        } catch (Exception e) {
            log.error("Error in getAllHotelsBasic: ", e);
            return ResponseEntity.status(500).body(
                    new ApiResponse(
                            500,
                            "Error in basic test",
                            e.getMessage()
                    )
            );
        }
    }

    @GetMapping("test-images")
    public ResponseEntity<ApiResponse> testImages() {
        try {
            // Create sample hotel data with proper image URLs
            List<HotelDTO> sampleHotels = new ArrayList<>();
            
            HotelDTO hotel1 = new HotelDTO();
            hotel1.setHotelId(1L);
            hotel1.setName("Sample Hotel 1");
            hotel1.setLocation("Colombo");
            hotel1.setStar_rating(4);
            hotel1.setPhotos(List.of("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop"));
            
            HotelDTO hotel2 = new HotelDTO();
            hotel2.setHotelId(2L);
            hotel2.setName("Sample Hotel 2");
            hotel2.setLocation("Kandy");
            hotel2.setStar_rating(5);
            hotel2.setPhotos(List.of("https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop"));
            
            sampleHotels.add(hotel1);
            sampleHotels.add(hotel2);
            
            return ResponseEntity.ok(
                    new ApiResponse(
                            200,
                            "Sample hotels with images",
                            sampleHotels
                    )
            );
        } catch (Exception e) {
            log.error("Error in testImages: ", e);
            return ResponseEntity.status(500).body(
                    new ApiResponse(
                            500,
                            "Error creating sample data",
                            e.getMessage()
                    )
            );
        }
    }
}
