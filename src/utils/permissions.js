// Utility functions for checking user permissions

export const isWorshipHead = (user) => {
  return user && user.email === 'rachitfrancis28@gmail.com';
};

export const canAccessWorshipHeadDashboard = (user) => {
  return isWorshipHead(user);
};

export const canApproveRequests = (user) => {
  return isWorshipHead(user);
};