// src/layouts/__tests__/MainLayout.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../MainLayout.vue'

// Mock the auth service
vi.mock('@/services/auth', () => ({
  default: {
    logout: vi.fn(),
    getCurrentUser: vi.fn()
  }
}))

// Mock child components
vi.mock('@/components/NavBar.vue', () => ({
  default: {
    name: 'NavBar',
    template: '<nav class="navbar"><slot name="end"></slot></nav>',
    props: ['currentRoute']
  }
}))

vi.mock('@/components/ProfileDropdown.vue', () => ({
  default: {
    name: 'ProfileDropdown',
    template: '<div class="profile-dropdown" @click="$emit(\'logout\')">{{ user?.name }}</div>',
    props: ['user'],
    emits: ['logout']
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
  let mockUser

  beforeEach(() => {
    vi.clearAllMocks()
    mockUser = {
      sub: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      preferred_username: 'testuser'
    }
  })

  it('renders layout structure', () => {
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      },
      slots: {
        default: '<div>Page Content</div>'
      }
    })
    
    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.text()).toContain('Page Content')
  })

  it('displays user profile when authenticated', async () => {
    const authService = await import('@/services/auth')
    authService.default.getCurrentUser.mockResolvedValue(mockUser)
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.profile-dropdown').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test User')
  })

  it('handles logout when profile dropdown emits logout', async () => {
    const authService = await import('@/services/auth')
    authService.default.getCurrentUser.mockResolvedValue(mockUser)
    authService.default.logout.mockResolvedValue()
    
    const push = vi.spyOn(router, 'push')
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await wrapper.vm.$nextTick()
    
    const profileDropdown = wrapper.find('.profile-dropdown')
    await profileDropdown.trigger('click')
    
    expect(authService.default.logout).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith('/login')
  })

  it('checks for user on mount', async () => {
    const authService = await import('@/services/auth')
    authService.default.getCurrentUser.mockResolvedValue(mockUser)
    
    mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(authService.default.getCurrentUser).toHaveBeenCalled()
  })

  it('handles error when getting current user', async () => {
    const authService = await import('@/services/auth')
    authService.default.getCurrentUser.mockRejectedValue(new Error('Auth error'))
    
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await wrapper.vm.$nextTick()
    
    expect(consoleError).toHaveBeenCalled()
    expect(wrapper.find('.profile-dropdown').exists()).toBe(false)
    
    consoleError.mockRestore()
  })

  it('passes current route to NavBar', async () => {
    await router.push('/')
    
    const wrapper = mount(MainLayout, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    const navbar = wrapper.findComponent({ name: 'NavBar' })
    expect(navbar.props('currentRoute')).toBe('/')
  })
})