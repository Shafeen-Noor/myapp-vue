<script setup>
import { counter } from './counter'
const { count, increment } = counter()
</script>

<template>
  <h1>Vue+JS Counter</h1>
  <button @click="increment">Clicked {{ count }} {{ count === 1 ? 'time' : 'times' }}</button>
</template>

<style scoped></style>
