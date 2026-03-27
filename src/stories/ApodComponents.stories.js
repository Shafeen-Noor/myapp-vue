import ApodHeader from '../lib/components/ApodHeader.vue'
import ApodDatePicker from '../lib/components/ApodDatePicker.vue'
import ApodImage from '../lib/components/ApodImage.vue'
import ApodCard from '../lib/components/ApodCard.vue'
import ApodFetcher from '../lib/components/ApodFetcher.vue'

// Dark background.
const withDarkBackground = (story) => ({
  components: { story },
  template: `
    <div style="background:#08081d; min-height:100vh; padding:2rem; box-sizing:border-box;">
      <story />
    </div>
  `,
})

// ────────────────────────────────────────────────────────────────────────────
// ApodHeader
// ────────────────────────────────────────────────────────────────────────────
export default {}

export const Header = {
  render: () => ({ components: { ApodHeader }, template: '<ApodHeader />' }),
  decorators: [withDarkBackground],
  name: 'ApodHeader',
}

// ────────────────────────────────────────────────────────────────────────────
// ApodDatePicker
// ────────────────────────────────────────────────────────────────────────────
export const DatePickerDefault = {
  name: 'ApodDatePicker / Default',
  decorators: [withDarkBackground],
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
  name: 'ApodDatePicker / Loading state',
  decorators: [withDarkBackground],
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

// ────────────────────────────────────────────────────────────────────────────
// ApodImage
// ────────────────────────────────────────────────────────────────────────────
export const ImageMedia = {
  name: 'ApodImage / Image',
  decorators: [withDarkBackground],
  render: () => ({
    components: { ApodImage },
    template: `
      <ApodImage
        src="https://apod.nasa.gov/apod/image/2603/NGC3190-APOD1024.jpg"
        title="Milky Way Arch"
        media-type="image"
      />
    `,
  }),
}

export const VideoMedia = {
  name: 'ApodImage / Video',
  decorators: [withDarkBackground],
  render: () => ({
    components: { ApodImage },
    template: `
      <ApodImage
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="Sample APOD Video"
        media-type="video"
      />
    `,
  }),
}

// ────────────────────────────────────────────────────────────────────────────
// ApodCard
// ────────────────────────────────────────────────────────────────────────────
const sampleCard = {
  title: 'Milky Way Arch Over Tuscany',
  date: '2024-07-04',
  explanation:
    'On some nights the sky is the limit. On this clear night the band of our Milky Way Galaxy arched across the sky over Tuscany, Italy. In the foreground, a vineyard stretches into the distance.',
  url: 'https://apod.nasa.gov/apod/image/2603/NGC3190-APOD1024.jpg',
  mediaType: 'image',
}

export const CardWithImage = {
  name: 'ApodCard / Image',
  decorators: [withDarkBackground],
  render: () => ({
    components: { ApodCard },
    setup: () => ({ card: sampleCard }),
    template: `
      <ApodCard
        :title="card.title"
        :date="card.date"
        :explanation="card.explanation"
        :url="card.url"
        :media-type="card.mediaType"
      />
    `,
  }),
}

export const CardWithVideo = {
  name: 'ApodCard / Video',
  decorators: [withDarkBackground],
  render: () => ({
    components: { ApodCard },
    setup: () => ({
      card: {
        ...sampleCard,
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
      />
    `,
  }),
}

// ────────────────────────────────────────────────────────────────────────────
// ApodFetcher
// ────────────────────────────────────────────────────────────────────────────
export const FetcherDefault = {
  name: 'ApodFetcher / Full integration',
  decorators: [withDarkBackground],
  render: () => ({
    components: { ApodFetcher },
    template: '<ApodFetcher />',
  }),
}
