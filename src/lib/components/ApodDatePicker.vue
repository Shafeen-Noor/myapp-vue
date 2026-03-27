<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  maxDate: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'fetch'])
</script>

<template>
  <div class="picker-row">
    <label for="date-input">Date</label>
    <input
      id="date-input"
      type="date"
      min="1995-06-16"
      :max="maxDate"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <button @click="emit('fetch')" :disabled="loading">
      {{ loading ? 'Loading…' : 'Fetch Picture' }}
    </button>
  </div>
</template>

<style scoped src="../styles/ApodDatePicker.css" />
