// src/layouts/__tests__/MainLayout.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../MainLayout.vue'

// Mock the auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

// Mock child components
vi.mock('@/components/NavBar.vue', () => ({
  default: {
    name: 'NavBar',
    template: '<nav class="navbar">NavBar</nav>',
    props: ['user']
  }
}))

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } }
  ]
})

describe('MainLayout.vue', () => {
  let mockAuthStore
  let mockUser

  beforeEach(() => {
    vi.clearAllMocks()
    mockUser = {
      sub: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      preferred_username: 'testuser'
    }
    
    // Default auth store mock
    mockAuthStore = {
      user: null,
      loading: false,
      fetchUser: vi.fn()
    }
  })

  it('renders loading state when loading', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    useAuthStore.mockReturnValue({
      ...mockAuthStore,
      loading: true
    })
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('errors.general.loading')
  })

  it('renders navbar when user is authenticated', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    useAuthStore.mockReturnValue({
      ...mockAuthStore,
      user: mockUser
    })
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        },
        stubs: {
          RouterView: true
        }
      }
    })
    
    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
  })

  it('shows error state when no user and not loading', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    useAuthStore.mockReturnValue(mockAuthStore)
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(wrapper.text()).toContain('errors.loadingApp.title')
    expect(wrapper.find('.btn-primary').exists()).toBe(true)
  })

  it('calls fetchUser on mount when no user', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const fetchUserMock = vi.fn()
    useAuthStore.mockReturnValue({
      ...mockAuthStore,
      fetchUser: fetchUserMock
    })
    
    mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(fetchUserMock).toHaveBeenCalled()
  })

  it('does not call fetchUser when user exists', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const fetchUserMock = vi.fn()
    useAuthStore.mockReturnValue({
      ...mockAuthStore,
      user: mockUser,
      fetchUser: fetchUserMock
    })
    
    mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(fetchUserMock).not.toHaveBeenCalled()
  })

  it('reload button calls window.location.reload', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    useAuthStore.mockReturnValue(mockAuthStore)
    
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    })
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    const reloadButton = wrapper.find('.btn-primary')
    await reloadButton.trigger('click')
    
    expect(reloadMock).toHaveBeenCalled()
  })
})