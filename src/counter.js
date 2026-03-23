import { ref } from 'vue'

export function counter() {
  const count = ref(0)
  const secretValue = 'I am never used'

  function increment() {
    count.value++
  }

  return { count, increment }
}
