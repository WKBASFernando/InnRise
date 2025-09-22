let currentMapView = 'map';
let cachedHotels = []; // Cache hotels data to avoid unnecessary API calls
let token = null; // Bearer token for API authentication

// Pagination variables
let currentPage = 1;
let itemsPerPage = 6; // Number of hotels to show per page
let totalPages = 1;
let filteredHotels = []; // Hotels after filtering

// ================= TOKEN VALIDATION =================
function checkAuthToken() {
  if (!window.tokenManager.isAuthenticated()) {
    // No token found, redirect to login page
    alert('Please log in to access hotel listings.');
    window.location.href = 'signin.html';
    return false;
  }
  
  return true;
}

// ================= INIT =================
$(document).ready(function() {
  // Check for authentication token first
  if (!checkAuthToken()) {
    return; // Stop execution if no token
  }
  
  // Preload high-quality fallback images
  preloadFallbackImages();
  
  // Load search parameters from home page
  loadSearchParameters();
  
  initializePage();
  fetchHotels(); // load hotels from backend
});

// ================= SEARCH PARAMETERS =================
function loadSearchParameters() {
  const searchParams = localStorage.getItem('searchParams');
  if (searchParams) {
    try {
      const params = JSON.parse(searchParams);
      
      // Set search input if destination is provided
      if (params.destination) {
        $('#searchInput').val(params.destination);
        
        // Store the destination for automatic filtering
        window.autoFilterDestination = params.destination;
      }
      
      // Store search parameters for use in booking
      window.searchParams = params;
      
      // Clear the stored parameters after loading
      localStorage.removeItem('searchParams');
      
      // Show a message that search was applied
      if (params.destination) {
        showSearchMessage(`Searching for hotels in: ${params.destination}`);
      }
    } catch (e) {
      console.log('Error loading search parameters:', e);
    }
  }
}

function showSearchMessage(message) {
  // Create a temporary message element
  const messageDiv = $(`
    <div class="alert alert-info alert-dismissible fade show" role="alert" style="margin-top: 20px;">
      <i class="fas fa-search me-2"></i>${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `);
  
  // Insert after the search section
  $('.search-section').after(messageDiv);
  
  // Auto-dismiss after 8 seconds (longer for search results)
  setTimeout(() => {
    messageDiv.alert('close');
  }, 8000);
}

function updateSearchMessageWithResults(destination, resultCount) {
  // Remove existing search message
  $('.alert-info').remove();
  
  // Create updated message with results
  const message = resultCount > 0 
    ? `Found ${resultCount} hotel${resultCount === 1 ? '' : 's'} in ${destination}`
    : `No hotels found in ${destination}. Try a different destination.`;
    
  const messageDiv = $(`
    <div class="alert ${resultCount > 0 ? 'alert-success' : 'alert-warning'} alert-dismissible fade show" role="alert" style="margin-top: 20px;">
      <i class="fas fa-${resultCount > 0 ? 'check-circle' : 'exclamation-triangle'} me-2"></i>${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `);
  
  // Insert after the search section
  $('.search-section').after(messageDiv);
  
  // Auto-dismiss after 8 seconds
  setTimeout(() => {
    messageDiv.alert('close');
  }, 8000);
}

// ================= IMAGE HANDLING =================
// Array of high-quality fallback images for better variety
const fallbackImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=400&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=400&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=400&fit=crop&q=80&auto=format',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=400&fit=crop&q=80&auto=format'
];

let fallbackIndex = 0;

function getNextFallbackImage() {
  const image = fallbackImages[fallbackIndex];
  fallbackIndex = (fallbackIndex + 1) % fallbackImages.length;
  return image;
}

function handleImageError(img, hotelId) {
  console.log(`Image failed to load for hotel ${hotelId}, using fallback`);
  const fallbackUrl = getNextFallbackImage();
  img.style.backgroundImage = `url('${fallbackUrl}')`;
  img.classList.add('image-fallback');
}

function getHotelImageUrl(hotel) {
  // Return a high-quality image URL if no photos are available
  if (hotel.photos && hotel.photos.length > 0 && hotel.photos[0]) {
    const imageUrl = hotel.photos[0];
    
    // If it's a relative path (starts with /), convert it to a proper URL
    if (imageUrl.startsWith('/')) {
      // Convert relative path to full URL using your Spring Boot server
      return `http://localhost:8080${imageUrl}`;
    }
    
    // If it's already a full URL, optimize it for better quality
    if (imageUrl.includes('unsplash.com')) {
      // Optimize Unsplash URLs for better quality
      return imageUrl.replace(/w=\d+&h=\d+/, 'w=800&h=400').replace(/&q=\d+/, '&q=80') + '&auto=format&fit=crop';
    }
    
    // If it's already a full URL, use it as is
    return imageUrl;
  }
  
  // Use a high-quality fallback image for variety
  return getNextFallbackImage();
}

function createImageElement(imageUrl, hotelId) {
  const img = new Image();
  img.onload = function() {
    console.log(`Image loaded successfully for hotel ${hotelId}`);
  };
  img.onerror = function() {
    handleImageError(this, hotelId);
  };
  img.src = imageUrl;
  return img;
}

function initializeImageLoading() {
  // Add loading states and error handling to all hotel images
  $('.hotel-image').each(function() {
    const $imageDiv = $(this);
    const hotelId = $imageDiv.data('hotel-id');
    const currentBgImage = $imageDiv.css('background-image');
    
    if (currentBgImage && currentBgImage !== 'none') {
      // Extract URL from background-image CSS
      const urlMatch = currentBgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (urlMatch) {
        const imageUrl = urlMatch[1];
        
        // Show loading spinner
        $imageDiv.find('.image-loading').show();
        
        // Create high-quality image for preloading
        const testImg = new Image();
        testImg.crossOrigin = 'anonymous'; // Enable CORS for better quality
        testImg.onload = function() {
          // Image loaded successfully, hide loading spinner
          $imageDiv.find('.image-loading').hide();
          $imageDiv.removeClass('image-loading-error');
          
          // Update background image with the loaded high-quality version
          $imageDiv.css('background-image', `url('${imageUrl}')`);
        };
        testImg.onerror = function() {
          // Image failed to load, use fallback
          $imageDiv.find('.image-loading').hide();
          $imageDiv.addClass('image-loading-error');
          handleImageError($imageDiv[0], hotelId);
        };
        testImg.src = imageUrl;
      }
    }
  });
}

// Preload high-quality fallback images for better performance
function preloadFallbackImages() {
  fallbackImages.forEach((imageUrl, index) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      console.log(`Fallback image ${index + 1} preloaded successfully`);
    };
    img.src = imageUrl;
  });
}

// ================= FETCH HOTELS =================
function fetchHotels(keyword = '') {
  // Hotel endpoints are public, no token required
  
  // Use auto-filter destination if available and no keyword provided
  const searchKeyword = keyword || window.autoFilterDestination || '';
  
  const url = searchKeyword
    ? `http://localhost:8080/api/innrise/hotel/search/${searchKeyword}`
    : 'http://localhost:8080/api/innrise/hotel/getAll';

  $('#hotelsList').html(`
        <div class="loading">
            <div class="spinner"></div>
            <span>Loading hotels...</span>
        </div>
    `);

  $.ajax({
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Remove Authorization header for public hotel endpoints
    },
    xhrFields: {
      withCredentials: false
    },
    success: function(response) {
      const hotels = response.data || [];
      cachedHotels = hotels; // Cache the hotels data
      filteredHotels = hotels; // Initialize filtered hotels
      currentPage = 1; // Reset to first page
      
      // Update search message with results
      if (window.autoFilterDestination) {
        // Auto-filter from home page
        const destination = window.autoFilterDestination;
        updateSearchMessageWithResults(destination, hotels.length);
        window.autoFilterDestination = null; // Clear after use
      } else if (searchKeyword) {
        // Manual search from hotel page
        updateSearchMessageWithResults(searchKeyword, hotels.length);
      }
      
      updatePagination();
      renderHotels();
      updateMapView(hotels);
    },
    error: function(xhr) {
      console.error('Hotel fetch error:', xhr);
      let errorMessage = 'Unknown error occurred';

      if (xhr.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (xhr.status === 0) {
        errorMessage = 'Network error. Please check if the server is running.';
      } else if (xhr.responseJSON?.message) {
        errorMessage = xhr.responseJSON.message;
      } else if (xhr.statusText) {
        errorMessage = xhr.statusText;
      }

      $('#hotelsList').html(`
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Error loading hotels</h4>
                    <p>${errorMessage}</p>
                    <small>Status: ${xhr.status}</small>
                </div>
            `);
    }
  });
}

// ================= PAGE SETUP =================
function initializePage() {
  const today = new Date().toISOString().split('T')[0];
  $('#checkIn').attr('min', today);
  $('#checkOut').attr('min', today);

  $('#locationSearch').on('input', debounce(() => {
    const keyword = $('#locationSearch').val().trim();
    if (keyword) {
      fetchHotels(keyword);
    } else {
      // If search is cleared, fetch all hotels from backend
      fetchHotels();
      // Clear any search messages
      $('.alert-info, .alert-success, .alert-warning').remove();
    }
  }, 300));

  $('#checkIn').on('change', handleCheckInChange);
  $('#priceRange, #guestCount').on('change', filterHotels);

  $(document).on('keydown', handleKeyboardShortcuts);
}

// ================= DEBOUNCE =================
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }
}

// ================= DATE CHANGE =================
function handleCheckInChange() {
  const checkIn = $('#checkIn').val();
  const checkOutEl = $('#checkOut');

  if (checkIn) {
    const nextDay = new Date(checkIn);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    checkOutEl.attr('min', nextDayStr);

    if (!checkOutEl.val() || checkOutEl.val() <= checkIn) {
      checkOutEl.val(nextDayStr);
    }
  }
}

// ================= RENDER HOTELS =================
function renderHotels() {
  if (!filteredHotels || filteredHotels.length === 0) {
    $('#hotelsList').html(`
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h4>No hotels found</h4>
                <p>Try adjusting your search criteria</p>
            </div>
        `);
    return;
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const hotelsToShow = filteredHotels.slice(startIndex, endIndex);

  const hotelHTML = hotelsToShow.map(hotel => {
    const photoUrl = getHotelImageUrl(hotel);
    const price = hotel.price || hotel.rooms?.[0]?.price || 0;

    return `
      <div class="hotel-card" data-hotel-id="${hotel.hotelId}" onclick="navigateToHotelProfile(${hotel.hotelId})">
          <div class="hotel-image" data-hotel-id="${hotel.hotelId}" style="background-image: url('${photoUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
              <div class="image-loading" style="display: none;">
                  <i class="fas fa-spinner fa-spin"></i>
              </div>
              <div class="hotel-price">LKR ${price}/night</div>
              <div class="hotel-rating">
                  <i class="fas fa-star"></i> ${hotel.star_rating || '-'}
              </div>
          </div>
          <div class="hotel-info">
              <h3 class="hotel-title">${hotel.name}</h3>
              <div class="hotel-location">
                  <i class="fas fa-map-marker-alt"></i> ${hotel.location}
              </div>
              <div class="hotel-actions">
                  <button class="btn-view-details" onclick="event.stopPropagation(); navigateToHotelProfile(${hotel.hotelId})">
                      View Details
                  </button>
                  <button class="btn-book-now" onclick="event.stopPropagation(); bookHotel(${hotel.hotelId})">
                      Book Now
                  </button>
              </div>
          </div>
      </div>
    `;
  }).join('');

  $('#hotelsList').html(hotelHTML);
  
  // Initialize image loading for all hotel cards
  initializeImageLoading();
}

// ================= FILTER HOTELS =================
function filterHotels() {
  const location = $('#locationSearch').val().toLowerCase().trim();
  const priceRange = $('#priceRange').val();

  // Filter hotels based on criteria
  filteredHotels = cachedHotels.filter(hotel => {
    const hotelName = hotel.name.toLowerCase();
    const hotelLoc = hotel.location.toLowerCase();
    const hotelPrice = hotel.price || hotel.rooms?.[0]?.price || 0;

    let match = true;

    // Location filter
    if (location && !(hotelName.includes(location) || hotelLoc.includes(location))) {
      match = false;
    }

    // Price filter
    if (priceRange) {
      switch(priceRange) {
        case '0-100': match = match && hotelPrice <= 100; break;
        case '100-200': match = match && hotelPrice > 100 && hotelPrice <= 200; break;
        case '200-300': match = match && hotelPrice > 200 && hotelPrice <= 300; break;
        case '300+': match = match && hotelPrice > 300; break;
      }
    }

    return match;
  });

  // Reset to first page and update pagination
  currentPage = 1;
  updatePagination();
  renderHotels();
}

// ================= HOTEL SELECT =================
function selectHotel(hotelId) {
  $('.hotel-card').removeClass('highlighted');
  const card = $(`.hotel-card[data-hotel-id="${hotelId}"]`);
  card.addClass('highlighted');
  setTimeout(() => card.removeClass('highlighted'), 2000);
}

// ================= MAP VIEW =================
function toggleMapView(view) {
  currentMapView = view;
  $('.toggle-btn').removeClass('active');
  event.target.classList.add('active');
  fetchHotels($('#locationSearch').val().trim());
}

function updateMapView(hotels) {
  const mapEl = $('#map');

  if (currentMapView === 'list') {
    const listHTML = hotels.map(hotel => `
      <div class="location-item" onclick="navigateToHotelProfile(${hotel.hotelId})">
          <div class="location-icon"><i class="fas fa-map-marker-alt"></i></div>
          <div class="location-info">
              <div class="fw-bold">${hotel.name}</div>
              <div class="text-muted">${hotel.location}</div>
          </div>
      </div>
    `).join('');

    mapEl.html(`
      <div class="map-list-view">
          <h5 class="mb-3">Hotel Locations</h5>
          ${listHTML || '<p class="text-muted text-center">No hotels to display</p>'}
      </div>
    `);
  } else {
    mapEl.html(`
      <div class="map-placeholder">
          <div>
              <i class="fas fa-map fa-3x mb-3"></i><br>
              Interactive Google Maps will load here<br>
              <small>Click on hotel markers to view details</small><br><br>
              <small class="text-muted">Showing ${hotels.length} hotel${hotels.length !== 1 ? 's' : ''}</small>
          </div>
      </div>
    `);
  }
}

// ================= DETAILS + BOOK =================
function navigateToHotelProfile(hotelId) {
  // Redirect to hotel profile page with hotel ID
  window.location.href = `hotel-profile.html?id=${hotelId}`;
}

function viewHotelDetails(hotelId) {
  // Alias for navigateToHotelProfile for backward compatibility
  navigateToHotelProfile(hotelId);
}

function bookHotel(hotelId) {
  // Use cached data instead of making another API call
  const hotel = cachedHotels.find(h => h.hotelId === hotelId);
  if (hotel) {
    openBookingModal(hotel);
  } else {
    alert('Hotel information not found. Please refresh the page and try again.');
  }
}

// ================= LOGOUT =================
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.tokenManager.logout();
  }
}

// ================= SHORTCUT KEYS =================
function handleKeyboardShortcuts(e) {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'f': e.preventDefault(); $('#locationSearch').focus(); break;
      case 'm': e.preventDefault(); toggleMapView(currentMapView === 'map' ? 'list' : 'map'); break;
    }
  }

  if (e.key === 'Escape') {
    $('#locationSearch').val('');
    $('#priceRange').val('');
    $('#guestCount').val('');
    fetchHotels();
  }
}

// ================= PAGINATION FUNCTIONS =================
function updatePagination() {
  totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  
  // Ensure current page is valid
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  renderPaginationControls();
}

function renderPaginationControls() {
  if (totalPages <= 1) {
    $('#paginationControls').html('');
    return;
  }

  let paginationHTML = '<div class="pagination-wrapper">';
  
  // Previous button
  paginationHTML += `
    <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
            onclick="goToPage(${currentPage - 1})" 
            ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fas fa-chevron-left"></i> Previous
    </button>
  `;

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
    if (startPage > 2) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
              onclick="goToPage(${i})">
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
    paginationHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  // Next button
  paginationHTML += `
    <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
            onclick="goToPage(${currentPage + 1})" 
            ${currentPage === totalPages ? 'disabled' : ''}>
      Next <i class="fas fa-chevron-right"></i>
    </button>
  `;

  // Page info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredHotels.length);
  
  paginationHTML += `
    <div class="pagination-info">
      Showing ${startItem}-${endItem} of ${filteredHotels.length} hotels
    </div>
  `;

  paginationHTML += '</div>';
  
  $('#paginationControls').html(paginationHTML);
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages && page !== currentPage) {
    currentPage = page;
    renderHotels();
    renderPaginationControls();
    
    // Scroll to top of hotels list
    $('html, body').animate({
      scrollTop: $('#hotelsList').offset().top - 100
    }, 500);
  }
}

function changeItemsPerPage(newItemsPerPage) {
  itemsPerPage = newItemsPerPage;
  currentPage = 1;
  updatePagination();
  renderHotels();
}

// ================= BOOKING MODAL FUNCTIONS =================
let currentBookingHotel = null;
let currentBookingRooms = [];
let selectedRoomId = null;

function openBookingModal(hotel) {
  currentBookingHotel = hotel;
  selectedRoomId = null; // Reset selected room
  
  // Populate hotel information
  $('#bookingHotelName').text(`Book ${hotel.name}`);
  $('#bookingHotelTitle').text(hotel.name);
  $('#bookingHotelLocation').text(hotel.location);
  $('#bookingHotelRating').text(hotel.star_rating || '-');
  
  // Set hotel image with improved loading
  const imageUrl = getHotelImageUrl(hotel);
  const $bookingImage = $('#bookingHotelImage');
  $bookingImage.css('background-image', `url('${imageUrl}')`);
  
  // Test image loading for booking modal with high quality
  const testImg = new Image();
  testImg.crossOrigin = 'anonymous'; // Enable CORS for better quality
  testImg.onload = function() {
    console.log(`Booking modal image loaded for hotel ${hotel.hotelId}`);
    // Update with high-quality version
    $bookingImage.css('background-image', `url('${imageUrl}')`);
  };
  testImg.onerror = function() {
    console.log(`Booking modal image failed for hotel ${hotel.hotelId}, using fallback`);
    const fallbackUrl = getNextFallbackImage();
    $bookingImage.css('background-image', `url('${fallbackUrl}')`);
  };
  testImg.src = imageUrl;
  
  // Set default dates from search form or home page search parameters
  let checkIn = $('#checkIn').val();
  let checkOut = $('#checkOut').val();
  let guests = $('#guestCount').val() || '1';
  
  // Use search parameters from home page if available
  if (window.searchParams) {
    if (window.searchParams.checkIn) checkIn = window.searchParams.checkIn;
    if (window.searchParams.checkOut) checkOut = window.searchParams.checkOut;
    if (window.searchParams.guests) guests = window.searchParams.guests;
  }
  
  if (checkIn) $('#bookingCheckIn').val(checkIn);
  if (checkOut) $('#bookingCheckOut').val(checkOut);
  if (guests) $('#bookingGuests').val(guests);
  
  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  $('#bookingCheckIn').attr('min', today);
  $('#bookingCheckOut').attr('min', today);
  
  // Reset form
  $('#bookingForm')[0].reset();
  if (checkIn) $('#bookingCheckIn').val(checkIn);
  if (checkOut) $('#bookingCheckOut').val(checkOut);
  if (guests) $('#bookingGuests').val(guests);
  
  // Load available rooms
  loadAvailableRooms(hotel.hotelId);
  
  // Update summary
  updateBookingSummary();
  
  // Show modal
  $('#bookingModal').fadeIn(300);
  $('body').css('overflow', 'hidden'); // Prevent background scrolling
}

function closeBookingModal() {
  $('#bookingModal').fadeOut(300);
  $('body').css('overflow', 'auto'); // Restore scrolling
  currentBookingHotel = null;
  currentBookingRooms = [];
  selectedRoomId = null;
}

// ================= ROOM SELECTION FUNCTIONS =================
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
      <button class="btn btn-outline-primary btn-sm mt-2" onclick="loadAvailableRooms(${currentBookingHotel?.hotelId})">
        <i class="fas fa-refresh me-1"></i>Try Again
      </button>
    </div>
  `);
}

function updateBookingSummary() {
  if (!currentBookingHotel) return;
  
  const checkIn = $('#bookingCheckIn').val();
  const checkOut = $('#bookingCheckOut').val();
  const rooms = parseInt($('#bookingRooms').val()) || 1;
  
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
  
  const total = price * nights * rooms;
  
  // Update summary with room-specific information
  $('#summarySelectedRoom').text(roomType);
  $('#summaryPricePerNight').text(`LKR ${price}`);
  $('#summaryNights').text(nights);
  $('#summaryRooms').text(rooms);
  $('#summaryTotal').text(`LKR ${total.toFixed(2)}`);
  
  // Enable/disable confirm button based on valid dates
  const confirmBtn = $('.btn-confirm-booking');
  if (nights > 0 && checkIn && checkOut) {
    confirmBtn.prop('disabled', false);
  } else {
    confirmBtn.prop('disabled', true);
  }
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

// Initialize booking modal event listeners
$(document).ready(function() {
  // Handle form input changes
  $('#bookingCheckIn, #bookingCheckOut, #bookingRooms').on('change', updateBookingSummary);
  
  // Handle form submission
  $('#bookingForm').on('submit', handleBookingFormSubmit);
  
  // Handle check-in date change to update check-out minimum
  $('#bookingCheckIn').on('change', function() {
    const checkIn = $(this).val();
    if (checkIn) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];
      $('#bookingCheckOut').attr('min', nextDayStr);
      
      // If check-out is before the new minimum, update it
      if ($('#bookingCheckOut').val() && $('#bookingCheckOut').val() <= checkIn) {
        $('#bookingCheckOut').val(nextDayStr);
      }
    }
    updateBookingSummary();
  });
  
  // Close modal when clicking outside
  $('#bookingModal').on('click', function(e) {
    if (e.target === this) {
      closeBookingModal();
    }
  });
  
  // Close modal with Escape key
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $('#bookingModal').is(':visible')) {
      closeBookingModal();
    }
  });

  // Navigation Book Now button functionality
  $('#navBookNow').on('click', function(e) {
    e.preventDefault();
    // Scroll to the hotels section
    $('html, body').animate({
      scrollTop: $('.hotels-section').offset().top - 100
    }, 800);
  });
});
