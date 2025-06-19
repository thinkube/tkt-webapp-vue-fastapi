// src/views/__tests__/Dashboard.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Dashboard from '../Dashboard.vue'
import { useDashboardStore } from '@/stores/dashboards'

// Mock the dashboard store
vi.mock('@/stores/dashboards')


// Mock child components
vi.mock('@/components/DashboardCard.vue', () => ({
  default: {
    name: 'DashboardCard',
    template: '<div class="card">{{ dashboard.name }}</div>',
    props: ['dashboard']
  }
}))

describe('Dashboard.vue', () => {
  let wrapper
  let mockDashboardStore

  const mockDashboards = [
    {
      id: 'harbor',
      name: 'Harbor Registry',
      description: 'Container registry',
      url: 'https://registry.example.com',
      icon: 'archive',
      color: 'blue',
      category: 'infrastructure'
    },
    {
      id: 'gitea',
      name: 'Gitea',
      description: 'Git service',
      url: 'https://git.example.com',
      icon: 'git',
      color: 'green',
      category: 'development'
    }
  ]

  const mockCategories = ['infrastructure', 'development', 'monitoring']

  beforeEach(() => {
    // Create a fresh pinia instance
    setActivePinia(createPinia())
    
    // Setup mock dashboard store
    mockDashboardStore = {
      dashboards: mockDashboards,
      categories: mockCategories,
      loading: false,
      error: null,
      selectedCategory: null,
      filteredDashboards: mockDashboards,
      fetchDashboards: vi.fn().mockResolvedValue(),
      setSelectedCategory: vi.fn(),
      clearSelectedCategory: vi.fn()
    }
    
    useDashboardStore.mockReturnValue(mockDashboardStore)
  })

  it('renders the dashboard with correct title', async () => {
    wrapper = mount(Dashboard)
    await flushPromises()
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
  })

  it('shows loading state when loading is true', async () => {
    mockDashboardStore.loading = true
    wrapper = mount(Dashboard)
    await flushPromises()
    
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('fetches dashboards on mount', async () => {
    wrapper = mount(Dashboard)
    await flushPromises()
    
    expect(mockDashboardStore.fetchDashboards).toHaveBeenCalled()
  })

  it('displays dashboard cards after loading', async () => {
    wrapper = mount(Dashboard)
    await flushPromises()
    
    const cards = wrapper.findAll('.card')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('Harbor Registry')
    expect(cards[1].text()).toContain('Gitea')
  })

  it('shows error message when there is an error', async () => {
    mockDashboardStore.error = 'Failed to load dashboards'
    wrapper = mount(Dashboard)
    await flushPromises()
    
    expect(wrapper.find('.alert-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load dashboards')
  })

  it('filters dashboards by category', async () => {
    const setSelectedCategory = vi.fn()
    mockDashboardStore.setSelectedCategory = setSelectedCategory
    
    wrapper = mount(Dashboard)
    await flushPromises()
    
    // Find and click infrastructure category button
    const categoryButtons = wrapper.findAll('button.btn-sm')
    // First button is "All", so infrastructure is at index 1
    await categoryButtons[1].trigger('click')
    
    expect(setSelectedCategory).toHaveBeenCalledWith('infrastructure')
  })

  it('clears category filter when All is clicked', async () => {
    const clearSelectedCategory = vi.fn()
    mockDashboardStore.clearSelectedCategory = clearSelectedCategory
    mockDashboardStore.selectedCategory = 'infrastructure'
    
    wrapper = mount(Dashboard)
    await flushPromises()
    
    // Find and click All button
    const allButton = wrapper.find('button.btn-sm')
    await allButton.trigger('click')
    
    expect(clearSelectedCategory).toHaveBeenCalled()
  })

  it('shows correct active state for selected category', async () => {
    mockDashboardStore.selectedCategory = 'infrastructure'
    
    wrapper = mount(Dashboard)
    await flushPromises()
    
    const categoryButtons = wrapper.findAll('button.btn-sm')
    expect(categoryButtons[0].classes()).not.toContain('btn-primary') // All button
    expect(categoryButtons[1].classes()).toContain('btn-primary') // Infrastructure button
  })

  it('shows message when no dashboards in selected category', async () => {
    mockDashboardStore.filteredDashboards = []
    
    wrapper = mount(Dashboard)
    await flushPromises()
    
    expect(wrapper.find('.alert-info').exists()).toBe(true)
    // Alert info should be shown when no dashboards in category
  })
})

// 🤖 Generated with Claude