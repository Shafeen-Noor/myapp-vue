<script setup>
import { ref, onMounted } from 'vue'
import { fetchAPOD } from '../api/Apod'
import ApodHeader from '../components/Apod/ApodHeader.vue'
import ApodDatePicker from '../components/Apod/ApodDatePicker.vue'
import ApodCard from '../components/Apod/ApodCard.vue'

const today = new Date().toISOString().split('T')[0]

const selectedDate = ref(today) // ✅ default today
const apodData = ref(null)
const loading = ref(false)
const error = ref('')

onMounted(() => handleFetch()) // ✅ auto load

async function handleFetch() {
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
  <div class="apod-view">
    <ApodHeader />

    <ApodDatePicker
      v-model="selectedDate"
      :loading="loading"
      :max-date="today"
      @fetch="handleFetch"
    />

    <p v-if="error" class="status status--error" role="alert">
      <span class="status__icon">⚠</span> {{ error }}
    </p>
    <p v-if="loading" class="status status--loading" aria-live="polite">
      <span class="status__icon status__icon--spin">◌</span> Contacting NASA deep space network…
    </p>

    <Transition name="fade-up">
      <ApodCard
        v-if="apodData"
        :title="apodData.title"
        :date="apodData.date"
        :explanation="apodData.explanation"
        :url="apodData.url"
        :media-type="apodData.media_type"
        :copyright="apodData.copyright"
      />
    </Transition>
  </div>
</template>

<style scoped>
.apod-view {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  animation: fadeUp var(--duration-slow) var(--ease-out) both;
}

.status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-mono);
}

.status--error {
  color: var(--color-red);
  background: var(--color-red-dim);
  border-left: 2px solid var(--color-red);
}

.status--loading {
  color: var(--color-text-secondary-accent);
  background: var(--color-secondary-dim);
  border-left: 2px solid var(--color-secondary);
}

.status__icon {
  font-size: var(--text-md);
}

.status__icon--spin {
  display: inline-block;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-up-enter-active {
  transition:
    opacity var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(var(--space-6));
}
</style>
