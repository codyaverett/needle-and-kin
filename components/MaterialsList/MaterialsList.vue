<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">Materials Needed</h3>
          <p v-if="projectTitle" class="text-purple-100 text-sm">for {{ projectTitle }}</p>
        </div>
        <div v-if="showProgress" class="text-right">
          <div class="text-sm opacity-90">Progress</div>
          <div class="text-lg font-bold">{{ checkedCount }}/{{ materials.length }}</div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div v-if="showProgress" class="mt-3">
        <div class="bg-white/20 rounded-full h-2">
          <div 
            :style="{ width: progressPercentage + '%' }"
            class="bg-white rounded-full h-2 transition-all duration-300"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Materials List -->
    <div class="divide-y divide-gray-200">
      <div
        v-for="(material, index) in materials"
        :key="material.id || index"
        :class="[
          'p-4 transition-colors hover:bg-gray-50',
          material.isChecked && showCheckboxes ? 'bg-green-50' : ''
        ]"
      >
        <div class="flex items-start gap-3">
          <!-- Checkbox -->
          <div v-if="showCheckboxes" class="flex-shrink-0 pt-1">
            <input
              :id="`material-${material.id || index}`"
              v-model="material.isChecked"
              type="checkbox"
              @change="$emit('toggleMaterial', material.id || index)"
              class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
          </div>
          
          <!-- Material Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <label 
                  :for="`material-${material.id || index}`"
                  :class="[
                    'block font-medium cursor-pointer',
                    material.isChecked && showCheckboxes 
                      ? 'text-green-800 line-through' 
                      : 'text-gray-900'
                  ]"
                >
                  {{ material.name }}
                </label>
                
                <!-- Quantity and Details -->
                <div class="mt-1 text-sm text-gray-600">
                  <span v-if="material.quantity">{{ material.quantity }}</span>
                  <span v-if="material.quantity && material.details"> • </span>
                  <span v-if="material.details">{{ material.details }}</span>
                </div>
                
                <!-- Alternative Options -->
                <div v-if="material.alternatives?.length" class="mt-2">
                  <button
                    @click="material.showAlternatives = !material.showAlternatives"
                    class="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  >
                    <svg 
                      :class="[
                        'w-3 h-3 transition-transform',
                        material.showAlternatives ? 'rotate-90' : ''
                      ]" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                    {{ material.alternatives.length }} alternative{{ material.alternatives.length > 1 ? 's' : '' }}
                  </button>
                  
                  <div v-if="material.showAlternatives" class="mt-2 pl-4 border-l-2 border-gray-200">
                    <div v-for="alt in material.alternatives" :key="alt" class="text-xs text-gray-600 mb-1">
                      • {{ alt }}
                    </div>
                  </div>
                </div>
                
                <!-- Notes -->
                <div v-if="material.notes" class="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                  <div class="flex items-start gap-1">
                    <svg class="w-3 h-3 mt-0.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ material.notes }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Price and Actions -->
              <div class="flex-shrink-0 text-right ml-4">
                <div v-if="material.estimatedPrice" class="text-sm font-medium text-gray-900">
                  {{ material.estimatedPrice }}
                </div>
                
                <!-- Purchase Links -->
                <div v-if="material.purchaseLinks?.length" class="mt-2 space-y-1">
                  <button
                    v-for="link in material.purchaseLinks"
                    :key="link.store"
                    @click="$emit('visitStore', link.url, link.store)"
                    class="block text-xs text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    {{ link.store }}
                  </button>
                </div>
                
                <!-- Add to Cart Button -->
                <button
                  v-if="showAddToCart && material.purchaseLinks?.length"
                  @click="$emit('addToCart', material)"
                  class="mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer Actions -->
    <div v-if="showActions" class="p-4 bg-gray-50 border-t">
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          v-if="showPrintList"
          @click="$emit('printList')"
          class="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd"/>
          </svg>
          Print List
        </button>
        
        <button
          v-if="showEmailList"
          @click="$emit('emailList')"
          class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          Email List
        </button>
        
        <button
          v-if="totalCost"
          @click="$emit('viewCostBreakdown')"
          class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
          </svg>
          Total: {{ totalCost }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  materials: {
    type: Array,
    required: true,
    default: () => []
  },
  projectTitle: {
    type: String,
    default: ''
  },
  showCheckboxes: {
    type: Boolean,
    default: true
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  showAddToCart: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showPrintList: {
    type: Boolean,
    default: true
  },
  showEmailList: {
    type: Boolean,
    default: true
  },
  totalCost: {
    type: String,
    default: ''
  }
})

defineEmits([
  'toggleMaterial',
  'visitStore', 
  'addToCart',
  'printList',
  'emailList',
  'viewCostBreakdown'
])

const checkedCount = computed(() => {
  return props.materials.filter(material => material.isChecked).length
})

const progressPercentage = computed(() => {
  if (props.materials.length === 0) return 0
  return Math.round((checkedCount.value / props.materials.length) * 100)
})
</script>