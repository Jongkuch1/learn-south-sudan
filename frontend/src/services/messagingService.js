// Messaging service - manages all user communication
const MESSAGES_KEY = 'ssplp_messages'
const GROUPS_KEY = 'ssplp_groups'
const MESSAGE_EVENT_KEY = 'ssplp_message_event'

// Cross-tab messaging using localStorage events
const notifyOtherTabs = (eventData) => {
  localStorage.setItem(MESSAGE_EVENT_KEY, JSON.stringify({
    ...eventData,
    timestamp: Date.now()
  }))
  localStorage.removeItem(MESSAGE_EVENT_KEY)
}

export const messagingService = {
  // Get all messages
  getAllMessages: () => {
    const stored = localStorage.getItem(MESSAGES_KEY)
    return stored ? JSON.parse(stored) : []
  },

  // Get conversation between two users
  getConversation: (userId1, userId2) => {
    const messages = messagingService.getAllMessages()
    return messages.filter(m => 
      (m.senderId === userId1 && m.receiverId === userId2) ||
      (m.senderId === userId2 && m.receiverId === userId1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  },

  // Send message (direct or group)
  sendMessage: (senderId, receiverId, content, senderName, receiverName, groupId = null) => {
    const messages = messagingService.getAllMessages()
    const newMessage = {
      id: Date.now() + Math.random(),
      senderId,
      receiverId,
      senderName,
      receiverName,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      groupId
    }
    messages.push(newMessage)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
    
    // Notify other tabs about new message
    notifyOtherTabs({
      type: 'new_message',
      message: newMessage,
      receiverId
    })
    
    return newMessage
  },

  // Get user conversations
  getUserConversations: (userId) => {
    const messages = messagingService.getAllMessages()
    const conversationsMap = new Map()

    messages.forEach(msg => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId
      const otherUserName = msg.senderId === userId ? msg.receiverName : msg.senderName
      
      if (msg.senderId === userId || msg.receiverId === userId) {
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            userName: otherUserName,
            lastMessage: msg.content,
            timestamp: msg.timestamp,
            unread: msg.receiverId === userId && !msg.read ? 1 : 0
          })
        } else {
          const existing = conversationsMap.get(otherUserId)
          if (new Date(msg.timestamp) > new Date(existing.timestamp)) {
            existing.lastMessage = msg.content
            existing.timestamp = msg.timestamp
          }
          if (msg.receiverId === userId && !msg.read) {
            existing.unread++
          }
        }
      }
    })

    return Array.from(conversationsMap.values()).sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
  },

  // Mark messages as read
  markAsRead: (userId, otherUserId) => {
    const messages = messagingService.getAllMessages()
    messages.forEach(msg => {
      if (msg.senderId === otherUserId && msg.receiverId === userId) {
        msg.read = true
      }
    })
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  },

  // Get unread count
  getUnreadCount: (userId) => {
    const messages = messagingService.getAllMessages()
    return messages.filter(m => m.receiverId === userId && !m.read).length
  },

  // Group chat functions
  createGroup: (teacherId, teacherName, name, studentIds) => {
    const groups = messagingService.getAllGroups()
    const newGroup = {
      id: Date.now(),
      name,
      teacherId,
      teacherName,
      studentIds,
      createdAt: new Date().toISOString()
    }
    groups.push(newGroup)
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups))
    return newGroup
  },

  getAllGroups: () => {
    const stored = localStorage.getItem(GROUPS_KEY)
    return stored ? JSON.parse(stored) : []
  },

  getUserGroups: (userId) => {
    const groups = messagingService.getAllGroups()
    return groups.filter(g => g.teacherId === userId || g.studentIds.includes(userId))
  },

  getGroupMessages: (groupId) => {
    const messages = messagingService.getAllMessages()
    return messages.filter(m => m.groupId === groupId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  },

  sendGroupMessage: (senderId, senderName, groupId, content) => {
    const messages = messagingService.getAllMessages()
    const newMessage = {
      id: Date.now() + Math.random(),
      senderId,
      senderName,
      content,
      timestamp: new Date().toISOString(),
      groupId,
      isGroupMessage: true
    }
    messages.push(newMessage)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
    
    // Notify other tabs about new group message
    notifyOtherTabs({
      type: 'new_group_message',
      message: newMessage,
      groupId
    })
    
    return newMessage
  },

  // Listen for cross-tab message events
  onMessageReceived: (callback) => {
    const handleStorageChange = (e) => {
      if (e.key === MESSAGE_EVENT_KEY && e.newValue) {
        try {
          const eventData = JSON.parse(e.newValue)
          callback(eventData)
        } catch (error) {
          console.error('Error parsing message event:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }
}
