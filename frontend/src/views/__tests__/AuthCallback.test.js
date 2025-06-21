// src/views/__tests__/AuthCallback.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AuthCallback from '../AuthCallback.vue'

// Mock the auth service
vi.mock('@/services/auth', () => ({
  handleAuthCallback: vi.fn()
}))

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/auth/callback', component: AuthCallback },
    { path: '/', component: { template: '<div>Home</div>' } }
  ]
})

describe('AuthCallback.vue', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await router.push('/auth/callback')
  })

  it('renders loading state', () => {
    const wrapper = mount(AuthCallback, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.text()).toContain('auth.loggingIn')
  })

  it('calls handleAuthCallback on mount', async () => {
    // Set up URL params
    delete window.location
    window.location = { search: '?code=test-code' }
    
    const authService = await import('@/services/auth')
    authService.handleAuthCallback.mockResolvedValue(true)
    
    mount(AuthCallback, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(authService.handleAuthCallback).toHaveBeenCalledWith('test-code')
  })

  it('redirects to home on successful callback', async () => {
    vi.useFakeTimers()
    delete window.location
    window.location = { search: '?code=test-code' }
    
    const authService = await import('@/services/auth')
    authService.handleAuthCallback.mockResolvedValue(true)
    
    const push = vi.spyOn(router, 'push')
    
    mount(AuthCallback, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    // Component uses setTimeout with 100ms delay
    vi.advanceTimersByTime(100)
    
    expect(push).toHaveBeenCalledWith('/')
    
    vi.useRealTimers()
  })

  it('shows error message on failed callback', async () => {
    delete window.location
    window.location = { search: '?code=test-code' }
    
    const authService = await import('@/services/auth')
    authService.handleAuthCallback.mockRejectedValue(new Error('Auth failed'))
    
    const wrapper = mount(AuthCallback, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(wrapper.text()).toContain('auth.loginFailed')
  })

  it('handles error parameter in URL', async () => {
    delete window.location
    window.location = { search: '?error=access_denied' }
    
    const wrapper = mount(AuthCallback, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(wrapper.text()).toContain('auth.loginFailed')
    expect(wrapper.text()).toContain('access_denied')
  })
})