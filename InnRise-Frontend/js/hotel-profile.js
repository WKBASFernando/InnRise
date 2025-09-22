// ==================== HOTEL PROFILE JAVASCRIPT ====================

let currentHotelProfile = null;
let currentBookingHotel = null;
let currentBookingRooms = [];
let selectedRoomId = null;

// ==================== INITIALIZATION ====================
$(document).ready(function() {
    initializePage();
});

function initializePage() {
    // Get hotel ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');
    
    if (!hotelId) {
        showError('Hotel ID not provided in URL');
        return;
    }
    
    // Load hotel profile from backend
    loadHotelProfile(hotelId);
    
    // Initialize booking form
    initializeBookingForm();
}

// ==================== HOTEL PROFILE LOADING ====================
function loadHotelProfile(hotelId) {
    showLoading();
    
    // Backend handles all business logic - frontend only makes requests
    $.ajax({
        url: `http://localhost:8080/api/innrise/hotel-profile/${hotelId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        success: function(response) {
            if (response.status === 200) {
                currentHotelProfile = response.data;
                displayHotelProfile(currentHotelProfile);
                hideLoading();
            } else {
                showError(response.message || 'Failed to load hotel profile');
            }
        },
        error: function(xhr) {
            console.error('Hotel profile fetch error:', xhr);
            let errorMessage = 'Failed to load hotel profile';
            
            if (xhr.status === 404) {
                errorMessage = 'Hotel not found';
            } else if (xhr.status === 0) {
                errorMessage = 'Network error. Please check if the server is running.';
            } else if (xhr.responseJSON?.message) {
                errorMessage = xhr.responseJSON.message;
            }
            
            showError(errorMessage);
        }
    });
}

// ==================== DISPLAY HOTEL PROFILE ====================
function displayHotelProfile(profile) {
    // Display basic hotel information
    $('#hotelName').text(profile.name);
    $('#hotelLocation').html(`<i class="fas fa-map-marker-alt me-1"></i>${profile.location}`);
    $('#hotelRating').html(`<i class="fas fa-star me-1"></i>${profile.star_rating} Stars`);
    $('#hotelPrice').html(`<i class="fas fa-tag me-1"></i>LKR ${profile.price}/night`);
    
    // Display hotel details
    $('#hotelDescription').text(profile.description || 'No description available');
    $('#hotelAddress').text(profile.address || 'Address not available');
    $('#hotelContact').text(profile.contact_number || 'Contact not available');
    $('#hotelEmail').text(profile.email || 'Email not available');
    
    // Display booking price
    $('#bookingPrice').text(`LKR ${profile.price}`);
    
    // Display gallery (backend provides full URLs)
    displayHotelGallery(profile.photos);
    
    // Display rooms (backend provides full URLs and data)
    displayHotelRooms(profile.rooms);
    
    // Display packages (backend provides full URLs and data)
    displayHotelPackages(profile.packages);
    
    // Show the content
    $('#hotelProfileContent').fadeIn(500);
}

// ==================== DISPLAY HOTEL GALLERY ====================
function displayHotelGallery(photos) {
    const galleryContainer = $('#hotelGallery');
    galleryContainer.empty();
    
    if (!photos || photos.length === 0) {
        galleryContainer.html(`
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-image me-2"></i>No photos available for this hotel
                </div>
            </div>
        `);
        return;
    }
    
    // Backend provides full URLs - frontend just displays them
    photos.forEach((photoUrl, index) => {
        const galleryItem = $(`
            <div class="gallery-item" style="background-image: url('${photoUrl}');">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            </div>
        `);
        
        // Add click handler for image preview
        galleryItem.on('click', function() {
            openImagePreview(photoUrl, index);
        });
        
        galleryContainer.append(galleryItem);
    });
}

// ==================== DISPLAY HOTEL ROOMS ====================
function displayHotelRooms(rooms) {
    const roomsContainer = $('#roomsContainer');
    roomsContainer.empty();
    
    if (!rooms || rooms.length === 0) {
        roomsContainer.html(`
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-bed me-2"></i>No rooms available for this hotel
                </div>
            </div>
        `);
        return;
    }
    
    // Backend provides all room data including image URLs
    rooms.forEach(room => {
        const roomCard = $(`
            <div class="room-card">
                <div class="room-image" style="background-image: url('${room.imageUrl}');">
                    <div class="room-price">LKR ${room.price}/night</div>
                </div>
                <div class="room-content">
                    <h3 class="room-type">${room.type}</h3>
                    <p class="room-price-display">LKR ${room.price} per night</p>
                </div>
            </div>
        `);
        
        roomsContainer.append(roomCard);
    });
}

// ==================== DISPLAY HOTEL PACKAGES ====================
function displayHotelPackages(packages) {
    const packagesContainer = $('#packagesContainer');
    packagesContainer.empty();
    
    if (!packages || packages.length === 0) {
        packagesContainer.html(`
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-gift me-2"></i>No special packages available for this hotel
                </div>
            </div>
        `);
        return;
    }
    
    // Backend provides all package data including image URLs
    packages.forEach(pkg => {
        const packageCard = $(`
            <div class="package-card">
                <div class="package-image" style="background-image: url('${pkg.imageUrl}');">
                    <div class="package-price">LKR ${pkg.price}</div>
                </div>
                <div class="package-content">
                    <h3 class="package-name">${pkg.packageName}</h3>
                    <p class="package-description">${pkg.description}</p>
                    <p class="package-price-display">LKR ${pkg.price}</p>
                </div>
            </div>
        `);
        
        packagesContainer.append(packageCard);
    });
}

// ==================== BOOKING MODAL ====================
function openBookingModal() {
    if (!currentHotelProfile) {
        alert('Hotel information not available');
        return;
    }
    
    currentBookingHotel = currentHotelProfile;
    selectedRoomId = null; // Reset selected room
    
    // Populate hotel information
    $('#bookingHotelName').text(`Book ${currentHotelProfile.name}`);
    $('#bookingHotelTitle').text(currentHotelProfile.name);
    $('#bookingHotelLocation').text(currentHotelProfile.location);
    $('#bookingHotelRating').text(`${currentHotelProfile.star_rating} Stars`);
    
    // Set hotel image (backend provides full URL)
    const imageUrl = currentHotelProfile.photos && currentHotelProfile.photos.length > 0 
        ? currentHotelProfile.photos[0] 
        : 'https://via.placeholder.com/400x200/f97316/ffffff?text=Hotel+Image';
    $('#bookingHotelImage').css('background-image', `url('${imageUrl}')`);
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    $('#bookingCheckIn').val(tomorrow);
    $('#bookingCheckOut').val(tomorrow);
    $('#bookingCheckIn').attr('min', today);
    $('#bookingCheckOut').attr('min', today);
    
    // Reset form
    $('#bookingForm')[0].reset();
    $('#bookingCheckIn').val(tomorrow);
    $('#bookingCheckOut').val(tomorrow);
    
    // Load available rooms from backend
    loadAvailableRooms(currentHotelProfile.hotelId);
    
    // Update summary
    updateBookingSummary();
    
    // Show modal
    $('#bookingModal').fadeIn(300);
    $('body').css('overflow', 'hidden');
}

function closeBookingModal() {
    $('#bookingModal').fadeOut(300);
    $('body').css('overflow', 'auto');
    currentBookingHotel = null;
    currentBookingRooms = [];
    selectedRoomId = null;
}

// ==================== ROOM SELECTION FUNCTIONS ====================
function loadAvailableRooms(hotelId) {
    const container = $('#roomSelectionContainer');
    
    // Show loading state
    container.html(`
        <div class="loading-rooms">
            <i class="fas fa-spinner fa-spin"></i> Loading available rooms...
        </div>
    `);
    
    // Fetch rooms from backend
    $.ajax({
        url: `http://localhost:8080/api/innrise/hotel-profile/${hotelId}/rooms`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        success: function(response) {
            if (response.status === 200) {
                currentBookingRooms = response.data || [];
                displayRoomOptions(currentBookingRooms);
            } else {
                showRoomError('Failed to load rooms: ' + (response.message || 'Unknown error'));
            }
        },
        error: function(xhr) {
            console.error('Room fetch error:', xhr);
            let errorMessage = 'Failed to load available rooms';
            
            if (xhr.status === 404) {
                errorMessage = 'No rooms found for this hotel';
            } else if (xhr.status === 0) {
                errorMessage = 'Network error. Please check if the server is running.';
            } else if (xhr.responseJSON?.message) {
                errorMessage = xhr.responseJSON.message;
            }
            
            showRoomError(errorMessage);
        }
    });
}

function displayRoomOptions(rooms) {
    const container = $('#roomSelectionContainer');
    
    if (!rooms || rooms.length === 0) {
        container.html(`
            <div class="no-rooms-available">
                <i class="fas fa-bed fa-2x mb-3"></i>
                <h5>No Rooms Available</h5>
                <p>Sorry, no rooms are currently available for this hotel.</p>
            </div>
        `);
        return;
    }
    
    let roomHTML = '';
    rooms.forEach(room => {
        roomHTML += `
            <div class="room-option" data-room-id="${room.roomId}" onclick="selectRoom(${room.roomId})">
                <div class="room-option-header">
                    <div class="room-type">${room.type}</div>
                    <div class="room-price">LKR ${room.price}/night</div>
                </div>
                <div class="room-details">
                    <i class="fas fa-bed me-1"></i>Room ID: ${room.roomId}
                </div>
            </div>
        `;
    });
    
    roomHTML += `
        <div class="room-selection-info">
            <i class="fas fa-info-circle me-1"></i>
            Click on a room type to select it for your booking.
        </div>
    `;
    
    container.html(roomHTML);
}

function selectRoom(roomId) {
    // Remove previous selection
    $('.room-option').removeClass('selected');
    
    // Add selection to clicked room
    $(`.room-option[data-room-id="${roomId}"]`).addClass('selected');
    
    // Store selected room ID
    selectedRoomId = roomId;
    
    // Update booking summary
    updateBookingSummary();
}

function showRoomError(message) {
    const container = $('#roomSelectionContainer');
    container.html(`
        <div class="no-rooms-available">
            <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
            <h5>Error Loading Rooms</h5>
            <p>${message}</p>
            <button class="btn btn-outline-primary btn-sm mt-2" onclick="loadAvailableRooms(${currentHotelProfile?.hotelId})">
                <i class="fas fa-refresh me-1"></i>Try Again
            </button>
        </div>
    `);
}

// ==================== BOOKING FORM ====================
function initializeBookingForm() {
    // Date change handlers
    $('#bookingCheckIn, #bookingCheckOut').on('change', function() {
        updateBookingSummary();
    });
    
    // Form submission
    $('#bookingForm').on('submit', handleBookingFormSubmit);
}

function updateBookingSummary() {
    const checkIn = $('#bookingCheckIn').val();
    const checkOut = $('#bookingCheckOut').val();
    const guests = $('#bookingGuests').val();
    const rooms = $('#bookingRooms').val();
    
    // Get selected room price from backend data
    let selectedRoom = null;
    let price = 0;
    let roomType = '-';
    
    if (selectedRoomId && currentBookingRooms.length > 0) {
        selectedRoom = currentBookingRooms.find(room => room.roomId === selectedRoomId);
        if (selectedRoom) {
            price = selectedRoom.price || 0;
            roomType = selectedRoom.type || '-';
        }
    }
    
    let nights = 0;
    if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
    
    const total = price * nights * (parseInt(rooms) || 1);
    
    // Update summary with room-specific information
    $('#summarySelectedRoom').text(roomType);
    $('#summaryPricePerNight').text(`LKR ${price}`);
    $('#summaryCheckIn').text(checkIn || '-');
    $('#summaryCheckOut').text(checkOut || '-');
    $('#summaryGuests').text(guests ? `${guests} Guest${guests > 1 ? 's' : ''}` : '-');
    $('#summaryRooms').text(rooms ? `${rooms} Room${rooms > 1 ? 's' : ''}` : '-');
    $('#summaryTotal').text(`LKR ${total.toFixed(2)}`);
}

function handleBookingFormSubmit(event) {
    event.preventDefault();
    
    if (!currentBookingHotel) {
        alert('Hotel information not found. Please try again.');
        return;
    }
    
    // Backend validation: Check if room is selected
    if (!selectedRoomId) {
        alert('Please select a room type before confirming your booking.');
        return;
    }
    
    const formData = {
        hotelId: currentBookingHotel.hotelId,
        roomId: selectedRoomId, // Backend handles room selection
        checkIn: $('#bookingCheckIn').val(),
        checkOut: $('#bookingCheckOut').val(),
        guests: parseInt($('#bookingGuests').val()),
        rooms: parseInt($('#bookingRooms').val()),
        specialRequests: $('#bookingSpecialRequests').val()
    };
    
    // Get selected room details for confirmation
    const selectedRoom = currentBookingRooms.find(room => room.roomId === selectedRoomId);
    const roomType = selectedRoom ? selectedRoom.type : 'Unknown';
    
    // Show confirmation (backend will calculate total)
    const confirmMessage = `
        Confirm your booking for ${currentBookingHotel.name}?
        
        Room Type: ${roomType}
        Check-in: ${formData.checkIn}
        Check-out: ${formData.checkOut}
        Guests: ${formData.guests}
        Rooms: ${formData.rooms}
        
        ${formData.specialRequests ? `Special Requests: ${formData.specialRequests}` : ''}
        
        Total amount will be calculated by the system based on room pricing.
    `;
    
    if (confirm(confirmMessage)) {
        // Send booking data to backend API
        submitBookingToBackend(formData);
    }
}

function submitBookingToBackend(formData) {
    // Show loading state
    const confirmBtn = $('.btn-confirm-booking');
    const originalText = confirmBtn.text();
    confirmBtn.prop('disabled', true).text('Processing...');
    
    // Send raw data to backend - backend will calculate total
    const bookingData = {
        hotelId: formData.hotelId,
        roomId: formData.roomId, // Backend handles room selection
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        rooms: formData.rooms,
        specialRequests: formData.specialRequests
    };
    
    $.ajax({
        url: 'http://localhost:8080/api/innrise/booking/create',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bookingData),
        success: function(response) {
            if (response.status === 200) {
                alert(`Booking confirmed successfully!\n\nBooking ID: ${response.data.bookingId}\nHotel: ${response.data.hotelName}\nTotal: LKR ${response.data.totalAmount}\n\nYou will receive a confirmation email shortly.`);
                closeBookingModal();
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function(xhr) {
            console.error('Booking error:', xhr);
            let errorMessage = 'Failed to create booking. Please try again.';
            
            if (xhr.responseJSON?.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.status === 0) {
                errorMessage = 'Network error. Please check if the server is running.';
            }
            
            alert('Error: ' + errorMessage);
        },
        complete: function() {
            // Restore button state
            confirmBtn.prop('disabled', false).text(originalText);
        }
    });
}

// ==================== IMAGE PREVIEW ====================
function openImagePreview(imageUrl, index) {
    // Simple image preview - could be enhanced with a proper modal
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    previewWindow.document.write(`
        <html>
            <head>
                <title>Hotel Image Preview</title>
                <style>
                    body { margin: 0; padding: 20px; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                    img { max-width: 100%; max-height: 100%; object-fit: contain; }
                </style>
            </head>
            <body>
                <img src="${imageUrl}" alt="Hotel Image ${index + 1}">
            </body>
        </html>
    `);
}

// ==================== UTILITY FUNCTIONS ====================
function showLoading() {
    $('#loadingSpinner').show();
    $('#errorMessage').hide();
    $('#hotelProfileContent').hide();
}

function hideLoading() {
    $('#loadingSpinner').hide();
}

function showError(message) {
    $('#loadingSpinner').hide();
    $('#hotelProfileContent').hide();
    $('#errorText').text(message);
    $('#errorMessage').show();
}

// ==================== LOGOUT FUNCTION ====================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all stored data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to signin page
        window.location.href = 'signin.html';
    }
}

// ==================== NAVIGATION BOOK NOW ====================
$('#navBookNow').on('click', function(e) {
    e.preventDefault();
    // Scroll to the booking section or open booking modal
    if (currentHotelProfile) {
        openBookingModal();
    } else {
        // If no hotel profile loaded, redirect to hotels page
        window.location.href = 'hotel.html';
    }
});
