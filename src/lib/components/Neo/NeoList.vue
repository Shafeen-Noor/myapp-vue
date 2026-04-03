<template>
  <div v-if="neos.length" class="neo-list">
    <p class="neo-list__count">
      {{ neos.length }} object{{ neos.length !== 1 ? 's' : '' }} detected —
      <span class="neo-list__hazardous">
        {{ neos.filter((n) => n.is_potentially_hazardous_asteroid).length }} potentially hazardous
      </span>
    </p>
    <NeoCard v-for="neo in neos" :key="neo.id" :neo="neo" />
  </div>
</template>

<script setup>
import NeoCard from './NeoCard.vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  neos: { type: Array, required: true },
})
</script>

<style scoped>
.neo-list__count {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-mono);
}

.neo-list__hazardous {
  color: var(--color-red);
}
</style>
