import { api } from '../../lib/axios';

export async function getSubscriptions() {
  try {
    const response = await api.get('/admin/get-subscriptions');
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserSubscriptions(data) {
  try {
    const response = await api.post('/admin/update_user_subscription', data);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function approveSubscription(
  userId,
  subscriptionId,
  tokenCount = null
) {
  try {
    const payload = {
      user_id: userId,
      subscriptions_id: subscriptionId,
      status: 'active',
    };

    if (tokenCount !== null) {
      payload.token_count = tokenCount;
    }

    const response = await api.post(`/admin/update_user_subscription`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function rejectSubscription(
  userId,
  subscriptionId,
  status = 'inactive'
) {
  try {
    const response = await api.post(`/admin/update_user_subscription`, {
      user_id: userId,
      subscriptions_id: subscriptionId,
      status: status,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSubscriptionById(id) {
  try {
    const response = await api.get(`/admin/get-subscriptions`);
    if (response && response.data && Array.isArray(response.data.data)) {
      const subscription = response.data.data.find((sub) => sub.id === id);
      if (subscription) {
        return { success: true, data: subscription };
      }
    }
    return { success: false, message: 'Subscription not found' };
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
}
