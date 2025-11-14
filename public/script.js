const API = '/api';

// ✅ Auth
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// ✅ Register
async function register() {
  const name = val('name'), email = val('email'), password = val('password'), msg = el('msg');
  if (!name || !email || !password) return msg.innerText = 'Please fill all fields';
  if (password.length < 6) return msg.innerText = 'Password must be at least 6 characters';

  const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: jsonH(), body: JSON.stringify({ name, email, password }) });
  const data = await res.json();
  msg.innerText = data.msg || 'Done';
  if (res.ok) setTimeout(()=>window.location.href='login.html',700);
}

// ✅ Login
async function login() {
  const email = val('email'), password = val('password'), msg = el('msg');
  if (!email || !password) return msg.innerText='Please enter email and password';

  const res = await fetch(`${API}/auth/login`, { method:'POST', headers:jsonH(), body:JSON.stringify({ email,password }) });
  const data = await res.json();
  if(data.token){
    localStorage.setItem('token',data.token);
    localStorage.setItem('userEmail',data.email);
    localStorage.setItem('userName',data.name);
    setTimeout(()=>window.location.href='profile.html',700);
  } else msg.innerText = data.msg || 'Login failed';
}

// ✅ Logout
function logout(){
  localStorage.clear();
  updateNav();
  window.location.href='login.html';
}

// ✅ Offer ride
async function offerRide(){
  if(!checkAuth()) return;
  const data = {
    source: val('source'),
    destination: val('destination'),
    time: val('time'),
    seats: Number(val('seats')),
    price: Number(val('price')),
    phone: val('phone')
  };
  const msg = el('msg');
  if(Object.values(data).some(v=>!v)) return msg.innerText='Please fill all fields';
  const res = await fetch(`${API}/rides/offer`, { method:'POST', headers:authH(), body:JSON.stringify(data) });
  const r = await res.json();
  msg.innerText = r.msg || 'Done';
  if(res.ok) setTimeout(()=>window.location.href='profile.html',800);
}

// ✅ Search rides
async function searchRide(){
  const s = val('source'), d = val('destination'), results = el('results');
  const res = await fetch(`${API}/rides/search?source=${encodeURIComponent(s)}&destination=${encodeURIComponent(d)}`);
  const rides = await res.json();

  results.innerHTML = rides.length ? rides.map(r=>`
    <div class="ride-card">
      <div><strong>${r.source}</strong> ➜ <strong>${r.destination}</strong><br>
      <small>🕒 ${r.time} · 💺 ${r.seats} · 💰 ₹${r.price}</small></div>
      <div class="mt-2">👤 ${r.driver?.name || 'Anonymous'}<br>📞 ${r.phone || 'N/A'}</div>
      <button class="btn btn-primary btn-sm mt-2" onclick="bookRide('${r._id}')">Book Ride</button>
    </div>
  `).join('') : '<p class="muted">No rides found</p>';
}

// ✅ Book Ride
async function bookRide(rideId) {
  if (!checkAuth()) return;

  if (!confirm("Do you want to book this ride?")) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`/api/bookings/${rideId}/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({ seatsBooked: 1 }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(
        `✅ ${data.msg}\n\nDriver Info:\n👤 ${data.driver.name}\n📞 ${data.driver.phone}\n💰 ₹${data.driver.price}\n🕒 ${data.driver.time}`
      );
      // Refresh booked rides if on profile page
      if (window.location.pathname.includes("profile.html")) loadMyBookings();
    } else {
      alert(`❌ ${data.msg || "Booking failed"}`);
    }
  } catch (err) {
    alert("❌ Error booking ride.");
    console.error(err);
  }
}

// ✅ Load user bookings - split into current & past
async function loadMyBookings() {
  const token = localStorage.getItem("token");
  const el = document.getElementById("mybookings");
  if (!el) return;
  el.innerHTML = "<p class='muted'>Loading your booked rides...</p>";

  try {
    const res = await fetch("/api/bookings/my", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();

    if (!data || (!data.current?.length && !data.past?.length)) {
      el.innerHTML = "<p class='muted'>No bookings yet</p>";
      return;
    }

    let html = "";

    // Current Bookings Section
    if (data.current.length) {
      html += `<h5 class="fw-bold mb-2 mt-2 text-success">Current Bookings</h5>`;
      html += data.current
        .map(
          (b) => `
        <div class="ride-card small">
          <div><strong>${escapeHtml(b.ride.source)}</strong> ➜ <strong>${escapeHtml(
            b.ride.destination
          )}</strong></div>
          <div>🕒 ${escapeHtml(b.ride.time)} · 💺 ${b.seatsBooked} seat(s) · 💰 ₹${b.ride.price}</div>
          <div>👤 ${escapeHtml(b.ride.driver?.name || "Unknown")} · 📞 ${
            b.ride.phone || "N/A"
          }</div>
        </div>`
        )
        .join("");
    }

    // Past Bookings Section
    if (data.past.length) {
      html += `<h5 class="fw-bold mb-2 mt-4 text-muted">Past Bookings</h5>`;
      html += data.past
        .map(
          (b) => `
        <div class="ride-card small bg-light">
          <div><strong>${escapeHtml(b.ride.source)}</strong> ➜ <strong>${escapeHtml(
            b.ride.destination
          )}</strong></div>
          <div>🕒 ${escapeHtml(b.ride.time)} · 💺 ${b.seatsBooked} seat(s) · 💰 ₹${b.ride.price}</div>
          <div>👤 ${escapeHtml(b.ride.driver?.name || "Unknown")} · 📞 ${
            b.ride.phone || "N/A"
          }</div>
        </div>`
        )
        .join("");
    }

    el.innerHTML = html;
  } catch (err) {
    console.error(err);
    el.innerHTML = "<p class='text-danger'>Error loading bookings</p>";
  }
}


// ✅ Profile
function loadProfile(){
  set('profileName',localStorage.getItem('userName')||'');
  set('profileEmail',localStorage.getItem('userEmail')||'');
  loadMyRides();
  loadMyBookings();
}

// ✅ My rides
async function loadMyRides(){
  if(!checkAuth())return;
  const res = await fetch(`${API}/rides/myrides`,{headers:authH()});
  const rides=await res.json();
  const el=document.getElementById('myrides');
  el.innerHTML=rides.length?rides.map(r=>`
    <div class="ride-card small">
      <div><strong>${r.source}</strong> ➜ ${r.destination}</div>
      <small>${r.time} · Seats: ${r.seats}</small>
    </div>`).join(''):'<p class="muted">No rides yet</p>';
}

// ✅ My bookings
async function loadMyBookings(){
  const res=await fetch(`${API}/bookings/my`,{headers:authH()});
  const b=await res.json();
  const el=document.getElementById('mybookings');
  el.innerHTML=b.length?b.map(x=>`
    <div class="ride-card small">
      <div><strong>${x.ride.source}</strong> ➜ ${x.ride.destination}</div>
      <small>${x.ride.time} · Seats booked: ${x.seatsBooked}</small>
    </div>`).join(''):'<p class="muted">No bookings yet</p>';
}

// ✅ Navbar
function updateNav() {
  const nav = document.getElementById('nav-links');
  if (!nav) return;

  const token = localStorage.getItem('token');

  if (token) {
    nav.innerHTML = `
      <li class="nav-item"><a href="profile.html" class="nav-link">Profile</a></li>
      <li class="nav-item"><a href="offer.html" class="nav-link">Offer Ride</a></li>
      <li class="nav-item"><a href="search.html" class="nav-link">Search</a></li>
      <li class="nav-item">
        <button class="btn btn-outline-danger btn-sm ms-2" onclick="logout()">Logout</button>
      </li>
    `;
  } else {
    nav.innerHTML = `
      <li class="nav-item"><a href="login.html" class="nav-link">Login</a></li>
      <li class="nav-item"><a href="register.html" class="nav-link">Register</a></li>
      <li class="nav-item"><a href="search.html" class="nav-link">Search</a></li>
    `;
  }
}


/* ======================
   UTILITIES
====================== */
const el=id=>document.getElementById(id);
const val=id=>el(id)?.value||'';
const set=(id,text)=>{if(el(id))el(id).innerText=text;}
const jsonH=()=>({'Content-Type':'application/json'});
const authH=()=>({...jsonH(),'Authorization':'Bearer '+localStorage.getItem('token')});

document.addEventListener('DOMContentLoaded',updateNav);
