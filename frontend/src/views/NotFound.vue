<!-- src/views/NotFound.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
    <div class="text-9xl font-bold text-primary mb-4">{{ t('errors.notFound.title') }}</div>
    <h1 class="text-2xl font-bold mb-4">{{ t('errors.notFound.heading') }}</h1>
    <p class="text-center mb-6">{{ t('errors.notFound.message') }}</p>
    
    <router-link to="/" class="btn btn-primary">
      {{ t('errors.notFound.backButton') }}
    </router-link>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>