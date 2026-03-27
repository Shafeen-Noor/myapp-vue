<script setup>
import ApodFetcher from './lib/components/ApodFetcher.vue'
</script>

<template>
  <main>
    <ApodFetcher />
  </main>
</template>

<style>
body {
  margin: 0;
  background: #0a0a1a;
}

main {
  max-width: 720px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem;
}

h1 {
  font-family: Georgia, serif;
  font-size: 2.2rem;
  color: #c8b8ff;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-family: Georgia, serif;
  color: #666;
  margin-top: 0;
  margin-bottom: 2rem;
}
</style>
