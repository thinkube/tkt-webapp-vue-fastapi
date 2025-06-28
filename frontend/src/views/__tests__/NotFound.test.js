// src/views/__tests__/NotFound.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]
})

describe('NotFound.vue', () => {
  it('renders 404 page', () => {
    const wrapper = mount(NotFound, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    expect(wrapper.find('.text-9xl').text()).toBe('errors.notFound.title')
    expect(wrapper.find('h1').text()).toBe('errors.notFound.heading')
  })

  it('displays error message', () => {
    const wrapper = mount(NotFound, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(wrapper.find('p').text()).toBe('errors.notFound.message')
  })

  it('provides link back to home', () => {
    const wrapper = mount(NotFound, {
      global: {
        plugins: [router],
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    const homeLink = wrapper.find('a.btn-primary')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.text()).toBe('errors.notFound.backButton')
    expect(homeLink.attributes('href')).toBe('/')
  })
})