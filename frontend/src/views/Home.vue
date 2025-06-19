<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-4">{{ $t('home.title') }}</h1>
      <p class="text-lg text-gray-600">{{ $t('home.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Example items -->
      <div v-for="item in items" :key="item.id" class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ item.title }}</h2>
          <p>{{ item.description }}</p>
          <div class="text-sm text-gray-500">
            {{ formatDate(item.created_at) }}
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="items.length === 0" class="col-span-full text-center py-12">
        <p class="text-gray-500">{{ $t('home.noItems') }}</p>
        <button @click="createExample" class="btn btn-primary mt-4">
          {{ $t('home.createFirst') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const { t } = useI18n()
const items = ref([])

const fetchItems = async () => {
  try {
    const response = await api.get('/example/items')
    items.value = response.data
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
}

const createExample = async () => {
  try {
    const newItem = {
      title: t('home.exampleTitle'),
      description: t('home.exampleDescription')
    }
    await api.post('/example/items', newItem)
    await fetchItems()
  } catch (error) {
    console.error('Failed to create item:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchItems()
})
</script>