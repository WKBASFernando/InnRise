// ===================== GOOGLE LOGIN =====================
function initGoogleSignIn() {
  const gsiScript = document.createElement('script');
  gsiScript.src = "https://accounts.google.com/gsi/client";
  gsiScript.async = true;
  gsiScript.defer = true;
  document.head.appendChild(gsiScript);

  gsiScript.onload = () => {
    console.log('Google Identity Services loaded');

    google.accounts.id.initialize({
      client_id: '427810863490-vvr3a2jimu7ki8du7up4ofatfteqrit0.apps.googleusercontent.com',
      callback: handleGoogleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', width: 300 }
    );

    google.accounts.id.prompt(); // optional auto prompt
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
      if (res.data && res.data.accessToken) {
        localStorage.setItem('bearerToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        
        // Decode token to get user role and redirect accordingly
        try {
          const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]));
          const userRole = payload.role;
          
          // Redirect based on role
          if (userRole === 'ADMIN') {
            window.location.href = 'admin-dashboard.html';
          } else if (userRole === 'HOTEL_ADMIN') {
            window.location.href = 'hotel-admin-dashboard.html';
          } else {
            window.location.href = '../index.html';
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          // Fallback to default redirect
          window.location.href = '../index.html';
        }
      } else {
        alert(res.message || 'No token received');
      }
    },
    error: function(err) {
      console.error('Google login error:', err);
      alert('Google login failed');
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
    alert('Please fill in all fields');
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
      if (response.data && response.data.accessToken) {
        localStorage.setItem('bearerToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Decode token to get user role and redirect accordingly
        try {
          const payload = JSON.parse(atob(response.data.accessToken.split('.')[1]));
          const userRole = payload.role;
          
          // Redirect based on role
          if (userRole === 'ADMIN') {
            window.location.href = 'admin-dashboard.html';
          } else if (userRole === 'HOTEL_ADMIN') {
            window.location.href = 'hotel-admin-dashboard.html';
          } else {
            window.location.href = '../index.html';
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          // Fallback to default redirect
          window.location.href = '../index.html';
        }
      } else {
        alert(response.message || 'Login successful but no token received');
        console.log('Full backend response:', response);
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
      
      alert(`Error: ${errMsg}`);
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
  const email = prompt('Enter your email address to reset your password:');
  if (email) {
    alert(`Password reset link sent to ${email}`);
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
