/* ========= GLOBAL VARIABLES ========= */

let currentStudentSection = "notes";
let isLogin = true;
let editId = null;

let allNotes = [];

// Backend API
const API = "https://studyx-backend-brif.onrender.com";

/* ========= PAGE LOAD ========= */

window.onload = function () {

  landing.style.display = "block";
  panel.style.display = "none";
  dashboard.style.display = "none";
  studentPage.style.display = "none";

  loadAllNotes();

};

/* ========= LOAD NOTES ========= */

function loadAllNotes(){

  fetch(API + "/getNotes")
  .then(res => res.json())
  .then(data => {

      allNotes = data;
      loadStudentNotesByYear();

  });

}

function loadStudentNotesByYear(){

  const year = document.getElementById("yearFilter").value;

  let category="";
  let cardId="";

  if(currentStudentSection==="notes"){
    category="Notes";
    cardId="notesCards";
  }

  if(currentStudentSection==="books"){
    category="Books";
    cardId="booksCards";
  }

  if(currentStudentSection==="imp"){
    category="Imp";
    cardId="impCards";
  }

  fetch(API + "/getNotes?year="+year)
  .then(res=>res.json())
  .then(notes=>{

    const box=document.getElementById(cardId);
    box.innerHTML="";

    notes
    .filter(n=>n.category===category)
    .forEach(n=>{

      box.innerHTML+=`
        <div class="card">
          <h3>${n.title}</h3>
          <p>${n.description}</p>
          <a class="btn" href="${n.file_url}" target="_blank">Open</a>
        </div>
      `;

    });

  });

}

/* ========= LOGIN PANEL ========= */

function openPanel(){

  landing.style.display = "none";
  panel.style.display = "block";

  const wrap = document.getElementById("wrap");
  wrap.style.transform = "translateX(0)";

  isLogin = true;

}

function goBack(){

  panel.style.display = "none";
  landing.style.display = "flex";

}




/* ========= TOGGLE LOGIN / REGISTER ========= */

function toggle(){

  const wrap = document.getElementById("wrap");

  if(isLogin){
    wrap.style.transform = "translateX(-50%)";
  }
  else{
    wrap.style.transform = "translateX(0%)";
  }

  isLogin = !isLogin;

}

/* ========= REGISTER ========= */

function checkRegister(){

  const u = regUser.value.trim();
  const e = regEmail.value.trim();
  const p = regPass.value.trim();

  if(!u || !e || !p){

    regError.textContent = "All fields required";
    return;

  }

  fetch(API + "/register",{

    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:`username=${encodeURIComponent(u)}&email=${encodeURIComponent(e)}&password=${encodeURIComponent(p)}`

  })
  .then(res=>res.text())
  .then(data=>{

      if(data==="SUCCESS"){

          alert("Registration successful");
          toggle();

      }
      else{

          regError.textContent="Registration failed";

      }

  });

}

/* ========= LOGIN ========= */

function checkLogin(){

  const u = loginUser.value.trim();
  const p = loginPass.value.trim();

fetch(API + "/login",{

  method:"POST",
  headers:{"Content-Type":"application/x-www-form-urlencoded"},
  body:`username=${encodeURIComponent(u)}&password=${encodeURIComponent(p)}`

})
.then(res => res.text())   // 🔥 missing step
.then(data => {

data = data.trim();

panel.style.display="none";
dashboard.style.display="none";
studentPage.style.display="none";

if(data==="ADMIN"){

  dashboard.style.display="flex";
  welcomeText.innerText="Welcome Admin";
  loadAdminNotes();

}
else if(data==="STUDENT"){

  studentPage.style.display="block";
  openStudentSection("notes");

}
else{

  panel.style.display="block";
  loginError.textContent="Invalid username or password";

}

});

}

/* ========= STUDENT SECTION SWITCH ========= */

/* ========= STUDENT SECTION SWITCH ========= */

function openStudentSection(section){

  currentStudentSection = section;

  const notesPage = document.getElementById("notesPage");
  const booksPage = document.getElementById("booksPage");
  const impPage = document.getElementById("impPage");

  // hide all pages
  notesPage.style.display = "none";
  booksPage.style.display = "none";
  impPage.style.display = "none";

  // show selected page
  if(section === "notes"){
      notesPage.style.display = "block";
  }

  if(section === "books"){
      booksPage.style.display = "block";
  }

  if(section === "imp"){
      impPage.style.display = "block";
  }

  // remove active from all buttons
  document.getElementById("btnNotes").classList.remove("active");
  document.getElementById("btnBooks").classList.remove("active");
  document.getElementById("btnImp").classList.remove("active");

  // add active to selected button
  if(section === "notes"){
      document.getElementById("btnNotes").classList.add("active");
  }

  if(section === "books"){
      document.getElementById("btnBooks").classList.add("active");
  }

  if(section === "imp"){
      document.getElementById("btnImp").classList.add("active");
  }

  loadStudentNotesByYear();

}

    /* ========= PASSWORD SHOW / HIDE ========= */

const togglePassword = document.getElementById("togglePassword");
const loginPass = document.getElementById("loginPass");

togglePassword.addEventListener("click", function(){

  const type = loginPass.type === "password" ? "text" : "password";

  loginPass.type = type;

  if(type === "text"){
      togglePassword.classList.replace("fa-eye","fa-eye-slash");
  }
  else{
      togglePassword.classList.replace("fa-eye-slash","fa-eye");
  }

});


/* ---------- ADMIN LOAD NOTES ---------- */

function loadAdminNotes(){

  fetch(API + "/getNotes")
  .then(res=>res.json())
  .then(notes=>{

    const box = document.getElementById("adminCards");
    box.innerHTML = "";

    if(notes.length === 0){
      box.innerHTML = "<p>No notes</p>";
      return;
    }

    notes.forEach(n => {

      box.innerHTML += `

      <div class="card" data-year="${n.year}" data-type="${n.category}">

        <div class="card-actions">

          <button class="edit-btn"
          onclick="editNote(${n.id},'${escapeHtml(n.title)}','${escapeHtml(n.description)}','${n.year}','${n.category}')">
          ✏️
          </button>

          <button class="delete-btn" onclick="deleteNote(${n.id})">
          🗑
          </button>

        </div>

        <h3>${escapeHtml(n.title)}</h3>
        <p>${escapeHtml(n.description)}</p>
        <a class="btn" href="${n.file_url}" target="_blank">Open</a>

      </div>

      `;

    });

  });

}

/* ----------Filter Admin Notes ---------- */
function filterAdminNotes(){

  const year = document.getElementById("adminYearFilter").value;
  const type = document.getElementById("adminTypeFilter").value;

  const cards = document.querySelectorAll("#adminCards .card");

  cards.forEach(card => {

    const cardYear = card.getAttribute("data-year");
    const cardType = card.getAttribute("data-type");

    let yearMatch = (year === "all" || year === cardYear);
    let typeMatch = (type === "all" || type === cardType);

    if(yearMatch && typeMatch){
      card.style.display = "block";
    }else{
      card.style.display = "none";
    }

  });

}
function deleteNote(id){

  if(!confirm("Delete this note?")) return;

  fetch(API + "/deleteNote?id=" + id)
  .then(res => res.text())
  .then(data => {

    if(data === "SUCCESS"){
      alert("Note deleted");
      loadAdminNotes();
    }else{
      alert("Delete failed");
    }

  });

}
function editNote(id,title,desc,year,category){

  noteTitle.value = title;
  noteDesc.value = desc;

  document.getElementById("noteYear").value = year;
  document.getElementById("noteCategory").value = category;

  editId = id;

}

function addNote(){

  const title = noteTitle.value.trim();
  const desc = noteDesc.value.trim();
  const link = noteLink.value.trim();
  const category = document.getElementById("noteCategory").value;
  const year = document.getElementById("noteYear").value;

  if(!title || !desc || !link){
    noteError.textContent = "Fill all fields";
    return;
  }

  const params = new URLSearchParams();

  params.append("title",title);
  params.append("description",desc);
  params.append("fileUrl",link);
  params.append("category",category);
  params.append("year",year);

  if(editId){
    params.append("id",editId);
  }

  fetch(API + "/uploadNote",{
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:params.toString()
  })
  .then(res=>res.text())
  .then(data=>{

    if(data==="SUCCESS"){
      alert("Saved successfully");
      editId = null;
      loadAdminNotes();
    }

  });

}


/*===========Users Admin List===========*/
function openUserManagement(){

dashboard.style.display="none";
usersPage.style.display="block";

loadUsers();

}

function goBackAdmin(){

usersPage.style.display="none";
dashboard.style.display="flex";

}


function loadUsers(){

fetch(API + "/getUsers")
.then(res=>res.json())
.then(users=>{

console.log(users);   

const box=document.getElementById("usersList");
box.innerHTML="";

users.forEach(u=>{

box.innerHTML+=`

<div class="card">

<h3>${u.username}</h3>
<p>${u.email}</p>

<button onclick="deleteUser(${u.id})">
Delete
</button>

</div>

`;

});

});

}


function deleteUser(id){

if(!confirm("Delete this user?")) return;

fetch(API + "/deleteUser?id="+id)
.then(res=>res.text())
.then(data=>{

if(data==="SUCCESS"){
alert("User deleted");
loadUsers();
}

});

}


/* ========= LOGOUT ========= */

function logout(){

  location.reload();

}

/* ---------- ESCAPE HTML ---------- */

function escapeHtml(str){

  return String(str)
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;");

}



