<script setup>
import { ref } from 'vue'
import { fetchAPOD } from '../api/Apod'

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
    <div class="picker-row">
      <label for="date-input">Date</label>
      <input id="date-input" type="date" min="1995-06-16" :max="today" v-model="selectedDate" />
      <button @click="handleFetch" :disabled="loading">
        {{ loading ? 'Loading…' : 'Fetch Picture' }}
      </button>
    </div>

    <p v-if="error" class="msg error">{{ error }}</p>
    <p v-if="loading" class="msg loading">Contacting NASA… 🛸</p>

    <div v-if="apodData" class="card">
      <h2>{{ apodData.title }}</h2>
      <p class="date-label">{{ apodData.date }}</p>

      <img
        v-if="apodData.media_type === 'image'"
        :src="apodData.url"
        :alt="apodData.title"
        class="media"
      />
      <iframe
        v-else-if="apodData.media_type === 'video'"
        :src="apodData.url"
        :title="apodData.title"
        class="media video"
        allowfullscreen
      ></iframe>

      <p class="description">{{ apodData.explanation }}</p>
    </div>
  </div>
</template>

<style scoped>
.apod-fetcher {
  font-family: Georgia, serif;
  max-width: 680px;
  margin: 0 auto;
  color: #e8e8f0;
}
.picker-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

label {
  color: #aaa;
  font-size: 0.95rem;
}

input[type='date'] {
  padding: 0.45rem 0.75rem;
  border: 1px solid #08081d;
  border-radius: 6px;
  background: #c8b8ff;
  color: #272777;
  font-size: 0.95rem;
}

button {
  padding: 0.45rem 1.1rem;
  border: none;
  border-radius: 6px;
  background: #6a4fcf;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #8b6fe8;
}

.msg {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}
.error {
  color: #ff6b6b;
  background: #2a1010;
  border-left: 3px solid #ff6b6b;
}
.loading {
  color: #888;
  font-style: italic;
}

.card {
  background: #12122a;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 1.5rem;
}
.card h2 {
  margin-top: 0;
  color: #c8b8ff;
  font-size: 1.35rem;
}
.date-label {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.media {
  width: 100%;
  border-radius: 8px;
  display: block;
  margin-bottom: 1rem;
}
.video {
  height: 340px;
  border: none;
}

.description {
  color: #b0b0c8;
  line-height: 1.7;
  font-size: 0.93rem;
  margin-bottom: 0;
}
</style>
