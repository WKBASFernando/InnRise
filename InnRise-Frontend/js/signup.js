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
        localStorage.setItem('bearerToken', res.data.accessToken);
        window.location.href = '../index.html';
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


// ====== Redirects ======
function goToSignIn() {
  window.location.href = "pages/signin.html";
}

function showTerms() {
  alert("Terms of Service would be displayed here in a modal or new page.");
}

function showPrivacy() {
  alert("Privacy Policy would be displayed here in a modal or new page.");
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
      alert("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (!terms) {
      alert("Please agree to the Terms of Service and Privacy Policy");
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
          localStorage.setItem("bearerToken", response.data.accessToken);
        }
        window.location.href = "../index.html";
      },
      error: function (xhr) {
        console.error("Signup failed:", xhr.responseText);
        alert(`Error: ${xhr.responseJSON?.message || "Signup failed 😢"}`);
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

