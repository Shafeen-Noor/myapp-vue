import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// ─── Mocks ───────────────────────────────────────────────────
vi.mock('../src/lib/api/Apod', () => ({
  fetchAPOD: vi.fn(),
}))
import { fetchAPOD } from '../src/lib/api/Apod'

// ─── Components ──────────────────────────────────────────────
import ApodHeader from '../src/lib/components/Apod/ApodHeader.vue'
import ApodVisual from '../src/lib/components/Apod/ApodVisual.vue'
import ApodDatePicker from '../src/lib/components/Apod/ApodDatePicker.vue'
import ApodImage from '../src/lib/components/Apod/ApodImage.vue'
import ApodCard from '../src/lib/components/Apod/ApodCard.vue'
import ApodView from '../src/lib/views/ApodView.vue'

// ─── Fixtures ────────────────────────────────────────────────
const mockApod = {
  title: 'A Galaxy Far Away',
  date: '2024-01-01',
  explanation: 'A beautiful galaxy photographed by Hubble.',
  url: 'https://example.com/galaxy.jpg',
  media_type: 'image',
  copyright: 'NASA',
}

const mockApodVideo = {
  ...mockApod,
  title: 'Solar Flare Video',
  url: 'https://www.youtube.com/embed/abc123',
  media_type: 'video',
}

beforeEach(() => vi.clearAllMocks())

// ─────────────────────────────────────────────────────────────
// ApodVisual
// ─────────────────────────────────────────────────────────────
describe('ApodVisual', () => {
  it('renders the visual container', () => {
    render(ApodVisual)
    expect(document.querySelector('.apod-header__visual')).toBeInTheDocument()
  })

  it('renders three orbiting asteroid elements', () => {
    render(ApodVisual)
    const asteroids = document.querySelectorAll('.asteroid')
    expect(asteroids).toHaveLength(3)
  })
})

// ─────────────────────────────────────────────────────────────
// ApodHeader
// ─────────────────────────────────────────────────────────────
describe('ApodHeader', () => {
  it('renders the eyebrow text', () => {
    render(ApodHeader)
    expect(screen.getByText('NASA · Astronomy Picture of the Day')).toBeInTheDocument()
  })

  it('renders the main heading', () => {
    render(ApodHeader)
    expect(screen.getByRole('heading', { name: 'Explore the Cosmos' })).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(ApodHeader)
    expect(screen.getByText('Discover the wonders of the universe')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// ApodDatePicker
// ─────────────────────────────────────────────────────────────
describe('ApodDatePicker', () => {
  const defaultProps = {
    modelValue: '',
    loading: false,
    maxDate: '2099-12-31',
  }

  it('renders the label "Transmission Date"', () => {
    render(ApodDatePicker, { props: defaultProps })
    expect(screen.getByLabelText('Transmission Date')).toBeInTheDocument()
  })

  it('renders the "Receive Signal" button', () => {
    render(ApodDatePicker, { props: defaultProps })
    expect(screen.getByRole('button', { name: 'Receive Signal' })).toBeInTheDocument()
  })

  it('sets the min attribute to 1995-06-16', () => {
    render(ApodDatePicker, { props: defaultProps })
    expect(screen.getByLabelText('Transmission Date')).toHaveAttribute('min', '1995-06-16')
  })

  it('sets the max attribute from the maxDate prop', () => {
    render(ApodDatePicker, { props: { ...defaultProps, maxDate: '2030-06-01' } })
    expect(screen.getByLabelText('Transmission Date')).toHaveAttribute('max', '2030-06-01')
  })

  it('reflects the modelValue in the input', () => {
    render(ApodDatePicker, { props: { ...defaultProps, modelValue: '2024-07-04' } })
    expect(screen.getByLabelText('Transmission Date')).toHaveValue('2024-07-04')
  })

  it('emits update:modelValue when the input changes', async () => {
    const { emitted } = render(ApodDatePicker, { props: defaultProps })
    await fireEvent.input(screen.getByLabelText('Transmission Date'), {
      target: { value: '2024-03-15' },
    })
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['2024-03-15'])
  })

  it('emits fetch when the button is clicked', async () => {
    const { emitted } = render(ApodDatePicker, { props: defaultProps })
    await fireEvent.click(screen.getByRole('button', { name: 'Receive Signal' }))
    expect(emitted().fetch).toBeTruthy()
  })

  it('disables the button when loading is true', () => {
    render(ApodDatePicker, { props: { ...defaultProps, loading: true } })
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows a spinner instead of "Receive Signal" when loading', () => {
    render(ApodDatePicker, { props: { ...defaultProps, loading: true } })
    expect(screen.queryByText('Receive Signal')).not.toBeInTheDocument()
    expect(document.querySelector('.picker__btn-spinner')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// ApodImage
// ─────────────────────────────────────────────────────────────
describe('ApodImage', () => {
  it('renders an <img> when mediaType is "image"', () => {
    render(ApodImage, {
      props: { src: 'https://example.com/img.jpg', title: 'Galaxy', mediaType: 'image' },
    })
    const img = screen.getByRole('img', { name: 'Galaxy' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('renders an <iframe> when mediaType is "video"', () => {
    render(ApodImage, {
      props: { src: 'https://youtube.com/embed/abc', title: 'Solar Flare', mediaType: 'video' },
    })
    const iframe = document.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'https://youtube.com/embed/abc')
    expect(iframe).toHaveAttribute('title', 'Solar Flare')
  })

  it('defaults to image when mediaType is not provided', () => {
    render(ApodImage, {
      props: { src: 'https://example.com/img.jpg', title: 'Galaxy' },
    })
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// ApodCard
// ─────────────────────────────────────────────────────────────
describe('ApodCard', () => {
  const baseProps = {
    title: 'Pillars of Creation',
    date: '2024-03-01',
    explanation: 'Famous Hubble image of gas pillars.',
    url: 'https://example.com/pillars.jpg',
    mediaType: 'image',
    copyright: 'NASA / ESA',
  }

  it('renders the title', () => {
    render(ApodCard, { props: baseProps })
    expect(screen.getByRole('heading', { name: 'Pillars of Creation' })).toBeInTheDocument()
  })

  it('renders the date', () => {
    render(ApodCard, { props: baseProps })
    expect(screen.getByText('2024-03-01')).toBeInTheDocument()
  })

  it('renders the explanation', () => {
    render(ApodCard, { props: baseProps })
    expect(screen.getByText('Famous Hubble image of gas pillars.')).toBeInTheDocument()
  })

  it('renders the copyright when provided', () => {
    render(ApodCard, { props: baseProps })
    expect(screen.getByText('© NASA / ESA')).toBeInTheDocument()
  })

  it('does not render copyright when empty', () => {
    render(ApodCard, { props: { ...baseProps, copyright: '' } })
    expect(screen.queryByText(/©/)).not.toBeInTheDocument()
  })

  it('renders an image for mediaType "image"', () => {
    render(ApodCard, { props: baseProps })
    expect(screen.getByRole('img', { name: 'Pillars of Creation' })).toBeInTheDocument()
  })

  it('renders an iframe for mediaType "video"', () => {
    render(ApodCard, {
      props: { ...baseProps, url: 'https://youtube.com/embed/abc', mediaType: 'video' },
    })
    expect(document.querySelector('iframe')).toBeInTheDocument()
    expect(document.querySelector('img')).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// ApodView
// Note: ApodView auto-fetches today's date on mount.
// Always mock fetchAPOD before render() to avoid unhandled rejections.
// ─────────────────────────────────────────────────────────────
describe('ApodView', () => {
  it('renders the header, picker, and button on mount', async () => {
    fetchAPOD.mockResolvedValue(mockApod)
    render(ApodView)
    expect(screen.getByText('NASA · Astronomy Picture of the Day')).toBeInTheDocument()
    expect(screen.getByLabelText('Transmission Date')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Receive Signal' })).toBeInTheDocument(),
    )
  })

  it("calls fetchAPOD on mount with today's date", async () => {
    fetchAPOD.mockResolvedValue(mockApod)
    render(ApodView)
    const today = new Date().toISOString().split('T')[0]
    await waitFor(() => expect(fetchAPOD).toHaveBeenCalledWith(today))
  })

  it('shows loading indicator while fetch is in progress', async () => {
    fetchAPOD.mockReturnValue(new Promise(() => {}))
    render(ApodView)
    await waitFor(() => expect(screen.getByText(/contacting nasa/i)).toBeInTheDocument())
  })

  it('disables the button while loading', async () => {
    fetchAPOD.mockReturnValue(new Promise(() => {}))
    render(ApodView)
    await waitFor(() => expect(screen.getByRole('button')).toBeDisabled())
  })

  it('renders the card with title and description after a successful fetch', async () => {
    fetchAPOD.mockResolvedValue(mockApod)
    render(ApodView)
    await waitFor(() => {
      expect(screen.getByText('A Galaxy Far Away')).toBeInTheDocument()
      expect(screen.getByText('A beautiful galaxy photographed by Hubble.')).toBeInTheDocument()
    })
  })

  it('renders an image on the card for image media type', async () => {
    fetchAPOD.mockResolvedValue(mockApod)
    render(ApodView)
    await waitFor(() =>
      expect(screen.getByRole('img', { name: 'A Galaxy Far Away' })).toBeInTheDocument(),
    )
  })

  it('renders an iframe on the card for video media type', async () => {
    fetchAPOD.mockResolvedValue(mockApodVideo)
    render(ApodView)
    await waitFor(() => expect(document.querySelector('iframe')).toBeInTheDocument())
  })

  it('shows the date and copyright on the card', async () => {
    fetchAPOD.mockResolvedValue(mockApod)
    render(ApodView)
    await waitFor(() => {
      expect(screen.getByText('2024-01-01')).toBeInTheDocument()
      expect(screen.getByText('© NASA')).toBeInTheDocument()
    })
  })

  it('shows error message when fetchAPOD rejects', async () => {
    fetchAPOD.mockRejectedValue(new Error('NASA is down'))
    render(ApodView)
    await waitFor(() => expect(screen.getByText(/nasa is down/i)).toBeInTheDocument())
  })

  it('does not show the loading indicator after fetch completes', async () => {
    fetchAPOD.mockResolvedValue(mockApod)
    render(ApodView)
    await waitFor(() => expect(screen.queryByText(/contacting nasa/i)).not.toBeInTheDocument())
  })

  it('re-fetches when a new date is selected and Receive Signal is clicked', async () => {
    fetchAPOD.mockResolvedValue(mockApod)
    render(ApodView)
    await waitFor(() => expect(fetchAPOD).toHaveBeenCalledTimes(1))

    await fireEvent.input(screen.getByLabelText('Transmission Date'), {
      target: { value: '2024-06-15' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Receive Signal' }))

    await waitFor(() => {
      expect(fetchAPOD).toHaveBeenCalledTimes(2)
      expect(fetchAPOD).toHaveBeenLastCalledWith('2024-06-15')
    })
  })

  it('clears the card when a new fetch begins', async () => {
    fetchAPOD.mockResolvedValueOnce(mockApod).mockReturnValue(new Promise(() => {}))
    render(ApodView)
    await waitFor(() => expect(screen.getByText('A Galaxy Far Away')).toBeInTheDocument())

    await fireEvent.input(screen.getByLabelText('Transmission Date'), {
      target: { value: '2024-02-01' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Receive Signal' }))
    await waitFor(() => expect(screen.queryByText('A Galaxy Far Away')).not.toBeInTheDocument())
  })

  it('clears a previous error when a new fetch begins', async () => {
    fetchAPOD
      .mockRejectedValueOnce(new Error('NASA is down'))
      .mockReturnValue(new Promise(() => {}))
    render(ApodView)
    await waitFor(() => expect(screen.getByText(/nasa is down/i)).toBeInTheDocument())

    await fireEvent.input(screen.getByLabelText('Transmission Date'), {
      target: { value: '2024-02-01' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Receive Signal' }))
    await waitFor(() => expect(screen.queryByText(/nasa is down/i)).not.toBeInTheDocument())
  })
})
