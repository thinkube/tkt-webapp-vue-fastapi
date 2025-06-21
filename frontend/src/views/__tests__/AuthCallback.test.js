// src/views/__tests__/AuthCallback.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AuthCallback from '../AuthCallback.vue'

// Mock the auth service
vi.mock('@/services/auth', () => ({
  default: {
    handleCallback: vi.fn()
  }
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
    
    expect(wrapper.find('.hero').exists()).toBe(true)
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('authCallback.processing')
  })

  it('calls handleCallback on mount', async () => {
    const authService = await import('@/services/auth')
    authService.default.handleCallback.mockResolvedValue(true)
    
    mount(AuthCallback, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(authService.default.handleCallback).toHaveBeenCalled()
  })

  it('redirects to home on successful callback', async () => {
    const authService = await import('@/services/auth')
    authService.default.handleCallback.mockResolvedValue(true)
    
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
    
    expect(push).toHaveBeenCalledWith('/')
  })

  it('shows error message on failed callback', async () => {
    const authService = await import('@/services/auth')
    authService.default.handleCallback.mockRejectedValue(new Error('Auth failed'))
    
    const wrapper = mount(AuthCallback, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(wrapper.find('.alert-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('authCallback.error')
  })

  it('provides link to login on error', async () => {
    const authService = await import('@/services/auth')
    authService.default.handleCallback.mockRejectedValue(new Error('Auth failed'))
    
    const wrapper = mount(AuthCallback, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    const loginLink = wrapper.find('a.btn-primary')
    expect(loginLink.exists()).toBe(true)
    expect(loginLink.text()).toBe('authCallback.backToLogin')
    expect(loginLink.attributes('href')).toBe('/login')
  })
})