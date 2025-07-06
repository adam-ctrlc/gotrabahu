import { api } from '../../lib/axios';

export async function getSubscriptionMethods() {
  try {
    const response = await api.get('/subscription-methods');
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (error?.response) console.log(error.response);
  }
}

export async function applySubscription(subscriptionId) {
  try {
    const response = await api.post(`/subscription/apply/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error('Error applying for subscription:', error);
    throw error;
  }
}

export async function getUserSubscriptionHistory() {
  try {
    const response = await api.get('/subscription/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching user subscription history:', error);
    throw error;
  }
}

export async function getCurrentUserSubscription() {
  try {
    const response = await api.get('/subscription');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user subscription:', error);
    throw error;
  }
}
