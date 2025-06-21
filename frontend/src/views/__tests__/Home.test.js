// src/views/__tests__/Home.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Home from '../Home.vue'
import api from '@/services/api'

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

describe('Home.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the home page structure', () => {
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('home.title')
  })

  it('fetches items on mount', async () => {
    const mockItems = [
      { id: 1, title: 'Item 1', description: 'Description 1', created_at: '2024-01-01' },
      { id: 2, title: 'Item 2', description: 'Description 2', created_at: '2024-01-02' }
    ]
    
    api.get.mockResolvedValue({ data: mockItems })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(api.get).toHaveBeenCalledWith('/example/items')
    expect(wrapper.findAll('.card').length).toBe(2)
    expect(wrapper.text()).toContain('Item 1')
    expect(wrapper.text()).toContain('Item 2')
  })

  it('shows empty state when no items', async () => {
    api.get.mockResolvedValue({ data: [] })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(wrapper.text()).toContain('home.noItems')
    expect(wrapper.find('.btn-primary').exists()).toBe(true)
    expect(wrapper.find('.btn-primary').text()).toBe('home.createFirst')
  })

  it('creates example item when button clicked', async () => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockResolvedValue({ data: { id: 1 } })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    const createButton = wrapper.find('.btn-primary')
    await createButton.trigger('click')
    
    expect(api.post).toHaveBeenCalledWith('/example/items', {
      title: 'home.exampleTitle',
      description: 'home.exampleDescription'
    })
    
    // Should refetch items after creation
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    api.get.mockRejectedValue(new Error('API Error'))
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(consoleError).toHaveBeenCalledWith('Failed to fetch items:', expect.any(Error))
    expect(wrapper.find('.container').exists()).toBe(true) // Component still renders
    
    consoleError.mockRestore()
  })
})