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
  .then(res=>res.text())
  .then(data=>{

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

function openStudentSection(section){

  currentStudentSection = section;

  document.getElementById("notesPage").style.display = "none";
  document.getElementById("booksPage").style.display = "none";
  document.getElementById("impPage").style.display = "none";

  if(section === "notes"){
      document.getElementById("notesPage").style.display = "block";
  }

  if(section === "books"){
      document.getElementById("booksPage").style.display = "block";
  }

  if(section === "imp"){
      document.getElementById("impPage").style.display = "block";
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
