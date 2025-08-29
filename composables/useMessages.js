export const useMessages = () => {
  // Create a shared state for unread messages count
  const unreadMessagesCount = useState('unreadMessagesCount', () => 0)
  
  // Fetch the unread count from the API
  const fetchUnreadCount = async () => {
    try {
      const response = await $fetch('/api/admin/contact-submissions/unread-count')
      unreadMessagesCount.value = response.count
      return response.count
    } catch (error) {
      console.error('Failed to fetch unread messages count:', error)
      return 0
    }
  }
  
  // Update the count (can be called when messages are read/responded to)
  const updateUnreadCount = (count) => {
    unreadMessagesCount.value = count
  }
  
  // Decrement the count (when a single message is read)
  const decrementUnreadCount = () => {
    if (unreadMessagesCount.value > 0) {
      unreadMessagesCount.value--
    }
  }
  
  // Increment the count (if needed for real-time updates)
  const incrementUnreadCount = () => {
    unreadMessagesCount.value++
  }
  
  return {
    unreadMessagesCount: readonly(unreadMessagesCount),
    fetchUnreadCount,
    updateUnreadCount,
    decrementUnreadCount,
    incrementUnreadCount
  }
}