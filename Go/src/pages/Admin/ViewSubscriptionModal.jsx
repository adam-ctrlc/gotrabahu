import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Check,
  X,
  User,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Clock,
  Loader2,
} from 'lucide-react';
import Modal from '../../components/Modal';

const getInitials = (firstName, middleName, lastName) => {
  return `${firstName ? firstName.charAt(0) : ''}${
    middleName ? middleName.charAt(0) : ''
  }${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const formatDateTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '';
  }
};

const getFullName = (employee) => {
  const parts = [
    employee.first_name,
    employee.middle_name,
    employee.last_name,
  ].filter(Boolean);
  return parts.join(' ');
};

const getPlanColor = (subscription) => {
  return subscription === '20_token'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-purple-100 text-purple-800';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ViewSubscriptionModal({
  showViewModal,
  setShowViewModal,
  selectedSubscription,
  isSubmitting,
  handleApprove,
  handleReject,
  customTokenCount,
  setCustomTokenCount,
}) {
  if (!showViewModal || !selectedSubscription) return null;

  const [editedStatus, setEditedStatus] = useState(selectedSubscription.status);

  const handleUpdateSubscription = async () => {
    try {
      if (editedStatus === 'active') {
        console.log(
          'handleUpdateSubscription: Approving with customTokenCount',
          customTokenCount
        );
        await handleApprove(
          selectedSubscription.user_id,
          selectedSubscription.subscriptions_id,
          selectedSubscription.subscription === '20_token'
            ? parseInt(customTokenCount, 10)
            : null
        );
      } else if (editedStatus === 'inactive' || editedStatus === 'pending') {
        await handleReject(
          selectedSubscription.user_id,
          selectedSubscription.subscriptions_id,
          editedStatus
        );
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  return (
    <Modal
      isOpen={showViewModal}
      onToggle={() => setShowViewModal(false)}
      title='Subscription Details'
    >
      <div className='flex flex-col items-center p-6 border-b border-gray-200'>
        <img
          src={
            selectedSubscription.profile_picture ||
            `https://placehold.co/150x150/e2e8f0/808080?text=${getInitials(
              selectedSubscription.first_name,
              selectedSubscription.middle_name,
              selectedSubscription.last_name
            )}`
          }
          alt={`${getFullName(selectedSubscription)} profile`}
          className='w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm mb-4'
        />
        <h2 className='text-xl font-semibold text-gray-800 mb-1'>
          {getFullName(selectedSubscription)}
        </h2>
        <p className='text-sm text-gray-600 mb-4'>
          @{selectedSubscription.username}
        </p>
      </div>

      <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'>
        {/* User Information Section */}
        <div className='space-y-5'>
          <h3 className='text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3'>
            Contact Information
          </h3>
          <div>
            <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
              Phone
            </label>
            <p className='text-gray-900'>{selectedSubscription.phone}</p>
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
              City
            </label>
            <p className='text-gray-900'>{selectedSubscription.city}</p>
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
              Born
            </label>
            <p className='text-gray-900'>
              {formatDate(selectedSubscription.birth_date)}
            </p>
          </div>
        </div>
        {/* Subscription Details Section */}
        <div className='space-y-5'>
          <h3 className='text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3'>
            Subscription Details
          </h3>
          <div>
            <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
              Subscription Plan
            </label>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(
                selectedSubscription.subscription
              )}`}
            >
              <CreditCard className='w-3 h-3 mr-1' />
              {selectedSubscription.subscription === '20_token'
                ? '20 Token Plan'
                : 'Unlimited Token Plan'}
            </span>
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
              Status
            </label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='pending'>Pending</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>
          {selectedSubscription.subscription === '20_token' && (
            <div>
              <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
                Current Token Count
              </label>
              <input
                type='number'
                value={customTokenCount}
                onChange={(e) => setCustomTokenCount(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min='0'
              />
            </div>
          )}
          <div>
            <label className='block text-xs font-medium text-gray-500 uppercase mb-1'>
              Request Date
            </label>
            <p className='text-gray-900'>
              {formatDateTime(selectedSubscription.requested_at)}
            </p>
          </div>
        </div>
      </div>
      <div className='p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50'>
        <button
          onClick={() => setShowViewModal(false)}
          className='px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium'
        >
          Close
        </button>
        <button
          onClick={handleUpdateSubscription}
          disabled={isSubmitting}
          className='px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex flex-row items-center'
        >
          {isSubmitting ? (
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
          ) : (
            <Check className='w-4 h-4 mr-2' />
          )}
          {isSubmitting ? 'Updating...' : 'Update Subscription'}
        </button>
      </div>
    </Modal>
  );
}
