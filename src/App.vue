<script setup>
import { counter } from './counter'
const { count, increment } = counter()
</script>

<template>
  <h1>Vue+JS Counter</h1>
  <button @click="increment">Clicked {{ count }} {{ count === 1 ? 'time' : 'times' }}</button>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 16px;
  color: #333;
}

button {
  display: block;
  margin: 0 auto;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
}

button:hover {
  background-color: #f0f0f0;
}
</style>
