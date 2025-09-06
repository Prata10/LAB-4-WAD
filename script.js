// Load saved profiles from LocalStorage
let profiles = JSON.parse(localStorage.getItem("profiles") || "[]");

function saveProfiles() {
  localStorage.setItem("profiles", JSON.stringify(profiles));
  renderAll();
}

// Validation functions
function validateRequired(id) {
  const field = document.getElementById(id);
  const err = document.getElementById(id + "Error");
  if (!field.value.trim()) {
    err.textContent = "This field is required.";
    return false;
  }
  err.textContent = "";
  return true;
}

function validateEmail(value) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const err = document.getElementById("emailError");
  if (!ok) err.textContent = "Enter a valid email.";
  else err.textContent = "";
  return ok;
}

// Render all cards and table
function renderAll() {
  const cardsContainer = document.getElementById("cards");
  const tbody = document.querySelector("#summaryTable tbody");
  cardsContainer.innerHTML = "";
  tbody.innerHTML = "";

  profiles.forEach((data, idx) => {
    // Card
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${data.photo||'https://placehold.co/128'}" alt="Photo of ${data.first} ${data.last}">
      <h3>${data.first} ${data.last}</h3>
      <p>${data.prog} | Year ${data.year}</p>
      <p>Interests: ${data.interests.join(", ")}</p>
      <button class="removeBtn">Remove</button>
    `;
    cardsContainer.prepend(card);
    card.querySelector(".removeBtn").addEventListener("click", () => {
      profiles.splice(idx,1);
      saveProfiles();
    });

    // Table
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${data.first} ${data.last}</td>
      <td>${data.email}</td>
      <td>${data.prog}</td>
      <td>${data.year}</td>
      <td><button class="removeBtn">Remove</button></td>
    `;
    tbody.prepend(tr);
    tr.querySelector(".removeBtn").addEventListener("click", () => {
      profiles.splice(idx,1);
      saveProfiles();
    });
  });
}

// Submit handler
document.getElementById("regForm").addEventListener("submit", function(e){
  e.preventDefault();
  const isValid = [
    validateRequired("firstName"),
    validateRequired("lastName"),
    validateEmail(document.getElementById("email").value),
    validateRequired("programme"),
    validateRequired("year")
  ].every(Boolean);

  if(!isValid){
    document.getElementById("formLive").textContent = "Fix errors before submitting.";
    return;
  }

  const data = {
    first: document.getElementById("firstName").value,
    last: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    prog: document.getElementById("programme").value,
    year: document.getElementById("year").value,
    interests: document.getElementById("interests").value.split(",").map(s=>s.trim()),
    photo: document.getElementById("photo").value
  };

  profiles.push(data);
  saveProfiles();
  this.reset();
  document.getElementById("formLive").textContent = "Profile added successfully!";
});

// Reset button
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("regForm").reset();
  document.getElementById("formLive").textContent = "";
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
});

// Search / Filter
document.getElementById("search").addEventListener("input", function(){
  const term = this.value.toLowerCase();
  profiles.forEach((profile, idx)=>{
    const card = document.getElementById("cards").children[idx];
    if((profile.first + " " + profile.last).toLowerCase().includes(term) ||
       profile.prog.toLowerCase().includes(term) ||
       profile.interests.join(" ").toLowerCase().includes(term)) {
      card.style.display = "";
    } else { card.style.display = "none"; }
  });
});

// Initial render
renderAll();
