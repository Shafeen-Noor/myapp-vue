<script setup>
import { ref } from 'vue'
import { fetchAPOD } from '../api/Apod'
import ApodHeader from './ApodHeader.vue'
import ApodDatePicker from './ApodDatePicker.vue'
import ApodCard from './ApodCard.vue'

const selectedDate = ref('')
const apodData = ref(null)
const loading = ref(false)
const error = ref('')

const today = new Date().toISOString().split('T')[0]

async function handleFetch() {
  if (!selectedDate.value) {
    error.value = 'Please pick a date first!'
    return
  }

  loading.value = true
  error.value = ''
  apodData.value = null

  try {
    apodData.value = await fetchAPOD(selectedDate.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="apod-fetcher">
    <ApodHeader />

    <ApodDatePicker
      v-model="selectedDate"
      :loading="loading"
      :max-date="today"
      @fetch="handleFetch"
    />

    <p v-if="error" class="msg msg--error">{{ error }}</p>
    <p v-if="loading" class="msg msg--loading">Contacting NASA… 🛸</p>

    <ApodCard
      v-if="apodData"
      :title="apodData.title"
      :date="apodData.date"
      :explanation="apodData.explanation"
      :url="apodData.url"
      :media-type="apodData.media_type"
    />
  </div>
</template>

<style scoped src="../styles/ApodFetcher.css" />
