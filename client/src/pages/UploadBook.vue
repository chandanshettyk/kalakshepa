<template>

<div class="upload-page">

  <div class="upload-box">

    <h1>
      📚 Upload Book
    </h1>

    <!-- Title -->

    <input

      type="text"

      placeholder="Book Title"

      v-model="title"

    />

    <!-- Author -->

    <input

      type="text"

      placeholder="Author Name"

      v-model="author"

    />

    <!-- Category -->

    <input

      type="text"

      placeholder="Category"

      v-model="category"

    />

    <!-- Description -->

    <textarea

      placeholder="Description"

      v-model="description"

    ></textarea>

    <!-- Thumbnail -->

    <label>
      Upload Thumbnail
    </label>

    <input

      type="file"

      @change="handleThumbnail"

    />

    <!-- PDF -->

    <label>
      Upload PDF
    </label>

    <input

      type="file"

      @change="handlePDF"

    />

    <!-- Upload Button -->

    <button @click="uploadBook">

      Upload Book

    </button>

  </div>

</div>

</template>

<script setup>

import {

  ref

} from 'vue'

import axios from 'axios'

/* Form */

const title = ref('')

const author = ref('')

const category = ref('')

const description = ref('')

const thumbnail = ref(null)

const pdf = ref(null)

/* Thumbnail */

const handleThumbnail = (

  e

)=>{

  thumbnail.value =

  e.target.files[0]

}

/* PDF */

const handlePDF = (

  e

)=>{

  pdf.value =

  e.target.files[0]

}

/* Upload */

const uploadBook = async()=>{

  try{

    const formData =

    new FormData()

    formData.append(

      'title',

      title.value

    )

    formData.append(

      'author',

      author.value

    )

    formData.append(

      'category',

      category.value

    )

    formData.append(

      'description',

      description.value

    )

    formData.append(

      'uploadedBy',

      'Admin'

    )

    formData.append(

      'thumbnail',

      thumbnail.value

    )

    formData.append(

      'pdf',

      pdf.value

    )

    await axios.post(

      'http://localhost:5000/api/books/upload',

      formData

    )

    alert(

      '📚 Book Uploaded Successfully'

    )

    /* Reset */

    title.value=''

    author.value=''

    category.value=''

    description.value=''

  }

  catch(err){

    console.log(err)

    alert(

      'Upload Failed'

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

.upload-page{

  min-height:100vh;

  display:flex;

  justify-content:center;

  align-items:center;

  padding:20px;

  background:

  linear-gradient(
    135deg,
    #071029,
    #000
  );
}

.upload-box{

  width:100%;

  max-width:550px;

  padding:35px;

  border-radius:30px;

  background:

  rgba(255,255,255,0.05);

  backdrop-filter:blur(20px);

  border:

  1px solid rgba(255,255,255,0.08);

  display:flex;

  flex-direction:column;

  gap:18px;
}

h1{

  color:#22c55e;

  text-align:center;

  margin-bottom:10px;
}

input,

textarea{

  width:100%;

  padding:15px;

  border:none;

  outline:none;

  border-radius:14px;

  background:

  rgba(255,255,255,0.08);

  color:white;

  font-size:16px;
}

textarea{

  height:120px;

  resize:none;
}

label{

  color:white;

  font-size:15px;
}

button{

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