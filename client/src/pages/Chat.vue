<template>

<div class="chat-app">

  <!-- Sidebar -->

  <div class="sidebar">

    <!-- Top -->

    <div class="sidebar-top">

      <h1>
        Kalakshepa
      </h1>

      <!-- Add Friend -->

      <button

        class="add-btn"

        @click="showAddFriend = true"

      >

        ➕

      </button>

    </div>

    <!-- Search Friends -->

    <div class="search-box">

      <input

        type="text"

        placeholder="Search friends..."

        v-model="searchFriends"

      />

    </div>

    <!-- Friends -->

    <div class="users">

      <div

        class="user-card"

        v-for="friend in filteredFriends"

        :key="friend"

        @click="selectUser(friend)"

        @contextmenu.prevent="openMenu($event,friend)"

      >

        <div class="avatar">
          👤
        </div>

        <div class="user-info">

          <h3>
            {{ friend }}
          </h3>

          <p>
            Personal Chat
          </p>

        </div>

      </div>

    </div>

    <!-- Add Friend Popup -->

    <div

      v-if="showAddFriend"

      class="popup-overlay"

    >

      <div class="popup">

        <h2>
          Add Friend
        </h2>

        <input

          type="text"

          placeholder="Search username..."

          v-model="searchUsers"

        />

        <!-- Users -->

        <div

          v-for="user in filteredUsers"

          :key="user._id"

          class="popup-user"

        >

          <span>
            {{ user.username }}
          </span>

          <button

            @click="addFriend(user.username)"

          >

            ➕ Add

          </button>

        </div>

        <!-- Not Found -->

        <p

          v-if="

          searchUsers &&

          filteredUsers.length === 0

          "

          class="not-found"

        >

          User not found

        </p>

        <!-- Close -->

        <button

          class="close-btn"

          @click="showAddFriend = false"

        >

          Close

        </button>

      </div>

    </div>

    <!-- Context Menu -->

    <div

      v-if="showMenu"

      class="context-menu"

      :style="{

        top:menuY+'px',

        left:menuX+'px'

      }"

    >

      <div

        class="menu-option"

        @click="pinFriend"

      >

        📌 Pin Friend

      </div>

      <div

        class="menu-option remove"

        @click="removeFriend"

      >

        ❌ Remove Friend

      </div>

    </div>

  </div>

  <!-- Chat -->

  <div class="chat-section">

    <!-- Header -->

    <div class="chat-header">

      <div class="chat-user">

        <div class="avatar big">
          👤
        </div>

        <div>

          <h2>
            {{ selectedUser }}
          </h2>

          <p>
            Realtime Chat
          </p>

        </div>

      </div>

      <!-- Clear -->

      <button

        class="clear-btn"

        @click="clearMessages"

      >

        🗑 Clear Chat

      </button>

    </div>

    <!-- Messages -->

    <div
      class="messages"
      ref="messageBox"
    >

      <div

        v-for="(msg,index) in messages"

        :key="index"

        :class="

        msg.user === username

        ? 'message own-message'

        : 'message friend-message'

        "

      >

        <div class="message-user">
          {{ msg.user }}
        </div>

        <div class="message-text">
          {{ msg.text }}
        </div>

        <div class="message-time">
          {{ msg.time }}
        </div>

      </div>

    </div>

    <!-- Input -->

    <div class="chat-input">

      <input

        type="text"

        v-model="message"

        placeholder="Type message..."

        @keyup.enter="sendMessage"

      />

      <button @click="sendMessage">
        ➤
      </button>

    </div>

  </div>

</div>

</template>

<script setup>

import {

  ref,

  computed,

  onMounted,

  nextTick

} from 'vue'

import axios from 'axios'

import {

  io

} from 'socket.io-client'

/* Socket */

const socket =
io('http://localhost:5000')

/* Current User */

const savedUser =

JSON.parse(

  localStorage.getItem('user')

)

const username =

savedUser?.username || 'Guest'

/* State */

const users = ref([])

const friends = ref(

  JSON.parse(

    localStorage.getItem('friends')

  ) || []

)

const searchUsers = ref('')

const searchFriends = ref('')

const message = ref('')

const messages = ref([])

const messageBox = ref(null)

const selectedUser = ref('Global Chat')

const showAddFriend = ref(false)

/* Context Menu */

const showMenu = ref(false)

const menuX = ref(0)

const menuY = ref(0)

const selectedMenuFriend = ref('')

/* Load Users */

const loadUsers = async()=>{

  try{

    const res = await axios.get(

      'http://localhost:5000/api/auth/users'

    )

    users.value = res.data.filter(

      user =>

      user.username !== username

    )

  }

  catch(error){

    console.log(error)

  }

}

/* Filter Users */

const filteredUsers = computed(()=>{

  return users.value.filter(user=>

    user.username

    .toLowerCase()

    .includes(

      searchUsers.value.toLowerCase()

    )

    &&

    !friends.value.includes(

      user.username

    )

  )

})

/* Filter Friends */

const filteredFriends = computed(()=>{

  return friends.value.filter(friend=>

    friend.toLowerCase()

    .includes(

      searchFriends.value.toLowerCase()

    )

  )

})

/* Add Friend */

const addFriend = (friend)=>{

  if(

    friends.value.includes(friend)

  ){

    alert('Friend already added')

    return

  }

  friends.value.push(friend)

  localStorage.setItem(

    'friends',

    JSON.stringify(

      friends.value

    )

  )

  showAddFriend.value = false

  searchUsers.value=''

}

/* Select User */

const selectUser = (friend)=>{

  selectedUser.value = friend

}

/* Open Menu */

const openMenu = (

  event,

  friend

)=>{

  menuX.value = event.clientX

  menuY.value = event.clientY

  selectedMenuFriend.value = friend

  showMenu.value = true

}

/* Remove Friend */

const removeFriend = ()=>{

  friends.value = friends.value.filter(

    friend =>

    friend !== selectedMenuFriend.value

  )

  localStorage.setItem(

    'friends',

    JSON.stringify(

      friends.value

    )

  )

  showMenu.value = false

}

/* Pin Friend */

const pinFriend = ()=>{

  friends.value.sort((a,b)=>{

    if(

      a === selectedMenuFriend.value

    ) return -1

    return 0

  })

  localStorage.setItem(

    'friends',

    JSON.stringify(

      friends.value

    )

  )

  showMenu.value = false

}

/* Send Message */

const sendMessage = ()=>{

  if(

    message.value.trim()===''

  ) return

  const msgData = {

    user: username,

    text: message.value,

    time: new Date()

    .toLocaleTimeString()

  }

  socket.emit(

    'sendMessage',

    msgData

  )

  message.value=''

}

/* Clear */

const clearMessages = ()=>{

  socket.emit(

    'clearMessages'

  )

}

/* Scroll */

const scrollBottom = async()=>{

  await nextTick()

  if(messageBox.value){

    messageBox.value.scrollTop =

    messageBox.value.scrollHeight

  }

}

/* Mounted */

onMounted(()=>{

  loadUsers()

  socket.on(

    'loadMessages',

    (oldMessages)=>{

      messages.value = oldMessages

      scrollBottom()

    }

  )

  socket.on(

    'receiveMessage',

    (msg)=>{

      messages.value.push(msg)

      scrollBottom()

    }

  )

  socket.on(

    'messagesCleared',

    ()=>{

      messages.value = []

    }

  )

  window.addEventListener(

    'click',

    ()=>{

      showMenu.value = false

    }

  )

})

</script>

<style scoped>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial;
}

.chat-app{
  height:100vh;
  display:flex;
  background:#0b1220;
  color:white;
}

/* Sidebar */

.sidebar{
  width:350px;
  background:#111827;
  border-right:
  1px solid rgba(255,255,255,0.08);
  display:flex;
  flex-direction:column;
  position:relative;
}

/* Top */

.sidebar-top{
  padding:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.sidebar-top h1{
  color:#22c55e;
  font-size:30px;
}

/* Add Button */

.add-btn{
  width:45px;
  height:45px;
  border:none;
  border-radius:12px;
  background:#22c55e;
  color:black;
  font-size:24px;
  cursor:pointer;
}

/* Search */

.search-box{
  padding:0 15px 15px;
}

.search-box input{
  width:100%;
  height:50px;
  border:none;
  outline:none;
  border-radius:12px;
  padding:0 15px;
  background:
  rgba(255,255,255,0.08);
  color:white;
}

/* Users */

.users{
  flex:1;
  overflow-y:auto;
}

.user-card{
  display:flex;
  gap:15px;
  padding:18px;
  cursor:pointer;
}

.user-card:hover{
  background:
  rgba(255,255,255,0.05);
}

/* Avatar */

.avatar{
  width:55px;
  height:55px;
  border-radius:50%;
  background:#22c55e;
  display:flex;
  justify-content:center;
  align-items:center;
  color:black;
}

.big{
  width:60px;
  height:60px;
}

.user-info h3{
  font-size:18px;
}

.user-info p{
  margin-top:5px;
  color:#aaa;
}

/* Popup */

.popup-overlay{
  position:fixed;
  inset:0;
  background:
  rgba(0,0,0,0.6);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:999;
}

.popup{
  width:400px;
  background:#111827;
  border-radius:24px;
  padding:25px;
}

.popup h2{
  margin-bottom:20px;
}

.popup input{
  width:100%;
  height:55px;
  border:none;
  outline:none;
  border-radius:14px;
  padding:0 15px;
  background:
  rgba(255,255,255,0.08);
  color:white;
  margin-bottom:20px;
}

/* Popup User */

.popup-user{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px;
  border-radius:12px;
  background:
  rgba(255,255,255,0.05);
  margin-bottom:12px;
}

.popup-user button{
  border:none;
  padding:8px 14px;
  border-radius:8px;
  background:#22c55e;
  color:black;
  cursor:pointer;
}

/* Close */

.close-btn{
  width:100%;
  height:50px;
  border:none;
  border-radius:12px;
  background:#ef4444;
  color:white;
  margin-top:10px;
  cursor:pointer;
}

/* Not Found */

.not-found{
  color:#ef4444;
  text-align:center;
  margin-top:10px;
}

/* Context Menu */

.context-menu{
  position:fixed;
  width:180px;
  background:#1f2937;
  border-radius:14px;
  overflow:hidden;
  z-index:999;
}

.menu-option{
  padding:14px 18px;
  cursor:pointer;
}

.menu-option:hover{
  background:
  rgba(255,255,255,0.08);
}

.remove{
  color:#ef4444;
}

/* Chat */

.chat-section{
  flex:1;
  display:flex;
  flex-direction:column;
  background:
  linear-gradient(
    135deg,
    #071029,
    #000
  );
}

/* Header */

.chat-header{
  height:90px;
  padding:0 25px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:
  1px solid rgba(255,255,255,0.08);
}

.chat-user{
  display:flex;
  gap:15px;
  align-items:center;
}

.clear-btn{
  height:45px;
  padding:0 18px;
  border:none;
  border-radius:12px;
  background:#ef4444;
  color:white;
  cursor:pointer;
}

/* Messages */

.messages{
  flex:1;
  overflow-y:auto;
  padding:25px;
  display:flex;
  flex-direction:column;
}

.message{
  max-width:320px;
  padding:12px 16px;
  margin-bottom:15px;
  border-radius:18px;
}

.own-message{
  margin-left:auto;
  background:#22c55e;
  color:black;
}

.friend-message{
  margin-right:auto;
  background:
  rgba(255,255,255,0.12);
}

.message-user{
  font-size:12px;
  font-weight:bold;
  margin-bottom:5px;
}

.message-time{
  margin-top:8px;
  font-size:11px;
  text-align:right;
  opacity:0.7;
}

/* Input */

.chat-input{
  padding:18px;
  display:flex;
  gap:15px;
}

.chat-input input{
  flex:1;
  height:60px;
  border:none;
  outline:none;
  border-radius:18px;
  padding:0 20px;
  background:
  rgba(255,255,255,0.08);
  color:white;
}

.chat-input button{
  width:70px;
  border:none;
  border-radius:18px;
  background:#22c55e;
  color:black;
  font-size:24px;
  cursor:pointer;
}

</style>