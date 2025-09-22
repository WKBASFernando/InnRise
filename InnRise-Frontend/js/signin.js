// ===================== GOOGLE LOGIN =====================
function initGoogleSignIn() {
  const gsiScript = document.createElement('script');
  gsiScript.src = "https://accounts.google.com/gsi/client";
  gsiScript.async = true;
  gsiScript.defer = true;
  document.head.appendChild(gsiScript);

  gsiScript.onload = () => {
    console.log('Google Identity Services loaded');

    try {
      google.accounts.id.initialize({
        client_id: '427810863490-vvr3a2jimu7ki8du7up4ofatfteqrit0.apps.googleusercontent.com',
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Render Google's default button
      google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large', width: 300 }
      );

      // google.accounts.id.prompt(); // optional auto prompt
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
    }
  };

  gsiScript.onerror = () => {
    console.error('Failed to load Google Identity Services');
    Swal.fire({
      icon: 'error',
      title: 'Google Sign-In Unavailable',
      text: 'Unable to load Google Sign-In. Please try manual login.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316'
    });
  };
}

function handleGoogleCredentialResponse(response) {
  console.log('JWT ID token:', response.credential);

  $.ajax({
    url: 'http://localhost:8080/auth/google',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ token: response.credential }),
        success: function(res) {
            console.log('Google Sign-In Response:', res);
            console.log('Response data:', res.data);
            
            // Check if response has the expected structure
            if (!res.data || !res.data.accessToken) {
                console.error('Invalid response structure:', res);
                Swal.fire({
                  icon: 'error',
                  title: 'Login Failed',
                  text: 'Invalid response from server',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#f97316'
                });
                return;
            }
            
            // Store token and user info
            localStorage.setItem('token', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            
            // Decode token to get role
            const token = res.data.accessToken;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload.role;
            
            // Redirect based on role
            if (role === 'ADMIN') {
                window.location.href = 'admin-dashboard.html';
            } else if (role === 'HOTEL_ADMIN') {
                window.location.href = 'hotel-admin-dashboard.html';
            } else {
                window.location.href = '../index.html';
            }
        },
    error: function(err) {
      console.error('Google login error:', err);
      console.error('Error response:', err.responseJSON);
      console.error('Error status:', err.status);
      console.error('Error text:', err.responseText);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: err.responseJSON?.message || err.responseText || 'Unknown error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
    }
  });
}

// ===================== NORMAL LOGIN =====================
function handleSignIn(event) {
  event.preventDefault();

  const email = $('#email').val();
  const password = $('#password').val();
  const btn = $('#signinBtn');

  if (!email || !password) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      text: 'Please fill in all fields',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316'
    });
    return;
  }

  btn.text('Signing In...');
  btn.prop('disabled', true);
  btn.css('background', 'linear-gradient(45deg, #718096, #a0aec0)');

  $.ajax({
    url: 'http://localhost:8080/auth/login',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ email: email, password: password }),
        success: function(response) {
            console.log('Login Response:', response);
            console.log('Response data:', response.data);
            
            // Check if response has the expected structure
            if (!response.data || !response.data.accessToken) {
                console.error('Invalid response structure:', response);
                Swal.fire({
                  icon: 'error',
                  title: 'Login Failed',
                  text: 'Invalid response from server',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#f97316'
                });
                return;
            }
            
            // Store token and user info
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            
            // Decode token to get role
            const token = response.data.accessToken;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload.role;
            
            // Redirect based on role
            if (role === 'ADMIN') {
                window.location.href = 'admin-dashboard.html';
            } else if (role === 'HOTEL_ADMIN') {
                window.location.href = 'hotel-admin-dashboard.html';
            } else {
                window.location.href = '../index.html';
            }
        },
    error: function(xhr) {
      console.error('Login error:', xhr);
      let errMsg = 'Login failed';
      
      if (xhr.responseJSON && xhr.responseJSON.message) {
        errMsg = xhr.responseJSON.message;
      } else if (xhr.responseText) {
        try {
          const errorData = JSON.parse(xhr.responseText);
          errMsg = errorData.message || errorData.data || 'Login failed';
        } catch (e) {
          errMsg = xhr.responseText;
        }
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: errMsg,
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      console.error('Full error response:', xhr.responseText);
    },
    complete: function() {
      btn.text('Sign In');
      btn.prop('disabled', false);
      btn.css('background', 'linear-gradient(45deg, #ff6b35, #f7931e)');
    }
  });
}

// ===================== FORGOT PASSWORD =====================
function handleForgotPassword() {
  // Directly redirect to OTP-based reset page
  window.location.href = 'reset-password-otp.html';
}

// ===================== PASSWORD TOGGLE FUNCTION =====================
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  const passwordIcon = document.getElementById(inputId + '-icon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    passwordIcon.classList.remove('fa-eye');
    passwordIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    passwordIcon.classList.remove('fa-eye-slash');
    passwordIcon.classList.add('fa-eye');
  }
}

// ===================== NAV TO SIGNUP =====================
function goToSignUp() {
  window.location.href = '../signup.html';
}

// ===================== REAL-TIME EMAIL VALIDATION =====================
$('#email').on('input', function(e) {
  const email = e.target.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    e.target.style.borderColor = '#e53e3e';
    e.target.style.boxShadow = '0 0 0 4px rgba(229, 62, 62, 0.12)';
  } else if (email && emailRegex.test(email)) {
    e.target.style.borderColor = '#38a169';
    e.target.style.boxShadow = '0 0 0 4px rgba(56, 161, 105, 0.12)';
  } else {
    e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
    e.target.style.boxShadow = 'none';
  }
});

// ===================== DOM READY =====================
$(document).ready(function() {
  initGoogleSignIn(); // initialize Google login once
  $('#signinForm').on('submit', handleSignIn);
});
