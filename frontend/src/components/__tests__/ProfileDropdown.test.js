// src/components/__tests__/ProfileDropdown.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileDropdown from '../ProfileDropdown.vue'

describe('ProfileDropdown.vue', () => {
  const mockUser = {
    preferred_username: 'testuser',
    name: 'Test User',
    email: 'test@example.com'
  }

  it('renders user information when provided', () => {
    const wrapper = mount(ProfileDropdown, {
      props: {
        user: mockUser
      },
      global: {
        mocks: {
          $t: (key) => key
        },
        stubs: {
          'router-link': {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    expect(wrapper.find('.text-center').text()).toContain('testuser')
    expect(wrapper.find('.text-xs').text()).toContain('test@example.com')
  })

  it('emits logout event when logout is clicked', async () => {
    const wrapper = mount(ProfileDropdown, {
      props: {
        user: mockUser
      },
      global: {
        mocks: {
          $t: (key) => key
        },
        stubs: {
          'router-link': {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    // Find and click logout link - it's the last anchor in the dropdown
    const links = wrapper.findAll('a')
    const logoutLink = links[links.length - 1]
    await logoutLink.trigger('click')

    // Check that logout event was emitted
    expect(wrapper.emitted()).toHaveProperty('logout')
  })

  it('handles missing user properties gracefully', () => {
    const minimalUser = {
      preferred_username: 'user',
      // no email, no name
    }
    
    const wrapper = mount(ProfileDropdown, {
      props: {
        user: minimalUser
      },
      global: {
        mocks: {
          $t: (key) => key
        },
        stubs: {
          'router-link': {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    expect(wrapper.find('.dropdown').exists()).toBe(true)
    expect(wrapper.text()).toContain('user')
  })
})