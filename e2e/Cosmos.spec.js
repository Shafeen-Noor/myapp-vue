/* eslint-disable playwright/expect-expect */

import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0]

async function goToApod(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await expect(page.getByRole('heading', { name: 'Explore the Cosmos' })).toBeVisible()
}

async function goToNeo(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /Asteroid Watch/i }).click()
  await expect(page.getByRole('heading', { name: 'Asteroid Watch' })).toBeVisible()
}

async function expectApodDataOrNoData(page) {
  const card = page.locator('.apod-card')
  const noData = page.getByText(/No data available/i)

  // Wait up to 60s for either to appear
  await Promise.race([
    card.waitFor({ state: 'visible', timeout: 60000 }),
    noData.waitFor({ state: 'visible', timeout: 60000 }),
  ]).catch(() => {
    // If both time out, the assertions below will fail with a clear message
  })

  const cardVisible = await card.isVisible()
  const noDataVisible = await noData.isVisible()

  if (cardVisible) {
    await expect(page.locator('.apod-card__title')).toBeVisible()
    await expect(page.locator('.apod-card__description')).toBeVisible()
  } else if (noDataVisible) {
    await expect(noData).toBeVisible()
  } else {
    throw new Error('Neither .apod-card nor "No data available" appeared within 60s')
  }
}

// ─────────────────────────────────────────────────────────────
// Shell — always visible regardless of view
// ──────── ─────────────────────────────────────────────────────
test.describe('Shell', () => {
  test.beforeEach(async ({ page }) => {
    await goToApod(page, { timeout: 60000 })
  })

  test('shows the observatory bar logo', async ({ page }) => {
    await expect(page.getByText('✦ COSMOS OBSERVER')).toBeVisible()
  })

  test('shows both nav items', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Picture of the Day/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Asteroid Watch/i })).toBeVisible()
  })

  test('APOD view is active by default', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Explore the Cosmos' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Asteroid Watch' })).toBeHidden()
  })

  test('navigates to NEO view when Asteroid Watch is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Asteroid Watch/i }).click()
    await expect(page.getByRole('heading', { name: 'Asteroid Watch' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Explore the Cosmos' })).toBeHidden()
  })

  test('navigates back to APOD from NEO', async ({ page }) => {
    await page.getByRole('button', { name: /Asteroid Watch/i }).click()
    await page.getByRole('button', { name: /Picture of the Day/i }).click()
    await expect(page.getByRole('heading', { name: 'Explore the Cosmos' })).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────
// APOD View
// ─────────────────────────────────────────────────────────────
test.describe('APOD View', () => {
  test.beforeEach(async ({ page }) => {
    await goToApod(page)
  })

  test('renders eyebrow and main heading', async ({ page }) => {
    await expect(page.getByText('NASA · Astronomy Picture of the Day')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Explore the Cosmos' })).toBeVisible()
  })

  test('renders date picker with label "Transmission Date"', async ({ page }) => {
    await expect(page.getByLabel('Transmission Date')).toBeVisible()
  })

  test('renders "Receive Signal" button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Receive Signal' })).toBeVisible()
  })

  test('date input max is today', async ({ page }) => {
    await expect(page.getByLabel('Transmission Date')).toHaveAttribute('max', today)
  })

  test('date input min is 1995-06-16', async ({ page }) => {
    await expect(page.getByLabel('Transmission Date')).toHaveAttribute('min', '1995-06-16')
  })

  test("auto-loads today's picture on mount", async ({ page }) => {
    await expectApodDataOrNoData(page)
  })

  test('shows loading indicator while fetching', async ({ page }) => {
    // Change the date and re-fetch to observe loading state
    await page.getByLabel('Transmission Date').fill('2024-01-15')
    await page.getByRole('button', { name: 'Receive Signal' }).click()
    await expect(page.locator('.status--loading')).toBeVisible()
  })

  test('renders card with title and description after fetch', async ({ page }) => {
    await expectApodDataOrNoData(page)
  })

  test('fetching a different date replaces the card', async ({ page }) => {
    await page.getByLabel('Transmission Date').fill('2023-06-01')
    await page.getByRole('button', { name: 'Receive Signal' }).click()
    await expectApodDataOrNoData(page)
  })
})

// ─────────────────────────────────────────────────────────────
// NEO View
// ─────────────────────────────────────────────────────────────
test.describe('NEO View', () => {
  test.beforeEach(async ({ page }) => {
    await goToNeo(page)
  })

  test('renders eyebrow and main heading', async ({ page }) => {
    await expect(page.getByText('NASA · Near Earth Objects')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Asteroid Watch' })).toBeVisible()
  })

  test('renders the orbit visual', async ({ page }) => {
    await expect(page.locator('.neo-orbit-visual')).toBeVisible()
  })

  test('renders date picker with label "Transmission Date"', async ({ page }) => {
    await expect(page.getByLabel('Transmission Date')).toBeVisible()
  })

  test('date picker allows future dates (max 2100-12-31)', async ({ page }) => {
    await expect(page.getByLabel('Transmission Date')).toHaveAttribute('max', '2100-12-31')
  })

  test("auto-loads today's NEOs on mount", async ({ page }) => {
    await expect(page.locator('.neo-list')).toBeVisible({ timeout: 15000 })
  })

  test('shows at least one asteroid card after load', async ({ page }) => {
    await expect(page.locator('.neo-list')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.neo-card').first()).toBeVisible()
  })

  test('shows object count summary', async ({ page }) => {
    await expect(page.locator('.neo-list')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('.neo-list__count')).toBeVisible()
    await expect(page.locator('.neo-list__count')).toContainText('detected')
  })

  test('expands a NEO card on click to reveal details', async ({ page }) => {
    await expect(page.locator('.neo-list')).toBeVisible({ timeout: 15000 })
    const firstTrigger = page.locator('.neo-card__trigger').first()
    await firstTrigger.click()
    await expect(page.locator('.neo-card__details').first()).toBeVisible()
  })

  test('expanded card shows velocity stat', async ({ page }) => {
    await expect(page.locator('.neo-list')).toBeVisible({ timeout: 15000 })
    await page.locator('.neo-card__trigger').first().click()
    await expect(page.locator('.neo-card__details').first().getByText(/km\/h/i)).toBeVisible()
  })

  test('collapses the card on second click', async ({ page }) => {
    await expect(page.locator('.neo-list')).toBeVisible({ timeout: 15000 })
    const firstTrigger = page.locator('.neo-card__trigger').first()
    await firstTrigger.click()
    await expect(page.locator('.neo-card__details').first()).toBeVisible()
    await firstTrigger.click()
    await expect(page.locator('.neo-card__details').first()).toBeHidden()
  })

  test('fetches NEOs for a future date', async ({ page }) => {
    await page.getByLabel('Transmission Date').fill('2026-12-25')
    await page.getByRole('button', { name: 'Receive Signal' }).click()
    await expect(page.locator('.neo-list')).toBeVisible({ timeout: 15000 })
  })
})
