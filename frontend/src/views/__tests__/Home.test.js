// src/views/__tests__/Home.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Home from '../Home.vue'
import api from '@/services/api'

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('Home.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the home page structure', async () => {
    api.get.mockResolvedValue({ data: [] })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('home.title')
    
    // Should have create button in header
    expect(wrapper.find('button.btn-primary').exists()).toBe(true)
    expect(wrapper.find('button.btn-primary').text()).toContain('home.createTask')
  })

  it('fetches tasks on mount', async () => {
    const mockTasks = [
      { 
        id: 1, 
        title: 'Complete project', 
        description: 'Finish the project documentation', 
        status: 'in_progress',
        priority: 'high',
        due_date: '2024-12-31T17:00:00',
        created_at: '2024-01-01' 
      },
      { 
        id: 2, 
        title: 'Review code', 
        description: 'Review pull requests', 
        status: 'todo',
        priority: 'medium',
        due_date: null,
        created_at: '2024-01-02' 
      }
    ]
    
    api.get.mockResolvedValue({ data: mockTasks })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(api.get).toHaveBeenCalledWith('/tasks')
    expect(wrapper.findAll('.card').length).toBe(2)
    expect(wrapper.text()).toContain('Complete project')
    expect(wrapper.text()).toContain('Review code')
    
    // Check for status badges
    expect(wrapper.find('.badge').exists()).toBe(true)
    expect(wrapper.text()).toContain('in_progress')
    expect(wrapper.text()).toContain('high')
    
    // Should have edit and delete buttons for each task
    const cards = wrapper.findAll('.card')
    expect(cards[0].find('button').text()).toContain('common.edit')
    expect(cards[0].findAll('button')[1].text()).toContain('common.delete')
  })

  it('shows empty state when no tasks', async () => {
    api.get.mockResolvedValue({ data: [] })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    expect(wrapper.text()).toContain('home.noTasks')
    // Create button should still be in header, not in empty state
    expect(wrapper.find('.btn-primary').exists()).toBe(true)
    expect(wrapper.find('.btn-primary').text()).toContain('home.createTask')
  })

  it('opens modal when create button clicked', async () => {
    api.get.mockResolvedValue({ data: [] })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    // Click create button
    const createButton = wrapper.find('.btn-primary')
    await createButton.trigger('click')
    
    // Modal should be visible
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showCreateModal).toBe(true)
    expect(wrapper.find('dialog h3').text()).toBe('home.createTask')
    
    // Form fields should exist
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.findAll('select').length).toBe(2) // status and priority
  })
  
  it('creates new task when form submitted', async () => {
    api.get.mockResolvedValue({ data: [] })
    api.post.mockResolvedValue({ 
      data: { 
        id: 1,
        title: 'New Task',
        description: 'A new task',
        status: 'todo',
        priority: 'medium'
      } 
    })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    // Open modal
    await wrapper.find('.btn-primary').trigger('click')
    
    // Fill form
    await wrapper.find('input[type="text"]').setValue('New Task')
    await wrapper.find('textarea').setValue('A new task')
    
    // Submit form
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(api.post).toHaveBeenCalledWith('/tasks', {
      title: 'New Task',
      description: 'A new task',
      status: 'todo',
      priority: 'medium'
    })
    
    // Should refetch tasks after creation
    await flushPromises()
    expect(api.get).toHaveBeenCalledTimes(2)
  })

  it('edits task when edit button clicked', async () => {
    const mockTask = { 
      id: 1, 
      title: 'Original Task', 
      description: 'Original description', 
      status: 'todo',
      priority: 'low',
      created_at: '2024-01-01' 
    }
    
    api.get.mockResolvedValue({ data: [mockTask] })
    api.put.mockResolvedValue({ data: { ...mockTask, title: 'Updated Task' } })
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    // Click edit button
    const editButton = wrapper.find('.card button')
    await editButton.trigger('click')
    
    // Modal should open with task data
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showCreateModal).toBe(true)
    expect(wrapper.find('dialog h3').text()).toBe('home.editTask')
    expect(wrapper.find('input[type="text"]').element.value).toBe('Original Task')
    
    // Update title
    await wrapper.find('input[type="text"]').setValue('Updated Task')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(api.put).toHaveBeenCalledWith('/tasks/1', {
      title: 'Updated Task',
      description: 'Original description',
      status: 'todo',
      priority: 'low'
    })
  })
  
  it('deletes task when delete button clicked', async () => {
    window.confirm = vi.fn(() => true)
    
    const mockTask = { 
      id: 1, 
      title: 'Task to delete', 
      status: 'todo',
      priority: 'medium',
      created_at: '2024-01-01' 
    }
    
    api.get.mockResolvedValue({ data: [mockTask] })
    api.delete.mockResolvedValue({})
    
    const wrapper = mount(Home, {
      global: {
        mocks: {
          $t: (key) => key
        }
      }
    })
    
    await flushPromises()
    
    // Click delete button
    const deleteButton = wrapper.findAll('.card button')[1]
    await deleteButton.trigger('click')
    
    expect(window.confirm).toHaveBeenCalledWith('home.confirmDelete')
    expect(api.delete).toHaveBeenCalledWith('/tasks/1')
    
    // Should refetch tasks after deletion
    await flushPromises()
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