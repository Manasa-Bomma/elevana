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
//sai lakhmi
document.addEventListener("DOMContentLoaded", () => {
    /* ---------- helpers ---------- */
    const q = s => document.querySelector(s);
    const qa = s => Array.from(document.querySelectorAll(s));

    function loadArray(key, len = 0) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return new Array(len).fill(0);
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return new Array(len).fill(0);
            return parsed.map(x => {
                const n = Number(x);
                return Number.isFinite(n) ? n : 0;
            }).slice(0, Math.max(len, parsed.length));
        } catch (e) {
            return new Array(len).fill(0);
        }
    }

    function saveArray(key, arr) {
        try {
            localStorage.setItem(key, JSON.stringify(arr));
        } catch (e) {
            console.warn(e)
        }
    }

    /* ---------- navigation (flash cards) ---------- */
    const pages = qa(".page");

    function showPage(id) {
        pages.forEach(p => p.classList.remove("active"));
        const el = document.getElementById(id);
        if (el) el.classList.add("active");
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }

    qa("[data-target]").forEach(btn => {
        btn.addEventListener("click", () => {
            const tgt = btn.dataset.target;
            if (tgt) showPage(tgt);
        });
    });

    qa(".back-btn").forEach(b => b.addEventListener("click", () => showPage("home")));

    /* ---------- floating quote ---------- */
    const QUOTES = [
        "Small progress is still progress.",
        "Study smart. Rest well.",
        "Consistency beats intensity.",
        "Focus on growth, not perfection.",
        "Discipline creates freedom."
    ];
    const quoteEl = q("#quote");
    if (quoteEl) quoteEl.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    /* ---------- STUDY TRACKER ---------- */
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const daySelect = q("#daySelect");
    const hoursInput = q("#hoursInput");
    const addHourBtn = q("#addHourBtn");
    const clearWeekBtn = q("#clearWeekBtn");
    const weekTotalEl = q("#weekTotal");
    const avgDayEl = q("#avgDay");

    let studyData = loadArray("studyData", 7);

    // init Chart if canvas available and Chart exists
    const studyCanvas = q("#studyChart");
    let studyChart = null;
    if (studyCanvas && typeof Chart !== "undefined") {
        studyChart = new Chart(studyCanvas.getContext("2d"), {
            type: "bar",
            data: {
                labels: days,
                datasets: [{
                    label: "Hours",
                    data: studyData,
                    backgroundColor: "rgba(199,125,90,0.85)",
                    borderColor: "rgba(199,125,90,1)",
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 12,
                        ticks: {
                            color: "#4b3b33"
                        }
                    },
                    x: {
                        ticks: {
                            color: "#4b3b33"
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    function updateStudySummary() {
        if (!Array.isArray(studyData)) studyData = new Array(7).fill(0);
        const total = studyData.reduce((a, b) => a + b, 0);
        const avg = total / 7;
        if (weekTotalEl) weekTotalEl.textContent = '${total.toFixed(1)} hrs';
        if (avgDayEl) avgDayEl.textContent = '${avg.toFixed(1)} hrs';
    }
    updateStudySummary();

    if (addHourBtn) addHourBtn.addEventListener("click", () => {
        if (!daySelect || !hoursInput) return;
        const idx = daySelect.selectedIndex;
        const v = parseFloat(hoursInput.value);
        if (!Number.isFinite(v) || v < 0) {
            alert("Enter valid hours (>=0)");
            return;
        }
        studyData[idx] = v;
        saveArray("studyData", studyData);
        if (studyChart) {
            studyChart.data.datasets[0].data = studyData;
            studyChart.update();
        }
        updateStudySummary();
        hoursInput.value = "";
    });

    if (clearWeekBtn) clearWeekBtn.addEventListener("click", () => {
        if (!confirm("Clear all study hours for this week?")) return;
        studyData = new Array(7).fill(0);
        saveArray("studyData", studyData);
        if (studyChart) {
            studyChart.data.datasets[0].data = studyData;
            studyChart.update();
        }
        updateStudySummary();
    });

    /* ---------- EVENTS ---------- */
    const saveEventBtn = q("#saveEventBtn");
    const clearEventsBtn = q("#clearEventsBtn");
    const eventTitle = q("#eventTitle");
    const eventDate = q("#eventDate");
    const eventList = q("#eventList");

    function loadEvents() {
        try {
            const raw = localStorage.getItem("events");
            const parsed = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(parsed)) return [];
            return parsed.map(e => ({
                title: e.title || "",
                date: e.date || ""
            }));
        } catch (e) {
            return [];
        }
    }
    let events = loadEvents();

    function renderEvents() {
        if (!eventList) return;
        eventList.innerHTML = "";
        events.forEach(ev => {
            const li = document.createElement("li");
            li.textContent =' ev.date ? ${ev.title} — ${ev.date} : ev.title';
            li.className = "event-item";
            eventList.appendChild(li);
        });
    }
    renderEvents();

    if (saveEventBtn) saveEventBtn.addEventListener("click", () => {
        if (!eventTitle) return;
        const title = eventTitle.value.trim();
        const date = eventDate ? eventDate.value : "";
        if (!title) {
            alert("Enter event title");
            return;
        }
        events.unshift({
            title,
            date
        });
        try {
            localStorage.setItem("events", JSON.stringify(events));
        } catch (e) {
            console.warn(e)
        }
        renderEvents();
        eventTitle.value = "";
        if (eventDate) eventDate.value = "";
    });

    if (clearEventsBtn) clearEventsBtn.addEventListener("click", () => {
        if (!confirm("Clear all events?")) return;
        events = [];
        localStorage.removeItem("events");
        renderEvents();
    });

    /* ---------- 3D pastel starfield (Three.js) ---------- */
    // initialize after DOM ready
    try {
        const canvas = document.getElementById("bgCanvas");
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.z = 400;

        const starCount = Math.max(400, Math.floor(window.innerWidth * window.innerHeight / 8000));
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        const pastel = [
            new THREE.Color(0xffe0cc), // peach
            new THREE.Color(0xffd1e6), // pink
            new THREE.Color(0xd8e8ff), // light blue
            new THREE.Color(0xe7f9f0), // mint
            new THREE.Color(0xf6e6ff) // lavender
        ];

        for (let i = 0; i < starCount; i++) {
            const r = 400 + Math.random() * 800;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const c = pastel[Math.floor(Math.random() * pastel.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            sizes[i] = 1 + Math.random() * 3;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const vertex = `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      void main(){
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
        const fragment = `
      varying vec3 vColor;
      void main(){
        float d = length(gl_PointCoord - vec2(0.5));
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, a);
      }
    `;

        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true,
            depthWrite: false,
            vertexColors: true
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        let t = 0;

        function renderLoop() {
            t += 0.0015;
            stars.rotation.y = t * 0.12;
            stars.rotation.x = Math.sin(t * 0.6) * 0.02;
            const pos = geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i] += Math.sin((i + t * 10) * 0.0008) * 0.02;
                pos[i + 1] += Math.cos((i + t * 12) * 0.0006) * 0.02;
            }
            geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
            requestAnimationFrame(renderLoop);
        }
        renderLoop();

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    } catch (e) {
        console.warn("3D background failed:", e);
    }

}); // DOMContentLoaded end