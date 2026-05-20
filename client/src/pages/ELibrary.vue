<template>

<div class="library-page">

  <div class="library-container">

    <h1>
      📚 eLibrary
    </h1>

    <!-- Search -->

    <input

      type="text"

      placeholder="Search books..."

      v-model="search"

      @input="searchBooks"

    />

    <!-- Books -->

    <div class="books-grid">

      <div

        class="book-card"

        v-for="book in books"

        :key="book._id"

      >

        <!-- Thumbnail -->

        <img

          :src="

            'http://localhost:5000/' +

            book.thumbnail

          "

        />

        <!-- Details -->

        <h2>

          {{ book.title }}

        </h2>

        <p>

          {{ book.author }}

        </p>

        <span>

          {{ book.category }}

        </span>

        <!-- Open PDF -->

        <a

          :href="

            'http://localhost:5000/' +

            book.pdf

          "

          target="_blank"

        >

          Read Book

        </a>

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

import axios from 'axios'

/* State */

const books = ref([])

const search = ref('')

/* =====================
   LOAD BOOKS
===================== */

const loadBooks = async()=>{

  try{

    const res = await axios.get(

      'http://localhost:5000/api/books/all'

    )

    books.value = res.data

  }

  catch(err){

    console.log(err)

  }

}

/* =====================
   SEARCH BOOKS
===================== */

const searchBooks = async()=>{

  try{

    /* Empty */

    if(

      search.value.trim()===''

    ){

      loadBooks()

      return

    }

    const res = await axios.get(

      `http://localhost:5000/api/books/search/${search.value}`

    )

    books.value = res.data

  }

  catch(err){

    console.log(err)

  }

}

/* =====================
   ON MOUNT
===================== */

onMounted(()=>{

  loadBooks()

})

</script>

<style scoped>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial;
}

.library-page{

  min-height:100vh;

  padding:30px;

  background:

  linear-gradient(
    135deg,
    #071029,
    #000
  );
}

.library-container{

  max-width:1400px;

  margin:auto;
}

h1{

  color:#22c55e;

  text-align:center;

  margin-bottom:30px;

  font-size:42px;
}

input{

  width:100%;

  max-width:450px;

  height:55px;

  border:none;

  outline:none;

  border-radius:14px;

  padding:0 20px;

  font-size:16px;

  display:block;

  margin:auto;

  margin-bottom:40px;

  background:

  rgba(255,255,255,0.08);

  color:white;
}

.books-grid{

  display:grid;

  grid-template-columns:

  repeat(auto-fit,minmax(250px,1fr));

  gap:25px;
}

.book-card{

  background:

  rgba(255,255,255,0.05);

  border:

  1px solid rgba(255,255,255,0.08);

  border-radius:24px;

  overflow:hidden;

  padding:18px;

  text-align:center;

  backdrop-filter:blur(20px);

  transition:0.3s;
}

.book-card:hover{

  transform:translateY(-5px);
}

.book-card img{

  width:100%;

  height:320px;

  object-fit:cover;

  border-radius:18px;
}

.book-card h2{

  color:white;

  margin-top:15px;

  font-size:22px;
}

.book-card p{

  color:#aaa;

  margin-top:8px;
}

.book-card span{

  display:inline-block;

  margin-top:10px;

  padding:6px 15px;

  border-radius:20px;

  background:#22c55e;

  color:black;

  font-size:14px;

  font-weight:bold;
}

.book-card a{

  display:block;

  margin-top:18px;

  padding:14px;

  border-radius:12px;

  background:#22c55e;

  color:black;

  text-decoration:none;

  font-weight:bold;
}

</style>