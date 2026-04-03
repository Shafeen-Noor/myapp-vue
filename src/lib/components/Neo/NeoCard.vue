<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  neo: { type: Object, required: true },
})

const expanded = ref(false)

const approach = computed(() => props.neo.close_approach_data[0] ?? {})
const kmDistance = computed(() =>
  Number(approach.value.miss_distance?.kilometers ?? 0).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  }),
)
const lunarDistance = computed(() => Number(approach.value.miss_distance?.lunar ?? 0).toFixed(2))
const velocityKmh = computed(() =>
  Number(approach.value.relative_velocity?.kilometers_per_hour ?? 0).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  }),
)
const diameterMin = computed(
  () => props.neo.estimated_diameter?.meters?.estimated_diameter_min?.toFixed(0) ?? '—',
)
const diameterMax = computed(
  () => props.neo.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(0) ?? '—',
)
const isHazardous = computed(() => props.neo.is_potentially_hazardous_asteroid)
</script>

<template>
  <article
    class="neo-card"
    :class="{ 'neo-card--hazardous': isHazardous, 'neo-card--expanded': expanded }"
  >
    <button class="neo-card__trigger" @click="expanded = !expanded" :aria-expanded="expanded">
      <div class="neo-card__left">
        <span
          class="neo-card__hazard-dot"
          :title="isHazardous ? 'Potentially hazardous' : 'Not hazardous'"
        ></span>
        <div>
          <p class="neo-card__name">{{ neo.name.replace(/[()]/g, '') }}</p>
          <p class="neo-card__dist">{{ kmDistance }} km away · {{ lunarDistance }} lunar</p>
        </div>
      </div>
      <div class="neo-card__right">
        <span v-if="isHazardous" class="neo-card__badge neo-card__badge--hazard">⚠ HAZARDOUS</span>
        <span v-else class="neo-card__badge neo-card__badge--safe">✓ SAFE</span>
        <span class="neo-card__chevron" :class="{ 'neo-card__chevron--open': expanded }">›</span>
      </div>
    </button>

    <Transition name="expand">
      <div v-if="expanded" class="neo-card__details">
        <div class="neo-card__grid">
          <div class="neo-card__stat">
            <span class="neo-card__stat-label">Velocity</span>
            <span class="neo-card__stat-value">{{ velocityKmh }} <small>km/h</small></span>
          </div>
          <div class="neo-card__stat">
            <span class="neo-card__stat-label">Diameter</span>
            <span class="neo-card__stat-value"
              >{{ diameterMin }}–{{ diameterMax }} <small>m</small></span
            >
          </div>
          <div class="neo-card__stat">
            <span class="neo-card__stat-label">Approach</span>
            <span class="neo-card__stat-value">{{
              approach.close_approach_date_full ?? approach.close_approach_date
            }}</span>
          </div>
          <div class="neo-card__stat">
            <span class="neo-card__stat-label">Orbiting</span>
            <span class="neo-card__stat-value">{{ approach.orbiting_body ?? 'Earth' }}</span>
          </div>
        </div>
        <a
          :href="`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${neo.id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="neo-card__link"
        >
          JPL Database ↗
        </a>
      </div>
    </Transition>
  </article>
</template>

<style scoped>
.neo-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-deep);
  margin-bottom: var(--space-3);
  overflow: hidden;
  transition:
    border-color var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out);
}

.neo-card:hover {
  border-color: var(--color-border-bright);
}

.neo-card--hazardous {
  border-left: 3px solid var(--color-red);
}

.neo-card--hazardous:hover {
  box-shadow: var(--glow-red);
}

.neo-card--expanded {
  border-color: var(--color-border-bright);
}

/* ── Trigger row ─────────────────────────────────────────── */
.neo-card__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: var(--space-4);
}

.neo-card__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  min-width: 0;
}

.neo-card__hazard-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  background: var(--color-green);
}

.neo-card--hazardous .neo-card__hazard-dot {
  background: var(--color-red);
  box-shadow: var(--glow-red);
  animation: pulse-glow 2s ease-in-out infinite;
}

.neo-card__name {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.neo-card__dist {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
  letter-spacing: var(--tracking-mono);
}

.neo-card__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.neo-card__badge {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.neo-card__badge--hazard {
  color: var(--color-red);
  background: var(--color-red-dim);
}

.neo-card__badge--safe {
  color: var(--color-success);
  background: rgba(46, 213, 115, 0.1);
}

.neo-card__chevron {
  color: var(--color-text-tertiary);
  font-size: var(--text-lg);
  transition: transform var(--duration-base) var(--ease-out);
  display: inline-block;
}

.neo-card__chevron--open {
  transform: rotate(90deg);
}

/* ── Details panel ───────────────────────────────────────── */
.neo-card__details {
  padding: var(--space-4) var(--space-5) var(--space-5);
  border-top: 1px solid var(--color-border);
}

.neo-card__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.neo-card__stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.neo-card__stat-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

.neo-card__stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  color: var(--color-text-primary-accent);
}

.neo-card__stat-value small {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.neo-card__link {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary-accent);
  text-decoration: none;
  letter-spacing: var(--tracking-mono);
  transition: color var(--duration-fast);
}

.neo-card__link:hover {
  color: var(--color-secondary);
}

/* ── Expand transition ───────────────────────────────────── */
.expand-enter-active,
.expand-leave-active {
  transition:
    max-height var(--duration-base) var(--ease-out),
    opacity var(--duration-base) var(--ease-out);
  overflow: hidden;
  max-height: 300px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
