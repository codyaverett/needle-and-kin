<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Create New Project</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mt-6 flex items-center">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center flex-1"
        >
          <div class="flex items-center">
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                currentStepIndex > index
                  ? 'bg-teal-600 text-white'
                  : currentStepIndex === index
                  ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-600 ring-offset-2'
                  : 'bg-gray-200 text-gray-400'
              ]"
            >
              <svg
                v-if="currentStepIndex > index"
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              :class="[
                'ml-3 text-sm font-medium hidden sm:block',
                currentStepIndex >= index ? 'text-gray-900' : 'text-gray-400'
              ]"
            >
              {{ step.title }}
            </span>
          </div>
          <div
            v-if="index < steps.length - 1"
            :class="[
              'flex-1 h-0.5 mx-4 transition-all duration-300',
              currentStepIndex > index ? 'bg-teal-600' : 'bg-gray-200'
            ]"
          />
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div v-show="currentStepIndex === 0" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Project Title *
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="Enter your project title"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            required
            rows="4"
            placeholder="Describe your project..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              v-model="formData.category"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="Knitting">Knitting</option>
              <option value="Sewing">Sewing</option>
              <option value="Crochet">Crochet</option>
              <option value="Embroidery">Embroidery</option>
              <option value="Quilting">Quilting</option>
              <option value="Weaving">Weaving</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level *
            </label>
            <select
              id="difficulty"
              v-model="formData.difficulty"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label for="estimatedTime" class="block text-sm font-medium text-gray-700 mb-2">
            Estimated Time
          </label>
          <input
            id="estimatedTime"
            v-model="formData.estimatedTime"
            type="text"
            placeholder="e.g., 2 hours, 3 days, 1 week"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            id="tags"
            v-model="tagsInput"
            type="text"
            placeholder="Enter tags separated by commas"
            @blur="parseTags"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
          <div v-if="formData.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in formData.tags"
              :key="index"
              class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {{ tag }}
              <button
                @click="removeTag(index)"
                type="button"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        </div>
      </div>

      <div v-show="currentStepIndex === 1" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Project Images
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500">
                  <span>Upload images</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple accept="image/*">
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">Materials Needed</h3>
          <div class="space-y-3">
            <div v-for="(material, index) in formData.materials" :key="index" class="flex gap-2">
              <input
                v-model="material.name"
                type="text"
                placeholder="Material name"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
              <input
                v-model="material.quantity"
                type="text"
                placeholder="Quantity"
                class="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
              <input
                v-model="material.unit"
                type="text"
                placeholder="Unit"
                class="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
              <button
                @click="removeMaterial(index)"
                type="button"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button
              @click="addMaterial"
              type="button"
              class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              + Add Material
            </button>
          </div>
        </div>
      </div>

      <div v-show="currentStepIndex === 2" class="space-y-6">
        <h3 class="text-lg font-medium text-gray-900">Project Steps</h3>
        
        <div class="space-y-4">
          <div
            v-for="(step, index) in formData.steps"
            :key="step.id"
            class="bg-gray-50 rounded-lg p-4 space-y-3"
          >
            <div class="flex items-start justify-between">
              <span class="text-sm font-medium text-gray-500">Step {{ index + 1 }}</span>
              <button
                v-if="formData.steps.length > 1"
                @click="removeStep(index)"
                type="button"
                class="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <input
              v-model="step.title"
              type="text"
              placeholder="Step title"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >

            <textarea
              v-model="step.description"
              rows="3"
              placeholder="Describe this step..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />

            <div class="flex gap-2">
              <input
                v-model="step.duration"
                type="text"
                placeholder="Duration (optional)"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
              <button
                type="button"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Add Images
              </button>
            </div>
          </div>

          <button
            @click="addStep"
            type="button"
            class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            + Add Step
          </button>
        </div>
      </div>

      <div class="flex justify-between pt-6 border-t">
        <button
          v-if="currentStepIndex > 0"
          @click="previousStep"
          type="button"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <div v-else />

        <button
          v-if="currentStepIndex < steps.length - 1"
          @click="nextStep"
          type="button"
          class="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Next
        </button>
        <button
          v-else
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {{ isSubmitting ? 'Creating...' : 'Create Project' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Project, Material, ProjectStep } from '~/types/projects';

const emit = defineEmits<{
  close: [];
  submit: [project: Partial<Project>];
}>();

const steps = [
  { id: 'basics', title: 'Basic Info' },
  { id: 'materials', title: 'Materials & Images' },
  { id: 'steps', title: 'Steps' }
];

const currentStepIndex = ref(0);
const isSubmitting = ref(false);
const tagsInput = ref('');

const formData = reactive<Partial<Project>>({
  title: '',
  description: '',
  category: '',
  difficulty: 'beginner',
  estimatedTime: '',
  tags: [],
  images: [],
  materials: [{ id: '1', name: '', quantity: '', unit: '' }],
  steps: [{ id: '1', number: 1, title: '', description: '', duration: '' }],
  status: 'planning',
  progress: 0
});

const nextStep = () => {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

const addMaterial = () => {
  formData.materials?.push({
    id: Date.now().toString(),
    name: '',
    quantity: '',
    unit: ''
  });
};

const removeMaterial = (index: number) => {
  formData.materials?.splice(index, 1);
};

const addStep = () => {
  const newStep: ProjectStep = {
    id: Date.now().toString(),
    number: (formData.steps?.length || 0) + 1,
    title: '',
    description: '',
    duration: ''
  };
  formData.steps?.push(newStep);
};

const removeStep = (index: number) => {
  formData.steps?.splice(index, 1);
  formData.steps?.forEach((step, i) => {
    step.number = i + 1;
  });
};

const parseTags = () => {
  if (tagsInput.value) {
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    formData.tags = [...new Set([...(formData.tags || []), ...tags])];
    tagsInput.value = '';
  }
};

const removeTag = (index: number) => {
  formData.tags?.splice(index, 1);
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  const cleanedMaterials = formData.materials?.filter(m => m.name) || [];
  const cleanedSteps = formData.steps?.filter(s => s.title && s.description) || [];
  
  const projectData = {
    ...formData,
    materials: cleanedMaterials,
    steps: cleanedSteps
  };
  
  emit('submit', projectData);
  
  setTimeout(() => {
    isSubmitting.value = false;
  }, 1000);
};
</script>