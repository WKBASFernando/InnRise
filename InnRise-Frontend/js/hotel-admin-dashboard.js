// ==================== HOTEL ADMIN DASHBOARD JAVASCRIPT ====================

let currentUser = null;
let currentHotel = null;
let currentSection = 'dashboard';

// ==================== INITIALIZATION ====================
$(document).ready(function() {
    initializeHotelAdminDashboard();
});

function initializeHotelAdminDashboard() {
    // Check if user is logged in and has hotel admin role
    const token = localStorage.getItem('bearerToken');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }
    
    // Decode token to get user info
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUser = payload;
        
        // Check if user has hotel admin role
        if (payload.role !== 'HOTEL_ADMIN') {
            alert('Access denied. Hotel admin privileges required.');
            window.location.href = '../index.html';
            return;
        }
        
        // Update hotel admin info display
        $('#hotelAdminInfo').html(`<i class="fas fa-user-tie me-1"></i>${payload.firstName} ${payload.lastName}`);
        
        // Load hotel data
        loadHotelData();
        
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('bearerToken');
        window.location.href = '../index.html';
    }
}

// ==================== NAVIGATION ====================
function showSection(sectionName) {
    // Hide all sections
    $('.content-section').hide();
    
    // Show selected section
    $(`#${sectionName}-section`).show();
    
    // Update active nav link
    $('.nav-link').removeClass('active');
    $(`.nav-link[onclick="showSection('${sectionName}')"]`).addClass('active');
    
    currentSection = sectionName;
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'hotel':
            loadHotelInfo();
            break;
        case 'rooms':
            loadRooms();
            break;
        case 'bookings':
            loadBookings();
            break;
    }
}

// ==================== HOTEL DATA LOADING ====================
function loadHotelData() {
    // For now, we'll use a mock hotel ID since we don't have the hotel relationship in the token
    // In a real implementation, the token would include the hotel ID
    const hotelId = 1; // This should come from the user's hotel relationship
    
    $.ajax({
        url: `http://localhost:8080/api/innrise/hotel-profile/${hotelId}`,
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                currentHotel = response.data;
                loadDashboardData();
            } else {
                showAlert('Error loading hotel data', 'danger');
            }
        },
        error: function(xhr) {
            console.error('Error loading hotel data:', xhr);
            showAlert('Error loading hotel data', 'danger');
        }
    });
}

// ==================== DASHBOARD ====================
function loadDashboardData() {
    if (!currentHotel) return;
    
    // Update hotel info
    $('#hotelName').text(currentHotel.name);
    $('#hotelLocation').text(currentHotel.location);
    $('#hotelDescription').text(currentHotel.description);
    
    // Load stats
    loadTotalRooms();
    loadTotalBookings();
    loadPendingBookings();
    loadHotelRevenue();
}

function loadTotalRooms() {
    if (!currentHotel || !currentHotel.rooms) {
        $('#totalRooms').text('0');
        return;
    }
    $('#totalRooms').text(currentHotel.rooms.length);
}

function loadTotalBookings() {
    // This would typically come from a backend endpoint
    // For now, we'll use a mock value
    $('#totalBookings').text('0');
}

function loadPendingBookings() {
    // This would typically come from a backend endpoint
    // For now, we'll use a mock value
    $('#pendingBookings').text('0');
}

function loadHotelRevenue() {
    // This would typically come from a backend endpoint
    // For now, we'll use a mock value
    $('#hotelRevenue').text('LKR 0.00');
}

// ==================== HOTEL MANAGEMENT ====================
function loadHotelInfo() {
    if (!currentHotel) return;
    
    $('#editHotelName').text(currentHotel.name);
    $('#editHotelLocation').text(currentHotel.location);
    $('#editHotelAddress').text(currentHotel.address);
    $('#editHotelContact').text(currentHotel.contact_number);
    $('#editHotelEmail').text(currentHotel.email);
    $('#editHotelRating').text(`${currentHotel.star_rating} Stars`);
    $('#editHotelDescription').text(currentHotel.description);
}

function openEditHotelModal() {
    if (!currentHotel) return;
    
    $('#editHotelNameInput').val(currentHotel.name);
    $('#editHotelLocationInput').val(currentHotel.location);
    $('#editHotelAddressInput').val(currentHotel.address);
    $('#editHotelContactInput').val(currentHotel.contact_number);
    $('#editHotelEmailInput').val(currentHotel.email);
    $('#editHotelRatingInput').val(currentHotel.star_rating);
    $('#editHotelPriceInput').val(currentHotel.price);
    $('#editHotelDescriptionInput').val(currentHotel.description);
    
    $('#editHotelModal').modal('show');
}

function updateHotel() {
    if (!currentHotel) return;
    
    const formData = {
        name: $('#editHotelNameInput').val(),
        location: $('#editHotelLocationInput').val(),
        address: $('#editHotelAddressInput').val(),
        contact_number: $('#editHotelContactInput').val(),
        email: $('#editHotelEmailInput').val(),
        star_rating: parseInt($('#editHotelRatingInput').val()),
        price: parseFloat($('#editHotelPriceInput').val()),
        description: $('#editHotelDescriptionInput').val()
    };
    
    $.ajax({
        url: `http://localhost:8080/api/innrise/admin/hotels/${currentHotel.hotelId}`,
        method: 'PUT',
        headers: getAuthHeaders(),
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.status === 200) {
                $('#editHotelModal').modal('hide');
                showAlert('Hotel updated successfully', 'success');
                // Reload hotel data
                loadHotelData();
                loadHotelInfo();
            } else {
                showAlert(response.message || 'Error updating hotel', 'danger');
            }
        },
        error: function(xhr) {
            console.error('Error updating hotel:', xhr);
            showAlert('Error updating hotel', 'danger');
        }
    });
}

// ==================== ROOMS MANAGEMENT ====================
function loadRooms() {
    const tbody = $('#roomsTableBody');
    tbody.html('<tr><td colspan="4" class="text-center loading"><i class="fas fa-spinner fa-spin"></i> Loading rooms...</td></tr>');
    
    if (!currentHotel || !currentHotel.rooms) {
        tbody.html('<tr><td colspan="4" class="text-center">No rooms found</td></tr>');
        return;
    }
    
    let html = '';
    currentHotel.rooms.forEach(room => {
        html += `
            <tr>
                <td>${room.roomId}</td>
                <td>${room.type}</td>
                <td>LKR ${room.price}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline-primary btn-sm" onclick="editRoom(${room.roomId})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteRoom(${room.roomId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.html(html);
}

function openAddRoomModal() {
    $('#addRoomForm')[0].reset();
    $('#addRoomModal').modal('show');
}

function addRoom() {
    if (!currentHotel) return;
    
    const formData = {
        type: $('#roomType').val(),
        price: parseFloat($('#roomPrice').val()),
        hotelId: currentHotel.hotelId
    };
    
    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/rooms',
        method: 'POST',
        headers: getAuthHeaders(),
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.status === 200) {
                $('#addRoomModal').modal('hide');
                showAlert('Room added successfully', 'success');
                loadRooms();
                loadTotalRooms();
            } else {
                showAlert(response.message || 'Error adding room', 'danger');
            }
        },
        error: function(xhr) {
            console.error('Error adding room:', xhr);
            showAlert('Error adding room', 'danger');
        }
    });
}

function editRoom(roomId) {
    // TODO: Implement edit room functionality
    showAlert('Edit room functionality coming soon', 'info');
}

function deleteRoom(roomId) {
    if (confirm('Are you sure you want to delete this room?')) {
        $.ajax({
            url: `http://localhost:8080/api/innrise/admin/rooms/${roomId}`,
            method: 'DELETE',
            headers: getAuthHeaders(),
            success: function(response) {
                if (response.status === 200) {
                    showAlert('Room deleted successfully', 'success');
                    loadRooms();
                    loadTotalRooms();
                } else {
                    showAlert(response.message || 'Error deleting room', 'danger');
                }
            },
            error: function(xhr) {
                console.error('Error deleting room:', xhr);
                showAlert('Error deleting room', 'danger');
            }
        });
    }
}

// ==================== BOOKINGS MANAGEMENT ====================
function loadBookings() {
    const tbody = $('#bookingsTableBody');
    tbody.html('<tr><td colspan="8" class="text-center loading"><i class="fas fa-spinner fa-spin"></i> Loading bookings...</td></tr>');
    
    if (!currentHotel) return;
    
    $.ajax({
        url: `http://localhost:8080/api/innrise/admin/bookings/hotel/${currentHotel.hotelId}`,
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                displayBookings(response.data);
            } else {
                tbody.html('<tr><td colspan="8" class="text-center text-danger">Error loading bookings</td></tr>');
            }
        },
        error: function(xhr) {
            console.error('Error loading bookings:', xhr);
            tbody.html('<tr><td colspan="8" class="text-center text-danger">Error loading bookings</td></tr>');
        }
    });
}

function displayBookings(bookings) {
    const tbody = $('#bookingsTableBody');
    
    if (!bookings || bookings.length === 0) {
        tbody.html('<tr><td colspan="8" class="text-center">No bookings found</td></tr>');
        return;
    }
    
    let html = '';
    bookings.forEach(booking => {
        const statusBadge = getBookingStatusBadge(booking.status);
        html += `
            <tr>
                <td>${booking.bookingId}</td>
                <td>${booking.room ? booking.room.type : 'N/A'}</td>
                <td>${formatDate(booking.checkInDate)}</td>
                <td>${formatDate(booking.checkOutDate)}</td>
                <td>${booking.numberOfGuests}</td>
                <td>LKR ${booking.totalAmount}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewBooking(${booking.bookingId})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-success btn-sm" onclick="updateBookingStatus(${booking.bookingId}, 'CONFIRMED')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="updateBookingStatus(${booking.bookingId}, 'CANCELLED')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.html(html);
}

function getBookingStatusBadge(status) {
    switch(status) {
        case 'CONFIRMED':
            return '<span class="badge badge-success">Confirmed</span>';
        case 'PENDING':
            return '<span class="badge badge-warning">Pending</span>';
        case 'CANCELLED':
            return '<span class="badge badge-danger">Cancelled</span>';
        default:
            return '<span class="badge badge-secondary">Unknown</span>';
    }
}

function viewBooking(bookingId) {
    // TODO: Implement view booking details
    showAlert('View booking functionality coming soon', 'info');
}

function updateBookingStatus(bookingId, status) {
    const action = status === 'CONFIRMED' ? 'confirm' : 'cancel';
    if (confirm(`Are you sure you want to ${action} this booking?`)) {
        $.ajax({
            url: `http://localhost:8080/api/innrise/admin/bookings/${bookingId}/status`,
            method: 'PUT',
            headers: getAuthHeaders(),
            contentType: 'application/json',
            data: JSON.stringify({ status: status }),
            success: function(response) {
                if (response.status === 200) {
                    showAlert(`Booking ${action}ed successfully`, 'success');
                    loadBookings();
                } else {
                    showAlert(response.message || `Error ${action}ing booking`, 'danger');
                }
            },
            error: function(xhr) {
                console.error(`Error ${action}ing booking:`, xhr);
                showAlert(`Error ${action}ing booking`, 'danger');
            }
        });
    }
}

// ==================== UTILITY FUNCTIONS ====================
function getAuthHeaders() {
    const token = localStorage.getItem('bearerToken');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Remove existing alerts
    $('.alert').remove();
    
    // Add new alert at the top of the main content
    $('main').prepend(alertHtml);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        $('.alert').fadeOut();
    }, 5000);
}

function logout() {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '../index.html';
}
