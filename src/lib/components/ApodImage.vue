<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
  title: {
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
  <img v-if="mediaType === 'image'" :src="src" :alt="title" class="media image" />
  <iframe
    v-else-if="mediaType === 'video'"
    :src="src"
    :title="title"
    class="media video"
    allowfullscreen
  ></iframe>
</template>

<style scoped src="../styles/ApodImage.css" />
