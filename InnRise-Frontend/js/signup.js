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
      callback: handleGoogleCredentialResponse
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
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        window.location.href = '../index.html';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: res.message || 'No token received',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f97316'
        });
      }
    },
    error: function(err) {
      console.error('Google login error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Google Signup Failed',
        text: 'Google signup failed. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
    }
  });
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

// ====== Redirects ======
function goToSignIn() {
  window.location.href = "pages/signin.html";
}

function showTerms() {
  Swal.fire({
    title: 'Terms of Service',
    html: `
      <div style="text-align: left; max-height: 400px; overflow-y: auto;">
        <h4>1. Acceptance of Terms</h4>
        <p>By using InnRise, you agree to be bound by these Terms of Service.</p>
        
        <h4>2. Use License</h4>
        <p>Permission is granted to temporarily use InnRise for personal, non-commercial transitory viewing only.</p>
        
        <h4>3. User Accounts</h4>
        <p>You are responsible for maintaining the confidentiality of your account and password.</p>
        
        <h4>4. Booking and Payment</h4>
        <p>All bookings are subject to availability and payment terms.</p>
        
        <h4>5. Cancellation Policy</h4>
        <p>Cancellation policies vary by hotel and booking type.</p>
      </div>
    `,
    width: 600,
    confirmButtonText: 'I Understand',
    confirmButtonColor: '#f97316'
  });
}

function showPrivacy() {
  Swal.fire({
    title: 'Privacy Policy',
    html: `
      <div style="text-align: left; max-height: 400px; overflow-y: auto;">
        <h4>1. Information We Collect</h4>
        <p>We collect information you provide directly to us, such as when you create an account or make a booking.</p>
        
        <h4>2. How We Use Your Information</h4>
        <p>We use the information we collect to provide, maintain, and improve our services.</p>
        
        <h4>3. Information Sharing</h4>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
        
        <h4>4. Data Security</h4>
        <p>We implement appropriate security measures to protect your personal information.</p>
        
        <h4>5. Your Rights</h4>
        <p>You have the right to access, update, or delete your personal information.</p>
      </div>
    `,
    width: 600,
    confirmButtonText: 'I Understand',
    confirmButtonColor: '#f97316'
  });
}

// ====== Password strength checker ======
document.getElementById("signupPassword").addEventListener("input", function (e) {
  const password = e.target.value;
  const strengthIndicator = document.getElementById("passwordStrength");
  const strengthFill = document.getElementById("strengthFill");
  const strengthText = document.getElementById("strengthText");

  if (!password) {
    strengthIndicator.style.display = "none";
    return;
  }

  strengthIndicator.style.display = "block";

  let strength = 0;
  let feedback = [];

  if (password.length >= 8) strength += 25;
  else feedback.push("at least 8 characters");

  if (/[A-Z]/.test(password)) strength += 25;
  else feedback.push("uppercase letter");

  if (/[0-9]/.test(password)) strength += 25;
  else feedback.push("number");

  if (/[^A-Za-z0-9]/.test(password)) strength += 25;
  else feedback.push("special character");

  strengthFill.style.width = strength + "%";

  if (strength < 50) {
    strengthText.textContent = "Weak - Add " + feedback.slice(0, 2).join(", ");
    strengthText.style.color = "#e53e3e";
  } else if (strength < 75) {
    strengthText.textContent = "Good - Add " + feedback[0];
    strengthText.style.color = "#dd6b20";
  } else {
    strengthText.textContent = "Strong password";
    strengthText.style.color = "#38a169";
  }
});

// ====== Real-time email validation ======
document.getElementById("signupEmail").addEventListener("input", function (e) {
  const email = e.target.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    e.target.style.borderColor = "#e53e3e";
    e.target.style.boxShadow = "0 0 0 4px rgba(229, 62, 62, 0.12)";
  } else if (email) {
    e.target.style.borderColor = "#38a169";
    e.target.style.boxShadow = "0 0 0 4px rgba(56, 161, 105, 0.12)";
  } else {
    e.target.style.borderColor = "rgba(226, 232, 240, 0.8)";
    e.target.style.boxShadow = "none";
  }
});

// ====== Password match validation ======
document.getElementById("confirmPassword").addEventListener("input", function (e) {
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = e.target.value;

  if (confirmPassword && password !== confirmPassword) {
    e.target.style.borderColor = "#e53e3e";
    e.target.style.boxShadow = "0 0 0 4px rgba(229, 62, 62, 0.12)";
  } else if (confirmPassword) {
    e.target.style.borderColor = "#38a169";
    e.target.style.boxShadow = "0 0 0 4px rgba(56, 161, 105, 0.12)";
  } else {
    e.target.style.borderColor = "rgba(226, 232, 240, 0.8)";
    e.target.style.boxShadow = "none";
  }
});

// ====== Normal signup form ======
$(document).ready(function () {
  $(".signup-form").on("submit", function (e) {
    e.preventDefault();

    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const email = $("#signupEmail").val();
    const password = $("#signupPassword").val();
    const confirmPassword = $("#confirmPassword").val();
    const terms = $("#terms").is(":checked");
    const btn = $("#signupBtn");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Passwords do not match',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Too Short',
        text: 'Password must be at least 8 characters long',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    if (!terms) {
      Swal.fire({
        icon: 'warning',
        title: 'Terms Agreement Required',
        text: 'Please agree to the Terms of Service and Privacy Policy',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    btn.text("Creating Account...").prop("disabled", true);

    $.ajax({
      url: "http://localhost:8080/auth/register",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        role: "USER",
      }),
      success: function (response) {
        if (response.data && response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        window.location.href = "../index.html";
      },
      error: function (xhr) {
        console.error("Signup failed:", xhr.responseText);
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: xhr.responseJSON?.message || "Signup failed. Please try again.",
          confirmButtonText: 'OK',
          confirmButtonColor: '#f97316'
        });
      },
      complete: function () {
        btn.text("Create Account").prop("disabled", false);
      },
    });
  });
});

// ===================== DOM READY =====================
$(document).ready(function() {
  initGoogleSignIn(); // initialize Google login once
  $('#signinForm').on('submit', handleSignIn);
});

