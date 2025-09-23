// Simple script to fix user ID issue
// Run this in browser console on the frontend

console.log('🔧 Fixing user ID issue...');

// Check current user
const currentUser = localStorage.getItem('user');
console.log('Current user:', currentUser);

// Update user ID to match profile data
if (currentUser) {
  const user = JSON.parse(currentUser);
  console.log('Current user ID:', user.user_id || user.id);
  
  // Update to user ID 1 to match profile data
  user.user_id = 1;
  user.id = 1;
  
  localStorage.setItem('user', JSON.stringify(user));
  console.log('✅ Updated user ID to 1');
  console.log('New user:', localStorage.getItem('user'));
  
  // Refresh the page to apply changes
  console.log('🔄 Refreshing page...');
  location.reload();
} else {
  console.log('❌ No user found in localStorage');
  console.log('Try logging in again or creating a new user');
}

console.log('🎉 User ID fix complete!');
