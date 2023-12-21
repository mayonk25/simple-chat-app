<script setup>
  import { RouterLink } from 'vue-router'; 
</script>

<template>
  <main>
    <h1>Welcome to Chat<span style="color: rgb(36, 88, 207);">App</span></h1>
    <RouterLink to="/login" class="link">Login</RouterLink>
  </main>
</template>

<style scoped>
  main {
    padding: 3rem;
    color: white;
  }

  h1 {
    margin-bottom: 1rem;
  }

  .link {
    background-color: rgb(36, 88, 207);
    color: white;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    text-decoration: none;
  }
</style>