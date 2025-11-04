// script.js — interactions (search, signup/login storage, small UX)

// Navbar scroll subtle shadow change
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.custom-navbar');
  if (!nav) return;
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
  } else {
    nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
  }
});

// Search handling
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (document.getElementById('searchInput')?.value || '').trim();
    if (!q) { alert('Please type a search term.'); return; }
    // For now just show result - can route to results page
    alert('search:"${q}" (demo)');
  });
}

// SIGN UP - save to localStorage
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    if (!name || !email || !password) { alert('Please fill all fields'); return; }

    // store user as object in localStorage (demo)
    const user = { name, email, password, createdAt: new Date().toISOString() };
    localStorage.setItem('elevana_user', JSON.stringify(user));

    // close modal if using bootstrap
    const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
    if (signupModal) signupModal.hide();

    alert('Welcome, ${name}! Account created (demo)');
    signupForm.reset();
  });
}

// LOGIN - verify localStorage
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const raw = localStorage.getItem('elevana_user');
    if (!raw) {
      alert('No account found. Please sign up first.');
      return;
    }
    const saved = JSON.parse(raw);
    if (saved.email === email && saved.password === password) {
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (loginModal) loginModal.hide();

      // store 'session' flag (demo)
      localStorage.setItem('elevana_session', JSON.stringify({ email: saved.email, name: saved.name, loggedAt: new Date().toISOString() }));
      alert('Welcome back, ${saved.name}!');
      loginForm.reset();
    } else {
      alert('Invalid credentials. Try again.');
    }
  });
}
 document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => {
    alert('All the best for your journey');
  });
});

// Highlight stars on hover and click
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  const ratingValue = document.getElementById("ratingValue");
  const submitBtn = document.getElementById("submitBtn");
  let userRating = 0;

  // Highlight stars on click
  stars.forEach(star => {
    star.addEventListener("click", () => {
      userRating = parseInt(star.getAttribute("data-value"));
      highlightStars(userRating);
       ratingValue.textContent = 'Thank you for rating us⭐';
    });
  });

  function highlightStars(count) {
    stars.forEach(star => {
      star.classList.remove("active");
      if (parseInt(star.getAttribute("data-value")) <= count) {
        star.classList.add("active");
      }
    });
  }

  // Handle submit
  submitBtn.addEventListener("click", () => {
    const review = document.getElementById("reviewText").value.trim();

    if (userRating === 0) {
      alert("Please select a rating first!");
      return;
    }
    if (review === "") {
      alert("Please write a short review before submitting!");
      return;
    }

    alert('Thank you for your ${userRating}-star rating!\nYour review: "${review}"');

    // Reset after submit
    userRating = 0;
    highlightStars(0);
    ratingValue.textContent = "You haven’t rated yet.";
    document.getElementById("reviewText").value = "";
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".testimonial-card");
  cards.forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(30px)";
    setTimeout(() => {
      card.style.transition = "0.6s ease";
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, 300 * i);
  });
});
// Page fade-in
// Fade in on load for smooth look
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.transition = 'opacity 260ms ease, transform 260ms ease';
  document.body.style.opacity = '1';
  document.body.style.transform = 'translateY(0)';
});

// Intercept card link clicks to add quick fade-out then go
document.querySelectorAll('.card-link').forEach(link => {
  link.addEventListener('click', (e) => {
    // normal anchor navigation prevented to allow fade
    e.preventDefault();
    const href = link.getAttribute('href');
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(6px)';
    setTimeout(() => { window.location.href = href; }, 300);
  });
});
