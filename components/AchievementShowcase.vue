<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Achievement Showcase</h3>
      <button
        v-if="editable"
        @click="editMode = !editMode"
        class="text-sm text-teal-600 hover:text-teal-700 transition-colors"
      >
        {{ editMode ? 'Done' : 'Edit' }}
      </button>
    </div>

    <div v-if="showcasedAchievements.length === 0" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-500 text-sm">No achievements showcased yet</p>
      <p v-if="editable" class="text-gray-400 text-xs mt-1">
        Click Edit to select achievements to showcase
      </p>
    </div>

    <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      <div
        v-for="achievement in displayAchievements"
        :key="achievement.id"
        class="relative"
      >
        <div
          v-if="editMode"
          class="absolute -top-2 -right-2 z-10"
        >
          <button
            @click="removeFromShowcase(achievement.id)"
            class="w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <AchievementBadge
          :achievement="achievement"
          size="md"
          :show-progress="false"
        />
      </div>

      <button
        v-if="editMode && showcasedAchievements.length < maxShowcase"
        @click="openAchievementSelector"
        class="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 transition-colors group"
      >
        <svg class="w-8 h-8 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <div class="mt-4 pt-4 border-t flex items-center justify-between">
      <div class="text-sm text-gray-600">
        <span class="font-semibold">{{ totalPoints }}</span> total points
      </div>
      <div class="flex items-center gap-4 text-xs text-gray-500">
        <span>
          <span class="font-semibold text-gray-700">{{ unlockedCount }}</span> unlocked
        </span>
        <span>
          <span class="font-semibold text-gray-700">{{ totalCount }}</span> total
        </span>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showSelector"
          @click="showSelector = false"
          class="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div
            @click.stop
            class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold">Select Achievement to Showcase</h3>
            </div>

            <div class="flex-grow overflow-y-auto p-4">
              <div class="grid grid-cols-4 sm:grid-cols-6 gap-4">
                <button
                  v-for="achievement in availableAchievements"
                  :key="achievement.id"
                  @click="addToShowcase(achievement.id)"
                  :disabled="!achievement.unlockedAt"
                  class="relative group disabled:cursor-not-allowed"
                >
                  <AchievementBadge
                    :achievement="achievement"
                    size="md"
                    :show-progress="false"
                    :hoverable="achievement.unlockedAt"
                  />
                  <div
                    v-if="achievement.unlockedAt"
                    class="absolute inset-0 bg-teal-600 bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200"
                  />
                </button>
              </div>
            </div>

            <div class="p-4 border-t flex justify-end">
              <button
                @click="showSelector = false"
                class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Achievement } from '~/types/projects';

const props = withDefaults(defineProps<{
  achievements: Achievement[];
  showcased: string[];
  maxShowcase?: number;
  editable?: boolean;
}>(), {
  maxShowcase: 5,
  editable: false
});

const emit = defineEmits<{
  update: [showcased: string[]];
}>();

const editMode = ref(false);
const showSelector = ref(false);

const showcasedAchievements = computed(() => {
  return props.achievements.filter(a => props.showcased.includes(a.id));
});

const availableAchievements = computed(() => {
  return props.achievements.filter(a => !props.showcased.includes(a.id));
});

const displayAchievements = computed(() => {
  return showcasedAchievements.value.slice(0, props.maxShowcase);
});

const totalPoints = computed(() => {
  return props.achievements
    .filter(a => a.unlockedAt)
    .reduce((sum, a) => sum + a.points, 0);
});

const unlockedCount = computed(() => {
  return props.achievements.filter(a => a.unlockedAt).length;
});

const totalCount = computed(() => {
  return props.achievements.length;
});

const openAchievementSelector = () => {
  showSelector.value = true;
};

const addToShowcase = (achievementId: string) => {
  const newShowcased = [...props.showcased, achievementId];
  emit('update', newShowcased);
  showSelector.value = false;
};

const removeFromShowcase = (achievementId: string) => {
  const newShowcased = props.showcased.filter(id => id !== achievementId);
  emit('update', newShowcased);
};
</script>