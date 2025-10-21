<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { handleAuthCallback } from '@/services/auth'

const router = useRouter()
const { t } = useI18n()
const message = ref(t('auth.loggingIn'))

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const error = urlParams.get('error')
  
  if (error) {
    message.value = `${t('auth.loginFailed')}: ${error}`
    setTimeout(() => {
      router.push('/')
    }, 3000)
    return
  }
  
  if (!code) {
    message.value = t('auth.noCode')
    setTimeout(() => {
      router.push('/')
    }, 3000)
    return
  }
  
  try {
    await handleAuthCallback(code)
    message.value = t('auth.loginSuccess')
    // Small delay to ensure token is properly stored
    setTimeout(() => {
      // Redirect to home after successful authentication
      router.push('/')
    }, 100)
  } catch (error) {
    console.error('Auth callback failed:', error)
    message.value = `${t('auth.loginFailed')}. ${t('auth.redirecting')}`
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }
})
</script>