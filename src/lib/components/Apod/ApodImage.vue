<script setup>
defineProps({
  src: { type: String, required: true },
  title: { type: String, required: true },
  mediaType: { type: String, default: 'image' },
})
</script>

<template>
  <img v-if="mediaType === 'image'" :src="src" :alt="title" class="apod-media apod-media--image" />
  <iframe
    v-else-if="mediaType === 'video'"
    :src="src"
    :title="title"
    class="apod-media apod-media--video"
    allowfullscreen
  ></iframe>
</template>

<style scoped>
.apod-media {
  width: 100%;
  border-radius: var(--radius-lg);
  display: block;
  margin-bottom: var(--space-6);
  background: var(--color-surface);
}

.apod-media--image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.apod-media--video {
  height: 340px;
  border: none;
}
</style>
