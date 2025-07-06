import { ArrowLeft, Menu } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export function Header() {
  return (
    <>
      <header className='relative bg-gradient-to-r from-accent-600 to-accent-800 text-white'>
        <div className='absolute inset-0 bg-black/10'></div>

        <nav className='relative z-10 flex items-center justify-between p-4 md:p-6 lg:p-8'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center'>
                <span className='text-accent-600 font-bold text-lg md:text-xl'>
                  G
                </span>
              </div>
              <span className='text-lg md:text-xl font-semibold hidden md:block'>
                GoJobs
              </span>
            </div>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
