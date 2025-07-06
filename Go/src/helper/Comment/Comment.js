import { api } from '../../lib/axios';

export async function getComments(jobId) {
  try {
    const response = await api.get(`/comments/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function createComment(jobId, comment) {
  try {
    const response = await api.post('/comments', {
      job_id: jobId,
      comments: comment
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export async function deleteComment(commentId) {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

// Delete comment as post owner (employer)
export async function deleteCommentAsPostOwner(commentId) {
  try {
    const response = await api.delete(`/comments/post-owner/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment as post owner:', error);
    throw error;
  }
}