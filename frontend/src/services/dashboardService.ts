import request from '../utils/request';

// Mock data for dashboard
export const getDashboardData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalMaterials: 128,
        pendingApprovals: 5,
        thisMonthMaterials: 24,
        chartData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Materials',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
      });
    }, 500);
  });
};

export const getRecentMaterials = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Marketing Banner', type: 'Image', createdAt: '2023-06-01' },
        { id: 2, name: 'Product Description', type: 'Text', createdAt: '2023-06-02' },
        { id: 3, name: 'Social Media Post', type: 'Text', createdAt: '2023-06-03' },
      ]);
    }, 500);
  });
};