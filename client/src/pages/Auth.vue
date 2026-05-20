<template>

<div class="auth-page">

  <div class="auth-box">

    <h1>
      Kalakshepa
    </h1>

    <!-- Toggle -->

    <div class="toggle">

      <button

        :class="{active:!isRegister}"

        @click="isRegister=false"

      >

        Login

      </button>

      <button

        :class="{active:isRegister}"

        @click="isRegister=true"

      >

        Register

      </button>

    </div>

    <!-- Username -->

    <input

      v-if="isRegister"

      type="text"

      placeholder="Username"

      v-model="username"

    />

    <!-- Email -->

    <input

      type="email"

      placeholder="Email"

      v-model="email"

    />

    <!-- Password -->

    <input

      type="password"

      placeholder="Password"

      v-model="password"

    />

    <!-- Submit -->

    <button

      class="submit-btn"

      @click="handleAuth"

    >

      {{ isRegister ? 'Register' : 'Login' }}

    </button>

  </div>

</div>

</template>

<script setup>

import { ref } from 'vue'

import axios from 'axios'

import { useRouter } from 'vue-router'

const router = useRouter()

const isRegister = ref(false)

const username = ref('')

const email = ref('')

const password = ref('')

const handleAuth = async()=>{

  try{

    /* Register */

    if(isRegister.value){

      await axios.post(

        'http://localhost:5000/api/auth/register',

        {

          username:username.value,

          email:email.value,

          password:password.value

        }

      )

      alert('Registered Successfully')

      isRegister.value = false

      return

    }

    /* Login */

    const res = await axios.post(

      'http://localhost:5000/api/auth/login',

      {

        email:email.value,

        password:password.value

      }

    )

    localStorage.setItem(

      'token',

      res.data.token

    )

    localStorage.setItem(

      'user',

      JSON.stringify(res.data.user)

    )

    router.push('/dashboard')

  }

  catch(error){

    alert(

      error.response?.data?.message ||

      'Something went wrong'

    )

  }

}

</script>

<style scoped>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial;
}

.auth-page{

  min-height:100vh;

  display:flex;

  justify-content:center;

  align-items:center;

  background:
  linear-gradient(
    135deg,
    #071029,
    #000
  );
}

.auth-box{

  width:400px;

  padding:40px;

  border-radius:24px;

  background:
  rgba(255,255,255,0.05);

  backdrop-filter:blur(20px);

  border:
  1px solid rgba(255,255,255,0.08);
}

.auth-box h1{

  text-align:center;

  color:#22c55e;

  margin-bottom:30px;
}

.toggle{

  display:flex;

  gap:10px;

  margin-bottom:20px;
}

.toggle button{

  flex:1;

  height:50px;

  border:none;

  border-radius:12px;

  background:
  rgba(255,255,255,0.08);

  color:white;

  cursor:pointer;
}

.toggle .active{

  background:#22c55e;

  color:black;
}

.auth-box input{

  width:100%;

  height:55px;

  margin-bottom:15px;

  border:none;

  outline:none;

  border-radius:14px;

  padding:0 15px;

  background:
  rgba(255,255,255,0.08);

  color:white;
}

.submit-btn{

  width:100%;

  height:55px;

  border:none;

  border-radius:14px;

  background:#22c55e;

  color:black;

  font-size:18px;

  font-weight:bold;

  cursor:pointer;
}

</style>