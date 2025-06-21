// src/views/__tests__/Login.test.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../Login.vue'

// Mock the auth service
vi.mock('@/services/auth', () => ({
  default: {
    login: vi.fn()
  }
}))

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: { template: '<div>Home</div>' } }
  ]
})

describe('Login.vue', () => {
  it('renders login page with correct structure', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(wrapper.find('.hero').exists()).toBe(true)
    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('login.title')
  })

  it('displays login button', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    const loginButton = wrapper.find('.btn-primary')
    expect(loginButton.exists()).toBe(true)
    expect(loginButton.text()).toBe('login.loginButton')
  })

  it('calls auth service when login button clicked', async () => {
    const authService = await import('@/services/auth')
    
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    const loginButton = wrapper.find('.btn-primary')
    await loginButton.trigger('click')
    
    expect(authService.default.login).toHaveBeenCalled()
  })

  it('displays features list', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    const features = wrapper.findAll('li')
    expect(features.length).toBeGreaterThan(0)
  })
})