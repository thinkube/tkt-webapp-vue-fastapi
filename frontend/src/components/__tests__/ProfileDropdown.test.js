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
      }
    })

    expect(wrapper.text()).toContain('Test User')
    expect(wrapper.text()).toContain('test@example.com')
  })

  it('emits logout event when logout is clicked', async () => {
    const wrapper = mount(ProfileDropdown, {
      props: {
        user: mockUser
      }
    })

    // Find and click logout button
    const logoutButton = wrapper.find('button')
    await logoutButton.trigger('click')

    // Check that logout event was emitted
    expect(wrapper.emitted()).toHaveProperty('logout')
  })

  it('renders correctly without user', () => {
    const wrapper = mount(ProfileDropdown, {
      props: {
        user: null
      }
    })

    expect(wrapper.find('.dropdown').exists()).toBe(true)
  })
})