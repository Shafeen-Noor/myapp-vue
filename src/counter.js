import { ref } from 'vue'

export function counter() {
  const count = ref(0)
  function increment() {
    count.value++
  }
  return { count, increment }
}
