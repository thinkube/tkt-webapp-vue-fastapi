// src/views/__tests__/ApiTokens.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ApiTokens from '../ApiTokens.vue'
import api from '@/services/api'

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(true)
  }
})

describe('ApiTokens.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the tokens page structure', () => {
    const wrapper = mount(ApiTokens, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    expect(wrapper.find('h1').text()).toBe('apiTokens.title')
    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('#token-name').exists()).toBe(true)
    expect(wrapper.find('#token-expires').exists()).toBe(true)
  })

  it('fetches tokens on mount', async () => {
    const mockTokens = [
      {
        id: '123',
        name: 'CI/CD Token',
        created_at: '2024-01-01T10:00:00',
        expires_at: '2024-12-31T23:59:59',
        last_used: null,
        is_active: true
      },
      {
        id: '456',
        name: 'Dev Token',
        created_at: '2024-01-02T10:00:00',
        expires_at: null,
        last_used: '2024-01-15T14:30:00',
        is_active: true
      }
    ]
    
    api.get.mockResolvedValue({ data: { tokens: mockTokens } })
    
    const wrapper = mount(ApiTokens, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(api.get).toHaveBeenCalledWith('/api/tokens')
    expect(wrapper.findAll('tbody tr').length).toBe(2)
    expect(wrapper.text()).toContain('CI/CD Token')
    expect(wrapper.text()).toContain('Dev Token')
  })

  it('shows empty state when no tokens', async () => {
    api.get.mockResolvedValue({ data: { tokens: [] } })
    
    const wrapper = mount(ApiTokens, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(wrapper.text()).toContain('apiTokens.tokenList.noTokens')
  })

  it('creates a new token', async () => {
    api.get.mockResolvedValue({ data: { tokens: [] } })
    api.post.mockResolvedValue({
      data: {
        id: '789',
        name: 'New Token',
        token: 'tk_abcd1234567890',
        created_at: '2024-01-20T10:00:00',
        expires_at: null,
        is_active: true
      }
    })
    
    const wrapper = mount(ApiTokens, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    // Fill in form
    await wrapper.find('#token-name').setValue('New Token')
    await wrapper.find('#token-expires').setValue('30')
    
    // Submit
    const createButton = wrapper.find('.btn-primary')
    expect(createButton.attributes('disabled')).toBeUndefined()
    
    await createButton.trigger('click')
    await flushPromises()
    
    expect(api.post).toHaveBeenCalledWith('/api/tokens', {
      name: 'New Token',
      expires_in_days: 30
    })
    
    // Should show created token
    expect(wrapper.find('.alert-success').exists()).toBe(true)
    expect(wrapper.text()).toContain('tk_abcd1234567890')
    
    // Should refetch tokens
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('validates token name is required', async () => {
    api.get.mockResolvedValue({ data: { tokens: [] } })
    
    const wrapper = mount(ApiTokens, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    // Try to create without name
    const createButton = wrapper.find('.btn-primary')
    expect(createButton.attributes('disabled')).toBeDefined()
  })

  it('copies token to clipboard', async () => {
    api.get.mockResolvedValue({ data: { tokens: [] } })
    api.post.mockResolvedValue({
      data: {
        token: 'tk_secret123'
      }
    })
    
    const wrapper = mount(ApiTokens, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await wrapper.find('#token-name').setValue('Test')
    await wrapper.find('.btn-primary').trigger('click')
    await flushPromises()
    
    // Click copy button
    const copyButton = wrapper.find('.alert-success .btn-ghost')
    await copyButton.trigger('click')
    await flushPromises()
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('tk_secret123')
    expect(wrapper.text()).toContain('apiTokens.tokenCreated.copied')
  })

  it('revokes a token', async () => {
    const mockTokens = [{
      id: '123',
      name: 'Token to revoke',
      created_at: '2024-01-01T10:00:00',
      expires_at: null,
      last_used: null,
      is_active: true
    }]
    
    api.get.mockResolvedValue({ data: { tokens: mockTokens } })
    api.delete.mockResolvedValue({})
    
    // Mock window.confirm
    window.confirm = vi.fn().mockReturnValue(true)
    
    const wrapper = mount(ApiTokens, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    // Click revoke button
    const revokeButton = wrapper.find('.btn-error')
    await revokeButton.trigger('click')
    
    expect(window.confirm).toHaveBeenCalledWith('apiTokens.tokenList.confirmRevoke')
    expect(api.delete).toHaveBeenCalledWith('/api/tokens/123')
    
    // Should refetch tokens
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    api.get.mockRejectedValue(new Error('API Error'))
    
    const wrapper = mount(ApiTokens, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(consoleError).toHaveBeenCalledWith('Failed to fetch tokens:', expect.any(Error))
    expect(wrapper.find('.container').exists()).toBe(true) // Component still renders
    
    consoleError.mockRestore()
  })
})