// Profile service - manages user profiles and avatars
export const profileService = {
  // Get user profile
  getProfile: (userId) => {
    const profileKey = `ssplp_profile_${userId}`
    const stored = localStorage.getItem(profileKey)
    return stored ? JSON.parse(stored) : null
  },

  // Get user avatar
  getAvatar: (userId) => {
    const profile = profileService.getProfile(userId)
    return profile?.avatar || null
  },

  // Save profile
  saveProfile: (userId, profileData) => {
    const profileKey = `ssplp_profile_${userId}`
    localStorage.setItem(profileKey, JSON.stringify(profileData))
  }
}
