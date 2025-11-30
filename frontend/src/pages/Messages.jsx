import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { messagingService } from '../services/messagingService'
import { adminService } from '../services/adminService'
import { activityService } from '../services/activityService'
import { notificationService } from '../services/notificationService'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

import '../styles/global.css'
import '../styles/messaging.css'

const Messages = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [availableUsers, setAvailableUsers] = useState([])
  const [showNewChat, setShowNewChat] = useState(false)
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [viewMode, setViewMode] = useState('direct') // 'direct' or 'group'
  const [showGroupMembers, setShowGroupMembers] = useState(false)
  const [groupMembers, setGroupMembers] = useState([])
  const [activeTab, setActiveTab] = useState('messages')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    
    try {
      loadConversations()
      loadAvailableUsers()
      loadGroups()
      loadNotifications()

      // Check if navigated from Tutors page
      if (location.state?.startChatWith) {
        startNewChat(location.state.startChatWith)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error in useEffect:', error)
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    
    let unsubscribe = () => {}
    let interval
    
    try {
      // Listen for cross-tab message events
      unsubscribe = messagingService.onMessageReceived((eventData) => {
        if (eventData.type === 'new_message' && eventData.receiverId === user.id) {
          loadConversations()
          if (selectedConversation && selectedConversation.userId === eventData.message.senderId) {
            const msgs = messagingService.getConversation(user.id, selectedConversation.userId)
            setMessages(msgs)
          }
        } else if (eventData.type === 'new_group_message') {
          loadGroups()
          if (selectedGroup && selectedGroup.id === eventData.groupId) {
            const msgs = messagingService.getGroupMessages(selectedGroup.id)
            setMessages(msgs)
          }
        }
      })
      
      // Auto-refresh only messages, not the entire UI
      interval = setInterval(() => {
        if (selectedConversation?.userId) {
          const msgs = messagingService.getConversation(user.id, selectedConversation.userId)
          setMessages(msgs)
        }
        if (selectedGroup?.id) {
          const msgs = messagingService.getGroupMessages(selectedGroup.id)
          setMessages(msgs)
        }
      }, 5000)
    } catch (error) {
      console.error('Error setting up message listeners:', error)
    }

    return () => {
      if (interval) clearInterval(interval)
      unsubscribe()
    }
  }, [user?.id, selectedConversation?.userId, selectedGroup?.id])

  useEffect(() => {
    // Request notification permission
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {})
      }
    } catch (error) {
      // Ignore notification errors
    }
  }, [])

  useEffect(() => {
    if (selectedConversation?.userId) {
      loadMessages(selectedConversation.userId)
    }
  }, [selectedConversation?.userId])

  const loadConversations = () => {
    if (!user?.id) return
    const convos = messagingService.getUserConversations(user.id)
    setConversations(convos)
  }

  const loadMessages = (otherUserId) => {
    const msgs = messagingService.getConversation(user.id, otherUserId)
    setMessages(msgs)
    messagingService.markAsRead(user.id, otherUserId)
    loadConversations()
  }

  const loadAvailableUsers = () => {
    if (!user?.id) return
    const allUsers = adminService.getAllUsers()
    const filtered = allUsers.filter(u => u.id !== user.id)
    setAvailableUsers(filtered)
  }

  const loadGroups = () => {
    if (!user?.id) return
    const userGroups = messagingService.getUserGroups(user.id)
    // Add last message info to each group
    const groupsWithMessages = userGroups.map(group => {
      const groupMessages = messagingService.getGroupMessages(group.id)
      const lastMsg = groupMessages[groupMessages.length - 1]
      return {
        ...group,
        lastMessage: lastMsg ? `${lastMsg.senderName}: ${lastMsg.content}` : '',
        lastMessageTime: lastMsg?.timestamp,
        memberCount: (group.studentIds?.length || 0) + 1
      }
    })
    setGroups(groupsWithMessages)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    if (viewMode === 'group' && selectedGroup) {
      messagingService.sendGroupMessage(user.id, user.name, selectedGroup.id, newMessage)
      setNewMessage('')
      loadGroupMessages(selectedGroup.id)
      loadGroups()
    } else if (selectedConversation) {
      messagingService.sendMessage(
        user.id,
        selectedConversation.userId,
        newMessage,
        user.name,
        selectedConversation.userName
      )
      setNewMessage('')
      loadMessages(selectedConversation.userId)
      loadConversations()
    }
  }

  const startNewChat = (otherUser) => {
    setViewMode('direct')
    setSelectedGroup(null)
    setSelectedConversation({
      userId: otherUser.id,
      userName: otherUser.name
    })
    setShowNewChat(false)
    loadMessages(otherUser.id)
  }

  const loadGroupMessages = (groupId) => {
    const msgs = messagingService.getGroupMessages(groupId)
    setMessages(msgs)
  }

  const selectGroup = (group) => {
    if (!group || !group.id) return
    setViewMode('group')
    setSelectedConversation(null)
    setSelectedGroup(group)
    const msgs = messagingService.getGroupMessages(group.id)
    setMessages(msgs || [])
    loadGroupMembers(group)
    setShowGroupMembers(false)
  }

  const loadGroupMembers = (group) => {
    const allUsers = adminService.getAllUsers()
    const members = allUsers.filter(u => 
      u.id === group.teacherId || group.studentIds.includes(u.id)
    )
    setGroupMembers(members)
  }

  const handleCreateGroup = (e) => {
    e.preventDefault()
    if (!groupName.trim() || selectedStudents.length === 0) return

    messagingService.createGroup(user.id, user.name, groupName, selectedStudents)
    setGroupName('')
    setSelectedStudents([])
    setShowCreateGroup(false)
    loadGroups()
  }

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const loadNotifications = () => {
    if (!user?.id) return
    try {
      const notifs = notificationService.getUserNotifications(user.id)
      setNotifications(notifs)
    } catch (error) {
      console.error('Error loading notifications:', error)
      setNotifications([])
    }
  }

  const handleMarkAsRead = (notifId) => {
    if (!user?.id) return
    try {
      notificationService.markAsRead(user.id, notifId)
      loadNotifications()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllAsRead = () => {
    if (!user?.id) return
    try {
      notificationService.markAllAsRead(user.id)
      loadNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  if (loading || !user) {
    return (
      <div className="messages-page">
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            fontSize: '1.2rem',
            color: '#666'
          }}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
            Loading messages...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="messages-page">
      <div className="container">
        <div className="page-tabs">
          <button 
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <i className="fas fa-comments"></i> {t('messages')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell"></i> {t('notifications')}
          </button>
        </div>

        {activeTab === 'messages' ? (
        <div className="messages-container">
          <div className="conversations-sidebar">
            <div className="sidebar-header">
              <h2>{t('messages')}</h2>
              <div>
                <button className="btn-icon" onClick={() => setShowNewChat(!showNewChat)} title={t('newChat')}>
                  <i className="fas fa-plus"></i>
                </button>
                <button className="btn-icon" onClick={() => setShowCreateGroup(!showCreateGroup)} title={t('createGroup')}>
                  <i className="fas fa-users"></i>
                </button>
              </div>
            </div>

            <div className="message-tabs">
              <button 
                className={viewMode === 'direct' ? 'active' : ''}
                onClick={() => setViewMode('direct')}
              >
                <i className="fas fa-user"></i> {t('direct')}
              </button>
              <button 
                className={viewMode === 'group' ? 'active' : ''}
                onClick={() => setViewMode('group')}
              >
                <i className="fas fa-users"></i> {t('groups')} ({groups.length})
              </button>
            </div>

            {showNewChat && (
              <div className="new-chat-list">
                <h3>{t('startNewChat')}</h3>
                {availableUsers.map(u => (
                  <div key={u.id} className="user-item" onClick={() => startNewChat(u)}>
                    <i className="fas fa-user-circle"></i>
                    <div>
                      <strong>{u.name}</strong>
                      <p>{u.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showCreateGroup && (
              <div className="create-group-form">
                <h3>{t('createGroup')}</h3>
                <form onSubmit={handleCreateGroup}>
                  <input
                    type="text"
                    placeholder={t('groupName')}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                  <div className="student-selection">
                    <p>{t('selectStudents')}</p>
                    {availableUsers.map(u => (
                      <label key={u.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(u.id)}
                          onChange={() => toggleStudentSelection(u.id)}
                        />
                        {u.name}
                      </label>
                    ))}
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">{t('create')}</button>
                    <button type="button" className="btn" onClick={() => setShowCreateGroup(false)}>{t('cancel')}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="conversations-list">
              {viewMode === 'direct' ? (
                conversations.length === 0 ? (
                  <div className="no-conversations">
                    <i className="fas fa-comments"></i>
                    <p>{t('noMessagesYet')}</p>
                  </div>
                ) : (
                  conversations.map(convo => (
                    <div
                      key={convo.userId}
                      className={`conversation-item ${selectedConversation?.userId === convo.userId ? 'active' : ''}`}
                      onClick={() => startNewChat({ id: convo.userId, name: convo.userName })}
                    >
                      <i className="fas fa-user-circle"></i>
                      <div className="conversation-info">
                        <strong>{convo.userName}</strong>
                        <p>{convo.lastMessage.substring(0, 30)}...</p>
                      </div>
                      {convo.unread > 0 && (
                        <span className="unread-badge">{convo.unread}</span>
                      )}
                    </div>
                  ))
                )
              ) : (
                groups.length === 0 ? (
                  <div className="no-conversations">
                    <i className="fas fa-users"></i>
                    <p>{t('noGroupsYet')}</p>
                  </div>
                ) : (
                  groups.map(group => (
                    <div
                      key={group.id}
                      className={`conversation-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                      onClick={() => selectGroup(group)}
                    >
                      <i className="fas fa-users"></i>
                      <div className="conversation-info">
                        <strong>{group.name}</strong>
                        <p>
                          {group.lastMessage ? (
                            <>{group.lastMessage.substring(0, 40)}{group.lastMessage.length > 40 ? '...' : ''}</>
                          ) : (
                            <span style={{color: '#999'}}>{group.memberCount} {t('members')}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          <div className="chat-area">
            {(selectedConversation || selectedGroup) ? (
              <>
                <div className="chat-header">
                  <i className={viewMode === 'group' ? 'fas fa-users' : 'fas fa-user-circle'}></i>
                  <h3>{viewMode === 'group' ? selectedGroup.name : selectedConversation.userName}</h3>
                  {viewMode === 'group' && (
                    <>
                      <span className="group-info">{groupMembers.length} {t('members')}</span>
                      <button className="btn-icon" onClick={() => setShowGroupMembers(!showGroupMembers)} title="View Members">
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </>
                  )}
                </div>

                {showGroupMembers && viewMode === 'group' && (
                  <div className="group-members-panel">
                    <h4>{t('groupMembers')}</h4>
                    <div className="members-list">
                      {groupMembers.map(member => (
                        <div key={member.id} className="member-item">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="member-avatar" />
                          ) : (
                            <i className="fas fa-user-circle member-avatar-icon"></i>
                          )}
                          <div className="member-info">
                            <strong>{member.name}</strong>
                            <p>{member.email}</p>
                            <span className="member-role">{t(member.role)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="messages-list">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
                    >
                      {viewMode === 'group' && msg.senderId !== user.id && (
                        <div className="message-sender">{msg.senderName}</div>
                      )}
                      <div className="message-content">{msg.content}</div>
                      <div className="message-time">
                        {activityService.getTimeAgo(msg.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>

                <form className="message-input" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('typeMessage')}
                  />
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <i className="fas fa-comments"></i>
                <p>{t('selectConversation')}</p>
              </div>
            )}
          </div>
        </div>
        ) : (
          <div className="notifications-content">
            <div className="notifications-header">
              <h2>{t('notifications')}</h2>
              {notifications.some(n => !n.read) && (
                <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
                  {t('markAllRead')}
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="no-notifications">
                <i className="fas fa-bell-slash"></i>
                <p>{t('noNotifications')}</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="notif-icon">
                      <i className={`fas fa-${notif.type === 'reminder' ? 'bell' : notif.type === 'lesson' ? 'book' : 'info-circle'}`}></i>
                    </div>
                    <div className="notif-content">
                      <h3>{notif.title}</h3>
                      <p>{notif.message}</p>
                      <span className="notif-time">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {!notif.read && <div className="unread-badge"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
