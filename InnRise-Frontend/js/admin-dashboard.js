// ==================== ADMIN DASHBOARD JAVASCRIPT ====================

let currentUser = null;
let currentSection = 'dashboard';

// ==================== INITIALIZATION ====================
$(document).ready(function() {
    initializeAdminDashboard();
});

// function initializeAdminDashboard() {
//     // Check if user is logged in and has admin role
//     const token = localStorage.getItem('token');
//     if (!token) {
//         window.location.href = 'signin.html';
//         return;
//     }
//
//     // Decode token to get user info
//     try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         currentUser = payload;
//
//         // Check if user has admin role
//         if (payload.role !== 'ADMIN') {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Access Denied',
//                 text: 'Admin privileges required to access this page.',
//                 confirmButtonText: 'Go to Login',
//                 confirmButtonColor: '#f97316',
//                 allowOutsideClick: false
//             }).then(() => {
//                 window.location.href = 'signin.html';
//             });
//             return;
//         }
//
//         // Update admin info display
//         $('#adminInfo').html(`<i class="fas fa-user-shield me-1"></i>${payload.firstName} ${payload.lastName}`);
//
//         // Load dashboard data
//         loadDashboardData();
//
//     } catch (error) {
//         console.error('Error decoding token:', error);
//         localStorage.removeItem('token');
//         window.location.href = 'signin.html';
//     }
// }

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
        case 'hotels':
            loadHotels();
            break;
        case 'discounts':
            loadDiscounts();
            break;
        case 'users':
            loadUsers();
            break;
        case 'bookings':
            loadBookings();
            break;
    }
}

// ==================== DASHBOARD ====================
function loadDashboardData() {
    // Load stats from backend
    Promise.all([
        loadTotalHotels(),
        loadTotalBookings(),
        loadTotalUsers(),
        loadTotalRevenue()
    ]).catch(error => {
        console.error('Error loading dashboard data:', error);
        showAlert('Error loading dashboard data', 'danger');
    });
}

function loadTotalHotels() {
    return $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/hotels/count',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                $('#totalHotels').text(response.data);
            }
        }
    });
}

function loadTotalBookings() {
    return $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/bookings/count',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                $('#totalBookings').text(response.data);
            }
        }
    });
}

function loadTotalUsers() {
    return $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/users/count',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                $('#totalUsers').text(response.data);
            }
        }
    });
}

function loadTotalRevenue() {
    return $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/revenue',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                $('#totalRevenue').text(`LKR ${response.data.toFixed(2)}`);
            }
        }
    });
}

// ==================== HOTELS MANAGEMENT ====================
function loadHotels() {
    const tbody = $('#hotelsTableBody');
    tbody.html('<tr><td colspan="7" class="text-center loading"><i class="fas fa-spinner fa-spin"></i> Loading hotels...</td></tr>');

    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/hotels',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                displayHotels(response.data);
            } else {
                tbody.html('<tr><td colspan="7" class="text-center text-danger">Error loading hotels</td></tr>');
            }
        },
        error: function(xhr) {
            console.error('Error loading hotels:', xhr);
            tbody.html('<tr><td colspan="7" class="text-center text-danger">Error loading hotels</td></tr>');
        }
    });
}

function displayHotels(hotels) {
    const tbody = $('#hotelsTableBody');

    if (!hotels || hotels.length === 0) {
        tbody.html('<tr><td colspan="7" class="text-center">No hotels found</td></tr>');
        return;
    }

    let html = '';
    hotels.forEach(hotel => {
        html += `
            <tr>
                <td>${hotel.hotelId}</td>
                <td>${hotel.name}</td>
                <td>${hotel.location}</td>
                <td>
                    <span class="badge badge-info">${hotel.star_rating} Stars</span>
                </td>
                <td>LKR ${hotel.price}</td>
                <td>
                    <span class="badge badge-success">Active</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline-primary btn-sm" onclick="editHotel(${hotel.hotelId})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteHotel(${hotel.hotelId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.html(html);
}

function openAddHotelModal() {
    $('#addHotelForm')[0].reset();
    $('#addHotelModal').modal('show');
}

function addHotel() {
    const formData = {
        name: $('#hotelName').val(),
        location: $('#hotelLocation').val(),
        address: $('#hotelAddress').val(),
        contact_number: $('#hotelContact').val(),
        email: $('#hotelEmail').val(),
        star_rating: parseInt($('#hotelRating').val()),
        price: parseFloat($('#hotelPrice').val()),
        description: $('#hotelDescription').val()
    };

    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/hotels',
        method: 'POST',
        headers: getAuthHeaders(),
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.status === 200) {
                $('#addHotelModal').modal('hide');
                showAlert('Hotel added successfully', 'success');
                loadHotels();
            } else {
                showAlert(response.message || 'Error adding hotel', 'danger');
            }
        },
        error: function(xhr) {
            console.error('Error adding hotel:', xhr);
            showAlert('Error adding hotel', 'danger');
        }
    });
}

function editHotel(hotelId) {
    // TODO: Implement edit hotel functionality
    showAlert('Edit hotel functionality coming soon', 'info');
}

function deleteHotel(hotelId) {
    if (confirm('Are you sure you want to delete this hotel?')) {
        $.ajax({
            url: `http://localhost:8080/api/innrise/admin/hotels/${hotelId}`,
            method: 'DELETE',
            headers: getAuthHeaders(),
            success: function(response) {
                if (response.status === 200) {
                    showAlert('Hotel deleted successfully', 'success');
                    loadHotels();
                } else {
                    showAlert(response.message || 'Error deleting hotel', 'danger');
                }
            },
            error: function(xhr) {
                console.error('Error deleting hotel:', xhr);
                showAlert('Error deleting hotel', 'danger');
            }
        });
    }
}

// ==================== DISCOUNTS MANAGEMENT ====================
function loadDiscounts() {
    const tbody = $('#discountsTableBody');
    tbody.html('<tr><td colspan="7" class="text-center loading"><i class="fas fa-spinner fa-spin"></i> Loading discounts...</td></tr>');

    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/discounts',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                displayDiscounts(response.data);
            } else {
                tbody.html('<tr><td colspan="7" class="text-center text-danger">Error loading discounts</td></tr>');
            }
        },
        error: function(xhr) {
            console.error('Error loading discounts:', xhr);
            tbody.html('<tr><td colspan="7" class="text-center text-danger">Error loading discounts</td></tr>');
        }
    });
}

function displayDiscounts(discounts) {
    const tbody = $('#discountsTableBody');

    if (!discounts || discounts.length === 0) {
        tbody.html('<tr><td colspan="7" class="text-center">No discounts found</td></tr>');
        return;
    }

    let html = '';
    discounts.forEach(discount => {
        const isActive = new Date(discount.validTo) > new Date();
        html += `
            <tr>
                <td>${discount.discountId}</td>
                <td>${discount.name}</td>
                <td>${discount.percentage}%</td>
                <td>${formatDate(discount.validFrom)}</td>
                <td>${formatDate(discount.validTo)}</td>
                <td>
                    <span class="badge ${isActive ? 'badge-success' : 'badge-secondary'}">
                        ${isActive ? 'Active' : 'Expired'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline-primary btn-sm" onclick="editDiscount(${discount.discountId})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteDiscount(${discount.discountId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.html(html);
}

function openAddDiscountModal() {
    $('#addDiscountForm')[0].reset();
    $('#addDiscountModal').modal('show');
}

function addDiscount() {
    const formData = {
        name: $('#discountName').val(),
        percentage: parseFloat($('#discountPercentage').val()),
        validFrom: $('#discountValidFrom').val(),
        validTo: $('#discountValidTo').val(),
        description: $('#discountDescription').val()
    };

    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/discounts',
        method: 'POST',
        headers: getAuthHeaders(),
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.status === 200) {
                $('#addDiscountModal').modal('hide');
                showAlert('Discount added successfully', 'success');
                loadDiscounts();
            } else {
                showAlert(response.message || 'Error adding discount', 'danger');
            }
        },
        error: function(xhr) {
            console.error('Error adding discount:', xhr);
            showAlert('Error adding discount', 'danger');
        }
    });
}

function editDiscount(discountId) {
    // TODO: Implement edit discount functionality
    showAlert('Edit discount functionality coming soon', 'info');
}

function deleteDiscount(discountId) {
    if (confirm('Are you sure you want to delete this discount?')) {
        $.ajax({
            url: `http://localhost:8080/api/innrise/admin/discounts/${discountId}`,
            method: 'DELETE',
            headers: getAuthHeaders(),
            success: function(response) {
                if (response.status === 200) {
                    showAlert('Discount deleted successfully', 'success');
                    loadDiscounts();
                } else {
                    showAlert(response.message || 'Error deleting discount', 'danger');
                }
            },
            error: function(xhr) {
                console.error('Error deleting discount:', xhr);
                showAlert('Error deleting discount', 'danger');
            }
        });
    }
}

// ==================== USERS MANAGEMENT ====================
function loadUsers() {
    const tbody = $('#usersTableBody');
    tbody.html('<tr><td colspan="7" class="text-center loading"><i class="fas fa-spinner fa-spin"></i> Loading users...</td></tr>');

    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/users',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                displayUsers(response.data);
            } else {
                tbody.html('<tr><td colspan="7" class="text-center text-danger">Error loading users</td></tr>');
            }
        },
        error: function(xhr) {
            console.error('Error loading users:', xhr);
            tbody.html('<tr><td colspan="7" class="text-center text-danger">Error loading users</td></tr>');
        }
    });
}

function displayUsers(users) {
    const tbody = $('#usersTableBody');

    if (!users || users.length === 0) {
        tbody.html('<tr><td colspan="7" class="text-center">No users found</td></tr>');
        return;
    }

    let html = '';
    users.forEach(user => {
        const roleBadge = getRoleBadge(user.role);
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${roleBadge}</td>
                <td>${user.hotel ? user.hotel.name : '-'}</td>
                <td>
                    <span class="badge badge-success">Active</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline-primary btn-sm" onclick="editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.html(html);
}

function getRoleBadge(role) {
    switch(role) {
        case 'ADMIN':
            return '<span class="badge badge-danger">Admin</span>';
        case 'HOTEL_ADMIN':
            return '<span class="badge badge-warning">Hotel Admin</span>';
        case 'USER':
            return '<span class="badge badge-info">User</span>';
        default:
            return '<span class="badge badge-secondary">Unknown</span>';
    }
}

function openAddUserModal() {
    $('#addUserForm')[0].reset();
    loadHotelsForUserSelection();
    $('#addUserModal').modal('show');
}

function loadHotelsForUserSelection() {
    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/hotels',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                const select = $('#userHotel');
                select.html('<option value="">Select Hotel</option>');
                response.data.forEach(hotel => {
                    select.append(`<option value="${hotel.hotelId}">${hotel.name}</option>`);
                });
            }
        }
    });
}

function toggleHotelSelection() {
    const role = $('#userRole').val();
    const hotelDiv = $('#hotelSelectionDiv');

    if (role === 'HOTEL_ADMIN') {
        hotelDiv.show();
        $('#userHotel').prop('required', true);
    } else {
        hotelDiv.hide();
        $('#userHotel').prop('required', false);
    }
}

function addUser() {
    const formData = {
        firstName: $('#userFirstName').val(),
        lastName: $('#userLastName').val(),
        email: $('#userEmail').val(),
        password: $('#userPassword').val(),
        role: $('#userRole').val()
    };

    // Add hotel ID if role is HOTEL_ADMIN
    if (formData.role === 'HOTEL_ADMIN') {
        formData.hotelId = $('#userHotel').val();
    }

    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/users',
        method: 'POST',
        headers: getAuthHeaders(),
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.status === 200) {
                $('#addUserModal').modal('hide');
                showAlert('User added successfully', 'success');
                loadUsers();
            } else {
                showAlert(response.message || 'Error adding user', 'danger');
            }
        },
        error: function(xhr) {
            console.error('Error adding user:', xhr);
            showAlert('Error adding user', 'danger');
        }
    });
}

function editUser(userId) {
    // TODO: Implement edit user functionality
    showAlert('Edit user functionality coming soon', 'info');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        $.ajax({
            url: `http://localhost:8080/api/innrise/admin/users/${userId}`,
            method: 'DELETE',
            headers: getAuthHeaders(),
            success: function(response) {
                if (response.status === 200) {
                    showAlert('User deleted successfully', 'success');
                    loadUsers();
                } else {
                    showAlert(response.message || 'Error deleting user', 'danger');
                }
            },
            error: function(xhr) {
                console.error('Error deleting user:', xhr);
                showAlert('Error deleting user', 'danger');
            }
        });
    }
}

// ==================== BOOKINGS MANAGEMENT ====================
function loadBookings() {
    const tbody = $('#bookingsTableBody');
    tbody.html('<tr><td colspan="9" class="text-center loading"><i class="fas fa-spinner fa-spin"></i> Loading bookings...</td></tr>');

    $.ajax({
        url: 'http://localhost:8080/api/innrise/admin/bookings',
        method: 'GET',
        headers: getAuthHeaders(),
        success: function(response) {
            if (response.status === 200) {
                displayBookings(response.data);
            } else {
                tbody.html('<tr><td colspan="9" class="text-center text-danger">Error loading bookings</td></tr>');
            }
        },
        error: function(xhr) {
            console.error('Error loading bookings:', xhr);
            tbody.html('<tr><td colspan="9" class="text-center text-danger">Error loading bookings</td></tr>');
        }
    });
}

function displayBookings(bookings) {
    const tbody = $('#bookingsTableBody');

    if (!bookings || bookings.length === 0) {
        tbody.html('<tr><td colspan="9" class="text-center">No bookings found</td></tr>');
        return;
    }

    let html = '';
    bookings.forEach(booking => {
        const statusBadge = getBookingStatusBadge(booking.status);
        html += `
            <tr>
                <td>${booking.bookingId}</td>
                <td>${booking.hotel ? booking.hotel.name : 'N/A'}</td>
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
    const token = localStorage.getItem('token');
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'signin.html';
}
