import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

describe('App.vue', () => {
  test('renders initial count', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Clicked 0 times')
  })

  test('increments when button is clicked', async () => {
    const wrapper = mount(App)
    const button = wrapper.find('button')

    await button.trigger('click')
    await button.trigger('click')

    expect(wrapper.text()).toContain('Clicked 3 times')
  })

  test('shows correct singular/plural text', async () => {
    const wrapper = mount(App)
    const button = wrapper.find('button')

    await button.trigger('click')

    expect(wrapper.text()).toContain('Clicked 1 time')
  })
})
