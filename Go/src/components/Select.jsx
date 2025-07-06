import { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({ name, options, onChange, isDisabled = false }) {
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const id = useId();

  function handleChange(e) {
    setSelectedOption(e.target.value);
    onChange(e.target.value);
  }

  return (
    <>
      <div className='relative flex-1'>
        <select
          className='w-full px-3 py-1.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none'
          onChange={handleChange}
          value={selectedOption}
          name={name ? name : id}
          disabled={isDisabled}
        >
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label ? option.label : option.value}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className='absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 pointer-events-none'
        />
      </div>
    </>
  );
}
