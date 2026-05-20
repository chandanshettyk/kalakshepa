<template>

<div class="dashboard">

  <!-- Sidebar -->

  <div class="sidebar">

    <h1 class="logo">
      Kalakshepa
    </h1>

    <div class="menu">

      <router-link to="/dashboard" class="menu-link">
        <div class="menu-item active">
          🏠 Dashboard
        </div>
      </router-link>

      <router-link to="/chat" class="menu-link">
        <div class="menu-item">
          💬 Chat
        </div>
      </router-link>

      <router-link to="/chess" class="menu-link">
        <div class="menu-item">
          ♟ Chess
        </div>
      </router-link>

      <router-link to="/library" class="menu-link">
        <div class="menu-item">
          📚 eLibrary
        </div>
      </router-link>

      <router-link to="/audio" class="menu-link">
        <div class="menu-item">
          🎵 Audio
        </div>
      </router-link>

      <router-link to="/admin" class="menu-link">
        <div class="menu-item">
          🛡 Admin
        </div>
      </router-link>

    </div>

  </div>

  <!-- Main -->

  <div class="main">

    <!-- Header -->

    <div class="top">

      <div>

        <h1>
          Welcome {{ user.username }} 👋
        </h1>

        <p>
          Modern Full Stack Platform
        </p>

      </div>

      <div class="top-right">

        <!-- User Card -->

        <div class="profile-card">

          <div class="avatar">
            👤
          </div>

          <div>

            <h3>
              {{ user.username }}
            </h3>

            <p>
              {{ user.email }}
            </p>

          </div>

        </div>

        <!-- Logout -->

        <button class="logout" @click="logout">
          Logout
        </button>

      </div>

    </div>

    <!-- Cards -->

    <div class="cards">

      <div class="card">

        <span>💬</span>

        <h2>
          Chat
        </h2>

        <p>
          Realtime messaging
        </p>

      </div>

      <div class="card">

        <span>♟</span>

        <h2>
          Chess
        </h2>

        <p>
          Play online chess
        </p>

      </div>

      <div class="card">

        <span>📚</span>

        <h2>
          eLibrary
        </h2>

        <p>
          Books and PDFs
        </p>

      </div>

      <div class="card">

        <span>🎵</span>

        <h2>
          Audio
        </h2>

        <p>
          Music streaming
        </p>

      </div>

      <div class="card">

        <span>🛡</span>

        <h2>
          Admin
        </h2>

        <p>
          Manage platform
        </p>

      </div>

      <div class="card">

        <span>☁</span>

        <h2>
          Uploads
        </h2>

        <p>
          Media storage
        </p>

      </div>

    </div>

    <!-- Bottom Clock -->

    <div class="bottom-info">

      <div class="mini-clock">

        <div class="clock-time">
          {{ time }}
        </div>

        <div class="clock-date">
          {{ date }}
        </div>

      </div>

    </div>

  </div>

</div>

</template>

<script setup>

import {
  ref,
  onMounted
} from 'vue'

const user = ref({})

const time = ref('')

const date = ref('')

/* User Session */

onMounted(()=>{

  const savedUser =
  JSON.parse(localStorage.getItem('user'))

  if(savedUser){

    user.value = savedUser

  }

})

/* Clock */

const updateClock = () => {

  const now = new Date()

  time.value =
  now.toLocaleTimeString()

  date.value =
  now.toDateString()

}

onMounted(()=>{

  updateClock()

  setInterval(updateClock,1000)

})

/* Logout */

const logout = () => {

  localStorage.removeItem('token')

  localStorage.removeItem('user')

  window.location.href = '/auth'

}

</script>

<style scoped>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

/* Background */

.dashboard{

  min-height:100vh;

  display:flex;

  background:
  linear-gradient(
    135deg,
    #071029,
    #0b1736,
    #000
  );

  color:white;

  font-family:Arial;
}

/* Sidebar */

.sidebar{

  width:260px;

  padding:30px 20px;

  background:
  rgba(255,255,255,0.05);

  backdrop-filter:blur(20px);

  border-right:
  1px solid rgba(255,255,255,0.08);
}

.logo{

  font-size:36px;

  font-weight:bold;

  color:#4ade80;

  margin-bottom:50px;
}

/* Menu */

.menu{

  display:flex;

  flex-direction:column;

  gap:18px;
}

.menu-link{

  text-decoration:none;

  color:white;
}

.menu-item{

  padding:16px 18px;

  border-radius:18px;

  cursor:pointer;

  transition:0.3s;

  background:
  rgba(255,255,255,0.04);

  font-size:17px;
}

.menu-item:hover{

  transform:translateX(6px);

  background:#22c55e;

  color:black;
}

.active{

  background:#22c55e;

  color:black;

  font-weight:bold;
}

/* Main */

.main{

  flex:1;

  padding:40px;

  position:relative;
}

/* Header */

.top{

  display:flex;

  justify-content:space-between;

  align-items:center;

  gap:20px;
}

.top h1{

  font-size:52px;
}

.top p{

  margin-top:10px;

  color:#9ca3af;

  font-size:18px;
}

/* Right */

.top-right{

  display:flex;

  align-items:center;

  gap:20px;
}

/* Profile */

.profile-card{

  display:flex;

  align-items:center;

  gap:15px;

  padding:18px 22px;

  border-radius:22px;

  background:
  rgba(255,255,255,0.06);

  backdrop-filter:blur(20px);

  border:
  1px solid rgba(255,255,255,0.08);
}

.avatar{

  width:60px;

  height:60px;

  border-radius:50%;

  background:#22c55e;

  display:flex;

  justify-content:center;

  align-items:center;

  font-size:28px;
}

.profile-card h3{

  font-size:20px;
}

.profile-card p{

  margin-top:5px;

  font-size:13px;

  color:#aaa;
}

/* Logout */

.logout{

  width:140px;

  height:55px;

  border:none;

  border-radius:16px;

  background:#ef4444;

  color:white;

  font-size:16px;

  font-weight:bold;

  cursor:pointer;

  transition:0.3s;
}

.logout:hover{

  transform:scale(1.05);

  background:#dc2626;
}

/* Cards */

.cards{

  margin-top:60px;

  display:grid;

  grid-template-columns:
  repeat(auto-fit,minmax(230px,1fr));

  gap:30px;
}

/* Card */

.card{

  padding:35px;

  border-radius:28px;

  background:
  rgba(255,255,255,0.06);

  backdrop-filter:blur(25px);

  border:
  1px solid rgba(255,255,255,0.08);

  transition:0.4s;
}

.card:hover{

  transform:
  translateY(-10px)
  scale(1.03);

  border-color:#22c55e;

  box-shadow:
  0 0 35px rgba(34,197,94,0.35);
}

/* Card Content */

.card span{

  font-size:58px;
}

.card h2{

  margin-top:20px;

  font-size:32px;
}

.card p{

  margin-top:10px;

  color:#9ca3af;

  font-size:16px;
}

/* Clock */

.bottom-info{

  position:fixed;

  right:25px;

  bottom:20px;
}

.mini-clock{

  padding:14px 20px;

  border-radius:20px;

  background:
  rgba(255,255,255,0.08);

  backdrop-filter:blur(20px);

  border:
  1px solid rgba(255,255,255,0.1);
}

.clock-time{

  font-size:24px;

  font-weight:bold;
}

.clock-date{

  margin-top:5px;

  color:#aaa;

  font-size:13px;
}

/* Responsive */

@media(max-width:1000px){

  .top{

    flex-direction:column;

    align-items:flex-start;
  }

  .top-right{

    width:100%;

    flex-wrap:wrap;
  }

}

@media(max-width:900px){

  .dashboard{
    flex-direction:column;
  }

  .sidebar{
    width:100%;
  }

  .top h1{
    font-size:38px;
  }

}

</style>