import React, { useState, useEffect } from 'react';
import {
  Banknote,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Coins,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { me } from '../helper/Profile';

export default function Payment() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Cash',
      description: 'Cash Payment',
      isDefault: true,
    },
  ]);

  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await me();
        if (response.success && response.data?.user?.token) {
          setTokenBalance(parseInt(response.data.user.token));
        } else {
          setError(response.message || 'Failed to load token balance');
        }
      } catch (err) {
        console.error('Error fetching token balance:', err);
        setError('Failed to load token balance');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalance();
  }, []);

  return (
    <article className='w-full'>
      <header className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          Payment & Tokens
        </h1>
        <p className='text-gray-600'>Manage your token balance</p>
      </header>

      <section className='mb-6'>
        <div className='bg-white rounded-lg border border-gray-200 p-4 md:p-6'>
          {loading ? (
            <div className='text-center'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>...</h1>
              <p className='text-gray-600'>Loading token balance...</p>
            </div>
          ) : error ? (
            <div className='text-center'>
              <p className='text-red-600 mb-4'>Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700'
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className='flex items-center gap-3 mb-4'>
                <Coins className='w-6 h-6 text-accent-500' />
                <h2 className='text-lg font-semibold text-gray-800'>
                  Token Balance
                </h2>
              </div>

              <div className='text-center mb-4'>
                <div className='text-3xl font-bold text-gray-900 mb-2'>
                  {tokenBalance} Tokens
                </div>
                <p className='text-gray-600 text-sm'>
                  Each job posting costs 5 tokens
                </p>
              </div>

              <div className='flex justify-center'>
                <Link
                  to='/subscription'
                  className='flex items-center gap-2 py-2 px-4 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors'
                >
                  <Coins className='w-4 h-4' />
                  <span>Buy More Tokens</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <section>
          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden mb-6'>
            <div className='p-4 md:p-6 flex justify-between items-center border-b border-gray-200'>
              <div>
                <h2 className='text-lg font-semibold text-gray-800'>
                  Payment Methods
                </h2>
                <p className='text-gray-500 text-sm'>
                  Available payment options
                </p>
              </div>
            </div>

            <div className='p-4 md:p-6'>
              <div className='grid gap-4'>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <Banknote className='w-8 h-8 text-accent-500' />
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium text-gray-900'>
                            {method.description}
                          </span>
                          {method.isDefault && (
                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800'>
                              Available
                            </span>
                          )}
                        </div>
                        <p className='text-sm text-gray-500'>
                          Pay with cash for token purchases
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
