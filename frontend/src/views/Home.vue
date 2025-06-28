<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold mb-2">{{ $t('home.title') }}</h1>
          <p class="text-lg text-gray-600">{{ $t('home.subtitle') }}</p>
        </div>
        <button @click="showCreateModal = true" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('home.createTask') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Task cards -->
      <div v-for="task in items" :key="task.id" class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ task.title }}</h2>
          <p>{{ task.description }}</p>
          
          <!-- Status and Priority badges -->
          <div class="flex gap-2 mt-2">
            <span :class="getStatusClass(task.status)" class="badge">
              {{ task.status }}
            </span>
            <span :class="getPriorityClass(task.priority)" class="badge">
              {{ task.priority }}
            </span>
          </div>
          
          <!-- Due date if present -->
          <div v-if="task.due_date" class="text-sm text-gray-500 mt-2">
            Due: {{ formatDate(task.due_date) }}
          </div>
          
          <div class="text-sm text-gray-500">
            Created: {{ formatDate(task.created_at) }}
          </div>
          
          <!-- Card actions -->
          <div class="card-actions justify-end mt-4">
            <button @click="editTask(task)" class="btn btn-sm btn-ghost">
              {{ $t('common.edit') }}
            </button>
            <button @click="deleteTask(task.id)" class="btn btn-sm btn-error">
              {{ $t('common.delete') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="items.length === 0" class="col-span-full text-center py-12">
        <p class="text-gray-500">{{ $t('home.noTasks') }}</p>
      </div>
    </div>

    <!-- Create/Edit Task Modal -->
    <dialog :open="showCreateModal" class="modal" @close="closeModal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          {{ editingTask ? $t('home.editTask') : $t('home.createTask') }}
        </h3>
        
        <form @submit.prevent="saveTask">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">{{ $t('task.title') }}</span>
            </label>
            <input 
              v-model="taskForm.title" 
              type="text" 
              class="input input-bordered" 
              required 
              :placeholder="$t('task.titlePlaceholder')"
            />
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">{{ $t('task.description') }}</span>
            </label>
            <textarea 
              v-model="taskForm.description" 
              class="textarea textarea-bordered" 
              rows="3"
              :placeholder="$t('task.descriptionPlaceholder')"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('task.status') }}</span>
              </label>
              <select v-model="taskForm.status" class="select select-bordered">
                <option value="todo">{{ $t('task.statusTodo') }}</option>
                <option value="in_progress">{{ $t('task.statusInProgress') }}</option>
                <option value="done">{{ $t('task.statusDone') }}</option>
              </select>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('task.priority') }}</span>
              </label>
              <select v-model="taskForm.priority" class="select select-bordered">
                <option value="low">{{ $t('task.priorityLow') }}</option>
                <option value="medium">{{ $t('task.priorityMedium') }}</option>
                <option value="high">{{ $t('task.priorityHigh') }}</option>
              </select>
            </div>
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">{{ $t('task.dueDate') }}</span>
            </label>
            <input 
              v-model="taskForm.due_date" 
              type="date" 
              class="input input-bordered"
            />
          </div>

          <div class="modal-action">
            <button type="button" @click="closeModal" class="btn">
              {{ $t('common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingTask ? $t('common.update') : $t('common.create') }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const { t } = useI18n()
const items = ref([])
const showCreateModal = ref(false)
const editingTask = ref(null)

const taskForm = reactive({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: ''
})

const fetchItems = async () => {
  try {
    const response = await api.get('/tasks')
    items.value = response.data
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
}

const resetForm = () => {
  taskForm.title = ''
  taskForm.description = ''
  taskForm.status = 'todo'
  taskForm.priority = 'medium'
  taskForm.due_date = ''
  editingTask.value = null
}

const closeModal = () => {
  showCreateModal.value = false
  resetForm()
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.title = task.title
  taskForm.description = task.description || ''
  taskForm.status = task.status
  taskForm.priority = task.priority
  taskForm.due_date = task.due_date || ''
  showCreateModal.value = true
}

const saveTask = async () => {
  try {
    // Validate required fields
    if (!taskForm.title.trim()) {
      alert(t('task.titleRequired') || 'Title is required')
      return
    }
    
    const taskData = {
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      priority: taskForm.priority
    }
    
    if (taskForm.due_date) {
      // Convert date to ISO format with time
      taskData.due_date = new Date(taskForm.due_date).toISOString()
    }

    if (editingTask.value) {
      await api.put(`/tasks/${editingTask.value.id}`, taskData)
    } else {
      await api.post('/tasks', taskData)
    }
    
    await fetchItems()
    closeModal()
  } catch (error) {
    console.error('Failed to save task:', error)
    console.error('Error response:', error.response?.data)
    
    // Handle validation errors
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.detail;
      if (Array.isArray(validationErrors)) {
        const errorMessages = validationErrors.map(err => 
          `${err.loc[err.loc.length - 1]}: ${err.msg}`
        ).join('\n');
        alert('Validation errors:\n' + errorMessages);
      } else {
        alert('Validation error: ' + JSON.stringify(validationErrors));
      }
    } else {
      alert('Failed to save task: ' + (error.response?.data?.detail || error.message))
    }
  }
}

const deleteTask = async (taskId) => {
  if (confirm(t('home.confirmDelete'))) {
    try {
      await api.delete(`/tasks/${taskId}`)
      await fetchItems()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    'todo': 'badge-secondary',
    'in_progress': 'badge-primary', 
    'done': 'badge-success'
  }
  return classes[status] || 'badge-ghost'
}

const getPriorityClass = (priority) => {
  const classes = {
    'low': 'badge-info',
    'medium': 'badge-warning',
    'high': 'badge-error'
  }
  return classes[priority] || 'badge-ghost'
}

onMounted(() => {
  fetchItems()
})
</script>