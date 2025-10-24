let currentUser = null;

function register() {
  const username = document.getElementById('regUser').value;
  const password = document.getElementById('regPass').value;
  fetch('http://localhost:3000/register', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  }).then(r=>r.json()).then(d=>alert(d.msg||'تم التسجيل'));
}

function login() {
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPass').value;
  fetch('http://localhost:3000/login', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ username, password })
  }).then(r=>r.json()).then(d=>{
    if(d.success){
      currentUser = d.user;
      localStorage.setItem('user', JSON.stringify(currentUser));
      window.location = 'dashboard.html';
    } else alert(d.msg);
  });
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user) window.location='index.html';
  currentUser=user;
  document.getElementById('welcome').innerText = `مرحباً ${user.username}`;
  document.getElementById('balance').innerText = user.balance;
  const ul=document.getElementById('transactions'); ul.innerHTML='';
  user.transactions.forEach(t=>{
    const li=document.createElement('li'); li.innerText=t; ul.appendChild(li);
  });
}

function sendCoin(){
  const to=document.getElementById('toUser').value;
  const amount=parseInt(document.getElementById('amount').value);
  fetch('http://localhost:3000/send', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ from: currentUser.username, to, amount })
  }).then(r=>r.json()).then(d=>{
    alert(d.msg||'تم الإرسال'); loadDashboard();
  });
}

function logout(){ localStorage.removeItem('user'); window.location='index.html'; }

if(document.getElementById('balance')) loadDashboard();

// تبديل وضع نهاري/ليلي
function toggleTheme(){ const h=new Date().getHours(); document.body.classList.toggle('dark',h>=18||h<6); }
window.onload=()=>{ toggleTheme(); if(document.getElementById('balance')) loadDashboard(); }