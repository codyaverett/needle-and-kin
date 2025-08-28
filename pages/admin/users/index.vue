<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <button
            @click="showCreateModal = true"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by name, email, or username..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
          </div>
          
          <!-- Role Filter -->
          <select
            v-model="filters.role"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="author">Author</option>
            <option value="user">User</option>
          </select>
          
          <!-- Status Filter -->
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="user.avatar || '/avatars/default.jpg'"
                    :alt="user.name"
                    class="h-10 w-10 rounded-full"
                  >
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-model="user.role"
                  @change="updateUserRole(user)"
                  class="text-sm border-gray-300 rounded focus:ring-purple-500"
                  :class="getRoleColor(user.role)"
                >
                  <option value="user">User</option>
                  <option value="author">Author</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    getStatusColor(user.status)
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatRelativeTime(user.lastActive) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewUser(user)"
                    class="text-purple-600 hover:text-purple-900"
                    title="View"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="editUser(user)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="user.status === 'active'"
                    @click="suspendUser(user)"
                    class="text-amber-600 hover:text-amber-900"
                    title="Suspend"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                  <button
                    v-else-if="user.status === 'suspended'"
                    @click="activateUser(user)"
                    class="text-green-600 hover:text-green-900"
                    title="Activate"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteUser(user)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * perPage, totalUsers) }}</span>
              of
              <span class="font-medium">{{ totalUsers }}</span>
              users
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-hidden">
        <div @click="closeModals" class="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
        <div class="fixed inset-0 overflow-hidden">
          <div class="flex items-center justify-center min-h-full p-4">
            <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ showEditModal ? 'Edit User' : 'Create New User' }}
              </h3>
              <form @submit.prevent="saveUser" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    v-model="userForm.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    v-model="userForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    v-model="userForm.username"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                </div>
                <div v-if="showCreateModal">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    v-model="userForm.password"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    v-model="userForm.role"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="user">User</option>
                    <option value="author">Author</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                  <button
                    @click="closeModals"
                    type="button"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {{ showEditModal ? 'Save Changes' : 'Create User' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const router = useRouter()

const users = ref([])
const filters = ref({
  search: '',
  role: '',
  status: ''
})
const currentPage = ref(1)
const perPage = ref(10)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref(null)

const userForm = ref({
  name: '',
  email: '',
  username: '',
  password: '',
  role: 'user'
})

// Mock data
onMounted(() => {
  users.value = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      avatar: '/avatars/john.jpg',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15',
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      avatar: '/avatars/jane.jpg',
      role: 'moderator',
      status: 'active',
      createdAt: '2024-02-20',
      lastActive: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      username: 'bobjohnson',
      avatar: '/avatars/bob.jpg',
      role: 'author',
      status: 'active',
      createdAt: '2024-03-10',
      lastActive: new Date(Date.now() - 86400000)
    },
    {
      id: '4',
      name: 'Alice Williams',
      email: 'alice@example.com',
      username: 'alicew',
      avatar: '/avatars/alice.jpg',
      role: 'user',
      status: 'suspended',
      createdAt: '2024-04-05',
      lastActive: new Date(Date.now() - 172800000)
    },
    {
      id: '5',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      username: 'charlieb',
      avatar: '/avatars/charlie.jpg',
      role: 'user',
      status: 'pending',
      createdAt: '2024-05-12',
      lastActive: new Date(Date.now() - 259200000)
    }
  ]
})

const filteredUsers = computed(() => {
  let result = [...users.value]
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.username.toLowerCase().includes(search)
    )
  }
  
  if (filters.value.role) {
    result = result.filter(user => user.role === filters.value.role)
  }
  
  if (filters.value.status) {
    result = result.filter(user => user.status === filters.value.status)
  }
  
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  
  return result.slice(start, end)
})

const totalUsers = computed(() => users.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / perPage.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const getRoleColor = (role) => {
  const colors = {
    admin: 'text-red-600',
    moderator: 'text-blue-600',
    author: 'text-purple-600',
    user: 'text-gray-600'
  }
  return colors[role] || 'text-gray-600'
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatRelativeTime = (date) => {
  const diff = Date.now() - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const viewUser = (user) => {
  router.push(`/admin/users/${user.id}`)
}

const editUser = (user) => {
  selectedUser.value = user
  userForm.value = { ...user }
  showEditModal.value = true
}

const suspendUser = async (user) => {
  if (confirm(`Are you sure you want to suspend ${user.name}?`)) {
    user.status = 'suspended'
  }
}

const activateUser = async (user) => {
  user.status = 'active'
}

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
    users.value = users.value.filter(u => u.id !== user.id)
  }
}

const updateUserRole = async (user) => {
  // Update user role via API
  console.log(`Updated ${user.name} role to ${user.role}`)
}

const saveUser = async () => {
  if (showEditModal.value) {
    // Update existing user
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index > -1) {
      users.value[index] = { ...users.value[index], ...userForm.value }
    }
  } else {
    // Create new user
    const newUser = {
      ...userForm.value,
      id: Date.now().toString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActive: new Date()
    }
    users.value.unshift(newUser)
  }
  
  closeModals()
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedUser.value = null
  userForm.value = {
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user'
  }
}

useHead({
  title: 'User Management - Admin'
})
</script>