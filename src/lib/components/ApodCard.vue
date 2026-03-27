<script setup>
import ApodImage from './ApodImage.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    default: 'image', // 'image' | 'video'
  },
})
</script>

<template>
  <div class="card">
    <h2 class="card__title">{{ title }}</h2>
    <p class="card__date">{{ date }}</p>
    <ApodImage :src="url" :title="title" :media-type="mediaType" />
    <p class="card__description">{{ explanation }}</p>
  </div>
</template>

<style scoped src="../styles/ApodCard.css" />
