// Check if user is authenticated
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = './pages/signin.html';
}

// Initialize home page functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeSearchForm();
  initializeDateInputs();
  loadSearchParams();
});

// Initialize search form with default values
function initializeSearchForm() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const checkInInput = document.querySelector('input[placeholder="Check-in"]');
  const checkOutInput = document.querySelector('input[placeholder="Check-out"]');
  
  if (checkInInput) {
    checkInInput.value = today.toISOString().split('T')[0];
    checkInInput.min = today.toISOString().split('T')[0];
  }
  
  if (checkOutInput) {
    checkOutInput.value = tomorrow.toISOString().split('T')[0];
    checkOutInput.min = tomorrow.toISOString().split('T')[0];
  }
}

// Initialize date inputs with proper constraints
function initializeDateInputs() {
  const checkInInput = document.querySelector('input[placeholder="Check-in"]');
  const checkOutInput = document.querySelector('input[placeholder="Check-out"]');
  
  if (checkInInput && checkOutInput) {
    checkInInput.addEventListener('change', function() {
      const checkInDate = new Date(this.value);
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      checkOutInput.min = nextDay.toISOString().split('T')[0];
      
      // If check-out is before the new minimum, update it
      if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
        checkOutInput.value = nextDay.toISOString().split('T')[0];
      }
    });
  }
}

// Load search parameters from localStorage if available
function loadSearchParams() {
  const savedParams = localStorage.getItem('searchParams');
  if (savedParams) {
    try {
      const params = JSON.parse(savedParams);
      
      const destinationInput = document.querySelector('input[placeholder="Destination"]');
      const checkInInput = document.querySelector('input[placeholder="Check-in"]');
      const checkOutInput = document.querySelector('input[placeholder="Check-out"]');
      const guestsSelect = document.querySelector('select');
      
      if (params.destination && destinationInput) {
        destinationInput.value = params.destination;
      }
      if (params.checkIn && checkInInput) {
        checkInInput.value = params.checkIn;
      }
      if (params.checkOut && checkOutInput) {
        checkOutInput.value = params.checkOut;
      }
      if (params.guests && guestsSelect) {
        guestsSelect.value = params.guests;
      }
    } catch (e) {
      console.log('Error loading search parameters:', e);
    }
  }
}

// Scroll to top functionality
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', function() {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }
});

scrollToTopBtn.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Enhanced search functionality
document.querySelector('.btn-search').addEventListener('click', function(e) {
  e.preventDefault();
  
  // Get form data
  const destination = document.querySelector('input[placeholder="Destination"]').value;
  const checkIn = document.querySelector('input[placeholder="Check-in"]').value;
  const checkOut = document.querySelector('input[placeholder="Check-out"]').value;
  const guests = document.querySelector('select').value;
  
  // Basic validation - detailed validation will be done by backend
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Dates',
        text: 'Check-out date must be after check-in date!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }
  }
  
  // Store search parameters in localStorage for hotel page
  const searchParams = {
    destination: destination,
    checkIn: checkIn,
    checkOut: checkOut,
    guests: guests
  };
  
  localStorage.setItem('searchParams', JSON.stringify(searchParams));
  
  // Redirect to hotel page with search parameters
  window.location.href = './pages/hotel.html';
});

// Enhanced newsletter subscription
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    Swal.fire({
      icon: 'warning',
      title: 'Email Required',
      text: 'Please enter your email address.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316'
    });
    return;
  }
  
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Email',
      text: 'Please enter a valid email address.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316'
    });
    return;
  }
  
  // Store subscription in localStorage (in real app, this would go to backend)
  const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
  if (!subscriptions.includes(email)) {
    subscriptions.push(email);
    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
    Swal.fire({
      icon: 'success',
      title: 'Subscribed!',
      text: 'Thank you for subscribing to our newsletter! You\'ll receive exclusive deals and travel inspiration.',
      confirmButtonText: 'Great!',
      confirmButtonColor: '#f97316'
    });
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Already Subscribed',
      text: 'This email is already subscribed to our newsletter.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316'
    });
  }
  
  this.reset();
});

// Add functionality to action buttons and footer links
document.addEventListener('DOMContentLoaded', function() {
  // Explore Destinations button
  const exploreDestinationsBtn = document.querySelector('a[href="#"]');
  if (exploreDestinationsBtn && exploreDestinationsBtn.textContent.includes('Explore Destinations')) {
    exploreDestinationsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Scroll to the features section
      document.querySelector('#about').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
  
  // Explore Hotels button (already has correct href)
  const exploreHotelsBtn = document.querySelector('a[href="pages/hotel.html"]');
  if (exploreHotelsBtn) {
    exploreHotelsBtn.addEventListener('click', function(e) {
      // Clear any existing search parameters for general browsing
      localStorage.removeItem('searchParams');
    });
  }
  
  // Footer link functionality
  initializeFooterLinks();
});

// Initialize footer links
function initializeFooterLinks() {
  // Quick Links
  const findHotelsLink = document.querySelector('a[href="pages/hotel.html"]');
  if (findHotelsLink) {
    findHotelsLink.addEventListener('click', function(e) {
      localStorage.removeItem('searchParams'); // Clear search for general browsing
    });
  }
  
  // Support Links - add placeholder functionality
  const supportLinks = document.querySelectorAll('footer a[href="#"]');
  supportLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const linkText = this.textContent;
      
      switch(linkText) {
        case 'Destinations':
          document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
          break;
        case 'Special Offers':
          Swal.fire({
            icon: 'info',
            title: 'Special Offers',
            text: 'Special offers coming soon! Check back regularly for exclusive deals.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Business Travel':
          Swal.fire({
            icon: 'info',
            title: 'Business Travel',
            text: 'Business travel services coming soon! Contact us for corporate bookings.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Gift Cards':
          Swal.fire({
            icon: 'info',
            title: 'Gift Cards',
            text: 'Gift cards coming soon! Perfect for gifting amazing hotel experiences.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Help Center':
          Swal.fire({
            icon: 'info',
            title: 'Help Center',
            text: 'Help Center coming soon! For now, please contact us directly.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Contact Us':
          window.location.href = 'pages/contact.html';
          break;
        case 'Booking Support':
          Swal.fire({
            icon: 'info',
            title: 'Booking Support',
            text: 'Need booking support? Contact us at support@innrise.com or call +94 11 234 5678',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Privacy Policy':
          Swal.fire({
            icon: 'info',
            title: 'Privacy Policy',
            text: 'We respect your privacy and protect your personal information. Full policy coming soon.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Terms of Service':
          Swal.fire({
            icon: 'info',
            title: 'Terms of Service',
            text: 'By using InnRise, you agree to our terms. Full terms coming soon.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Cookie Policy':
          Swal.fire({
            icon: 'info',
            title: 'Cookie Policy',
            text: 'We use cookies to enhance your experience. Full policy coming soon.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Accessibility':
          Swal.fire({
            icon: 'info',
            title: 'Accessibility',
            text: 'We are committed to making our website accessible to all users.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        case 'Sitemap':
          Swal.fire({
            icon: 'info',
            title: 'Sitemap',
            text: 'Navigate easily through our website sections.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f97316'
          });
          break;
        default:
          console.log('Link clicked:', linkText);
      }
    });
  });
  
  // Social media links
  const socialLinks = document.querySelectorAll('.social-links a');
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const platform = this.querySelector('i').className;
      
      if (platform.includes('facebook')) {
        Swal.fire({
          icon: 'info',
          title: 'Follow Us on Facebook',
          text: '@InnRiseOfficial',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f97316'
        });
      } else if (platform.includes('twitter')) {
        Swal.fire({
          icon: 'info',
          title: 'Follow Us on Twitter',
          text: '@InnRiseOfficial',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f97316'
        });
      } else if (platform.includes('instagram')) {
        Swal.fire({
          icon: 'info',
          title: 'Follow Us on Instagram',
          text: '@InnRiseOfficial',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f97316'
        });
      } else if (platform.includes('linkedin')) {
        Swal.fire({
          icon: 'info',
          title: 'Connect with Us on LinkedIn',
          text: 'InnRise',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f97316'
        });
      }
    });
  });
}

// Enhanced scroll animations and interactions
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  const scrolled = window.pageYOffset;

  // Navbar background change with smooth transition
  if (scrolled > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  }

  // Show/hide scroll to top with enhanced animation
  if (scrolled > 300) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }

  // Animate cards on scroll
  animateOnScroll();
});

// Card animation on scroll
function animateOnScroll() {
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach((card, index) => {
    const cardTop = card.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (cardTop < windowHeight * 0.8) {
      setTimeout(() => {
        card.style.animation = `cardSlideIn 0.6s ease-out forwards`;
      }, index * 200);
    }
  });
}

// Add CSS for card slide-in animation
const cardAnimationCSS = `
  @keyframes cardSlideIn {
    0% {
      opacity: 0;
      transform: translateY(50px) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const style = document.createElement('style');
style.textContent = cardAnimationCSS;
document.head.appendChild(style);

// Enhanced button interactions
document.querySelectorAll('.btn-primary, .btn-search').forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add ripple effect CSS
const rippleCSS = `
  .ripple-effect {
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    pointer-events: none;
    animation: ripple 0.6s linear;
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const rippleStyle = document.createElement('style');
rippleStyle.textContent = rippleCSS;
document.head.appendChild(rippleStyle);

// ================= LOGOUT FUNCTION =================
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to signin page
    window.location.href = 'pages/signin.html';
  }
}
