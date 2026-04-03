import ApodVisual from '../lib/components/Apod/ApodVisual.vue'
import ApodHeader from '../lib/components/Apod/ApodHeader.vue'
import ApodDatePicker from '../lib/components/Apod/ApodDatePicker.vue'
import ApodImage from '../lib/components/Apod/ApodImage.vue'
import ApodCard from '../lib/components/Apod/ApodCard.vue'
import ApodView from '../lib/views/ApodView.vue'

import NeoOrbitVisual from '../lib/components/Neo/NeoOrbitVisual.vue'
import NeoHeader from '../lib/components/Neo/NeoHeader.vue'
import NeoCard from '../lib/components/Neo/NeoCard.vue'
import NeoList from '../lib/components/Neo/NeoList.vue'
import NeoView from '../lib/views/NeoView.vue'
import '../lib/styles/tokens.css'

// ─── Decorator ───────────────────────────────────────────────
const withBackground = (story) => ({
  components: { story },
  template: `
    <div style="background:#02020a; min-height: 100vh; padding: 2rem; box-sizing: border-box; font-family: 'Space Mono', monospace;">
      <story />
    </div>
  `,
})

// ─── Shared fixtures ─────────────────────────────────────────
const sampleApod = {
  title: 'Interacting Galaxies NGC 3190',
  date: '2026-03-28',
  explanation:
    'A group of four interacting galaxies, NGC 3190 is part of Hickson Compact Group 44. ' +
    'Located about 60 million light-years away in the constellation Leo, the group is dominated ' +
    'by two large spiral galaxies shown above in a sharp Hubble image.',
  url: 'https://apod.nasa.gov/apod/image/2603/NGC3190-APOD1024.jpg',
  mediaType: 'image',
  copyright: 'NASA / ESA',
}

const makeNeo = (overrides = {}) => ({
  id: '54321',
  name: '(2024 BX1)',
  is_potentially_hazardous_asteroid: false,
  estimated_diameter: {
    meters: { estimated_diameter_min: 12.5, estimated_diameter_max: 27.9 },
  },
  close_approach_data: [
    {
      close_approach_date: '2024-01-01',
      close_approach_date_full: '2024-Jan-01 14:32',
      miss_distance: { kilometers: '384400', lunar: '1.00' },
      relative_velocity: { kilometers_per_hour: '54000' },
      orbiting_body: 'Earth',
    },
  ],
  ...overrides,
})

const safeNeo = makeNeo()
const hazardousNeo = makeNeo({
  id: '99999',
  name: '(1999 AN10)',
  is_potentially_hazardous_asteroid: true,
})

// ─────────────────────────────────────────────────────────────
// Default export
// ─────────────────────────────────────────────────────────────
export default {
  title: 'Cosmos Observer',
  decorators: [withBackground],
}

// ═════════════════════════════════════════════════════════════
// APOD
// ═════════════════════════════════════════════════════════════

// ─── ApodVisual ──────────────────────────────────────────────
export const ApodVisualStory = {
  name: 'APOD / ApodVisual',
  render: () => ({
    components: { ApodVisual },
    template: '<ApodVisual />',
  }),
}

// ─── ApodHeader ──────────────────────────────────────────────
export const ApodHeaderStory = {
  name: 'APOD / ApodHeader',
  render: () => ({
    components: { ApodHeader },
    template: '<ApodHeader />',
  }),
}

// ─── ApodDatePicker ──────────────────────────────────────────
export const DatePickerDefault = {
  name: 'APOD / ApodDatePicker / Default',
  render: () => ({
    components: { ApodDatePicker },
    data() {
      return { date: '', loading: false }
    },
    methods: {
      onFetch() {
        this.loading = true
        setTimeout(() => (this.loading = false), 2000)
      },
    },
    template: `
      <ApodDatePicker
        v-model="date"
        :loading="loading"
        max-date="2099-12-31"
        @fetch="onFetch"
      />
    `,
  }),
}

export const DatePickerLoading = {
  name: 'APOD / ApodDatePicker / Loading',
  render: () => ({
    components: { ApodDatePicker },
    template: `
      <ApodDatePicker
        model-value="2024-07-04"
        :loading="true"
        max-date="2099-12-31"
      />
    `,
  }),
}

// ─── ApodImage ───────────────────────────────────────────────
export const ApodImageStory = {
  name: 'APOD / ApodImage / Image',
  render: () => ({
    components: { ApodImage },
    template: `
      <ApodImage
        src="https://apod.nasa.gov/apod/image/2603/NGC3190-APOD1024.jpg"
        title="Interacting Galaxies NGC 3190"
        media-type="image"
      />
    `,
  }),
}

export const ApodImageVideo = {
  name: 'APOD / ApodImage / Video',
  render: () => ({
    components: { ApodImage },
    template: `
      <ApodImage
        src="https://www.youtube.com/embed/MTY1Kje0yLg"
        title="NASA Hubble Deep Field"
        media-type="video"
      />
    `,
  }),
}

// ─── ApodCard ────────────────────────────────────────────────
export const ApodCardImage = {
  name: 'APOD / ApodCard / Image',
  render: () => ({
    components: { ApodCard },
    setup: () => ({ card: sampleApod }),
    template: `
      <ApodCard
        :title="card.title"
        :date="card.date"
        :explanation="card.explanation"
        :url="card.url"
        :media-type="card.mediaType"
        :copyright="card.copyright"
      />
    `,
  }),
}

export const ApodCardVideo = {
  name: 'APOD / ApodCard / Video',
  render: () => ({
    components: { ApodCard },
    setup: () => ({
      card: {
        ...sampleApod,
        url: 'https://www.youtube.com/embed/MTY1Kje0yLg',
        mediaType: 'video',
      },
    }),
    template: `
      <ApodCard
        :title="card.title"
        :date="card.date"
        :explanation="card.explanation"
        :url="card.url"
        :media-type="card.mediaType"
        :copyright="card.copyright"
      />
    `,
  }),
}

export const ApodCardNoCopyright = {
  name: 'APOD / ApodCard / No Copyright',
  render: () => ({
    components: { ApodCard },
    setup: () => ({ card: { ...sampleApod, copyright: '' } }),
    template: `
      <ApodCard
        :title="card.title"
        :date="card.date"
        :explanation="card.explanation"
        :url="card.url"
        :media-type="card.mediaType"
        copyright=""
      />
    `,
  }),
}

// ─── ApodView ────────────────────────────────────────────────
export const ApodViewStory = {
  name: 'APOD / ApodView',
  render: () => ({
    components: { ApodView },
    template: '<ApodView />',
  }),
}

// ═════════════════════════════════════════════════════════════
// NEO
// ═════════════════════════════════════════════════════════════

// ─── NeoOrbitVisual ──────────────────────────────────────────
export const NeoOrbitVisualStory = {
  name: 'NEO / NeoOrbitVisual',
  render: () => ({
    components: { NeoOrbitVisual },
    template: '<NeoOrbitVisual />',
  }),
}

// ─── NeoHeader ───────────────────────────────────────────────
export const NeoHeaderStory = {
  name: 'NEO / NeoHeader',
  render: () => ({
    components: { NeoHeader },
    template: '<NeoHeader />',
  }),
}

// ─── NeoCard ─────────────────────────────────────────────────
export const NeoCardSafe = {
  name: 'NEO / NeoCard / Safe',
  render: () => ({
    components: { NeoCard },
    setup: () => ({ neo: safeNeo }),
    template: '<NeoCard :neo="neo" />',
  }),
}

export const NeoCardHazardous = {
  name: 'NEO / NeoCard / Hazardous',
  render: () => ({
    components: { NeoCard },
    setup: () => ({ neo: hazardousNeo }),
    template: '<NeoCard :neo="neo" />',
  }),
}

// ─── NeoList ─────────────────────────────────────────────────
export const NeoListMixed = {
  name: 'NEO / NeoList / Mixed',
  render: () => ({
    components: { NeoList },
    setup: () => ({ neos: [safeNeo, hazardousNeo] }),
    template: '<NeoList :neos="neos" />',
  }),
}

export const NeoListSafeOnly = {
  name: 'NEO / NeoList / Safe Only',
  render: () => ({
    components: { NeoList },
    setup: () => ({ neos: [safeNeo] }),
    template: '<NeoList :neos="neos" />',
  }),
}

export const NeoListEmpty = {
  name: 'NEO / NeoList / Empty',
  render: () => ({
    components: { NeoList },
    setup: () => ({ neos: [] }),
    template: '<NeoList :neos="neos" />',
  }),
}

// ─── NeoView ─────────────────────────────────────────────────
export const NeoViewStory = {
  name: 'NEO / NeoView',
  render: () => ({
    components: { NeoView },
    template: '<NeoView />',
  }),
}
