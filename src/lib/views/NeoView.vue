<template>
  <div class="neo-view">
    <NeoHeader />
    <ApodDatePicker
      v-model="selectedDate"
      :loading="loading"
      :max-date="'2100-12-31'"
      @fetch="loadNEOs"
    />
    <p v-if="new Date(selectedDate) > new Date()" class="status status--info">
      Showing predicted asteroid positions for {{ selectedDate }}
    </p>
    <p v-if="error" class="status status--error" role="alert"><span>⚠</span> {{ error }}</p>

    <div v-if="loading" class="neo-loading" aria-live="polite">
      <div class="neo-loading__dots"><span></span><span></span><span></span></div>
      <p>Scanning near-Earth space…</p>
    </div>

    <NeoList v-if="!loading" :neos="neos" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchNEOs } from '../api/Neo'
import NeoHeader from '../components/Neo/NeoHeader.vue'
import NeoList from '../components/Neo/NeoList.vue'
import ApodDatePicker from '../components/Apod/ApodDatePicker.vue'

const today = new Date().toISOString().split('T')[0]
const selectedDate = ref(today)
const neos = ref([])
const loading = ref(false)
const error = ref('')

onMounted(() => loadNEOs())

async function loadNEOs() {
  loading.value = true
  error.value = ''
  try {
    neos.value = await fetchNEOs(selectedDate.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.neo-view {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}
</style>
