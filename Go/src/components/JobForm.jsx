import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useEmployer } from '../contexts/EmployerProvider';
import Modal from './Modal';

export function JobForm({ onClose, editingJob, onSuccess, isOpen }) {
  const { createJob, updateJob } = useEmployer();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    company: '',
    salary: '',
    contact: '',
    duration: '',
    life_cycle: 'active',
    type: 'full_time',
  });

  useEffect(() => {
    if (editingJob && editingJob.id) {
      setFormData({
        title: editingJob.title || '',
        description: editingJob.description || '',
        location: editingJob.location || '',
        company: editingJob.company || '',
        salary: editingJob.salary || '',
        contact: editingJob.contact || '',
        duration: editingJob.duration ? editingJob.duration.split('T')[0] : '',
        life_cycle: editingJob.life_cycle || 'active',
        type: editingJob.type || 'full_time',
      });
    } else if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        location: '',
        company: '',
        salary: '',
        contact: '',
        duration: '',
        life_cycle: 'active',
        type: 'full_time',
      });
      setErrors({});
    }
  }, [editingJob, isOpen]);

  function handleToggle() {
    onClose();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.salary.trim()) newErrors.salary = 'Salary is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});

      if (editingJob) {
        await updateJob(editingJob.id, formData);
      } else {
        await createJob(formData);
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error saving job:', err);
      setErrors({ submit: err.message || 'Failed to save job' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onToggle={handleToggle}
      title={editingJob ? 'Edit Job' : 'Create New Job'}
    >
      <form onSubmit={handleSubmit} className='p-6 space-y-6'>
        {/* Title */}
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Job Title *
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='e.g. Senior React Developer'
          />
          {errors.title && (
            <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Description *
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Describe the job requirements and responsibilities...'
          />
          {errors.description && (
            <p className='text-red-500 text-sm mt-1'>{errors.description}</p>
          )}
        </div>

        {/* Location and Company */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='location'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Location *
            </label>
            <input
              type='text'
              id='location'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g. New York, NY'
            />
            {errors.location && (
              <p className='text-red-500 text-sm mt-1'>{errors.location}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='company'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Company *
            </label>
            <input
              type='text'
              id='company'
              name='company'
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g. Tech Solutions Inc.'
            />
            {errors.company && (
              <p className='text-red-500 text-sm mt-1'>{errors.company}</p>
            )}
          </div>
        </div>

        {/* Salary and Contact */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='salary'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Salary *
            </label>
            <input
              type='text'
              id='salary'
              name='salary'
              value={formData.salary}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.salary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g. $80,000 - $120,000'
            />
            {errors.salary && (
              <p className='text-red-500 text-sm mt-1'>{errors.salary}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='contact'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Contact *
            </label>
            <input
              type='text'
              id='contact'
              name='contact'
              value={formData.contact}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.contact ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g. hr@company.com'
            />
            {errors.contact && (
              <p className='text-red-500 text-sm mt-1'>{errors.contact}</p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label
            htmlFor='duration'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Duration (End Date) *
          </label>
          <input
            type='date'
            id='duration'
            name='duration'
            value={formData.duration}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.duration ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.duration && (
            <p className='text-red-500 text-sm mt-1'>{errors.duration}</p>
          )}
        </div>

        {/* Status (only for editing) */}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='life_cycle'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Life Cycle
            </label>
            <select
              id='life_cycle'
              name='life_cycle'
              value={formData.life_cycle}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='active'>Active</option>
              <option value='ended'>Ended</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='type'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Job Type
            </label>
            <select
              id='type'
              name='type'
              value={formData.type}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='full_time'>Full Time</option>
              <option value='part_time'>Part Time</option>
              <option value='order'>Order</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
            <p className='text-red-600 text-sm'>{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
          <button
            type='button'
            onClick={handleToggle}
            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
          >
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                {editingJob ? 'Updating' : 'Creating'}
              </>
            ) : (
              <>
                <Save className='w-4 h-4' />
                {editingJob ? 'Update Job' : 'Create Job'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default JobForm;
