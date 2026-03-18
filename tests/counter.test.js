import { describe, test, expect } from 'vitest'
import { counter } from '../src/counter'

describe('counter', () => {
  test('starts at 0', () => {
    const { count } = counter()
    expect(count.value).toBe(0)
  })

  test('increments once', () => {
    const { count, increment } = counter()
    increment()
    expect(count.value).toBe(1)
  })

  test('increments multiple times', () => {
    const { count, increment } = counter()
    increment()
    increment()
    increment()
    expect(count.value).toBe(3)
  })

  test('independent instances have separate counts', () => {
    const count1 = counter()
    const count2 = counter()

    count1.increment()
    count2.increment()
    count2.increment()

    expect(count1.count.value).toBe(1)
    expect(count2.count.value).toBe(2)
  })

  test('count remains reactive', () => {
    const { count, increment } = counter()
    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
    increment()
    expect(count.value).toBe(2)
  })
})
