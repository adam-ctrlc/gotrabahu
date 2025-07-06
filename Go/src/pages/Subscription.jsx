import React, { useEffect, useState } from 'react';
import {
  Crown,
  Check,
  Star,
  Zap,
  Users,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { getSubscriptionMethods } from '../helper/SubscriptionMethods/SubscriptionMethods';
import { applySubscription } from '../helper/SubscriptionMethods/SubscriptionMethods';
import { useEmployeeJob } from '../contexts/EmployeeJobProvider';

export function Subscription() {
  const [subscriptionMethods, setSubscriptionMethods] = useState([]);
  const [currentActivePlanId, setCurrentActivePlanId] = useState(null);
  const [pendingApprovalPlanId, setPendingApprovalPlanId] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [applyingPlanId, setApplyingPlanId] = useState(null);

  const {
    subscriptions: userSubscription,
    loading: userSubscriptionLoading,
    error: userSubscriptionError,
    refetch,
  } = useEmployeeJob();

  useEffect(() => {
    async function fetchSubscriptionMethods() {
      try {
        const response = await getSubscriptionMethods();
        if (response?.success && response?.data) {
          setSubscriptionMethods(response.data);
        }
      } catch (error) {
        if (error?.response) {
          console.error(error.response.data);
        }
      } finally {
        setLoadingPlans(false);
      }
    }
    fetchSubscriptionMethods();
  }, []);

  useEffect(() => {
    console.log(
      'Subscription.jsx - userSubscriptionLoading:',
      userSubscriptionLoading
    );
    console.log('Subscription.jsx - userSubscription:', userSubscription);

    if (!userSubscriptionLoading && userSubscription) {
      console.log(
        'User Subscription Data (inside if block):',
        userSubscription
      );
      const currentStatus =
        userSubscription.application_status || userSubscription.status;

      if (currentStatus === 'active') {
        setCurrentActivePlanId(userSubscription.plan);
        setPendingApprovalPlanId(null);
      } else if (currentStatus === 'pending') {
        setPendingApprovalPlanId(userSubscription.plan);
        setCurrentActivePlanId(null);
      } else {
        setCurrentActivePlanId(null);
        setPendingApprovalPlanId(null);
      }
    } else if (applyingPlanId) {
      // If still applying, keep the pending state based on applyingPlanId
      setCurrentActivePlanId(null);
      // pendingApprovalPlanId is already set by the button click
    } else {
      setCurrentActivePlanId(null);
      setPendingApprovalPlanId(null);
    }
  }, [userSubscription, userSubscriptionLoading, applyingPlanId]);

  const plans = subscriptionMethods.map((sub, index) => {
    const features = Array.isArray(sub.description) ? sub.description : [];

    return {
      id: sub.id,
      plan: sub.plan,
      name: sub.plan === '20_token' ? '20 Token Plan' : 'Unlimited Token Plan',
      description:
        sub.plan === '20_token'
          ? 'Perfect for part-time earners'
          : 'Perfect for full-time freelancers',
      monthlyPrice: parseFloat(sub.price),
      yearlyPrice: parseFloat(sub.price) * 10,
      features: features,
      popular: index === 1,
    };
  });

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.monthlyPrice > 0) {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = monthlyCost - plan.yearlyPrice;
      return Math.round((savings / monthlyCost) * 100);
    }
    return 0;
  };

  return (
    <article className='w-full'>
      <header className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          Subscription Plans
        </h1>
        <p className='text-gray-600'>
          Choose the perfect plan for your hiring needs
        </p>
      </header>

      <section className='mb-8'>
        <div className='flex items-center justify-center mb-8'>
          <div className='bg-gray-100 p-1 rounded-lg flex'>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className='ml-1 text-xs text-green-600'>Save 17%</span>
            </button>
          </div>
        </div>

        <div className='w-full flex items-center justify-center'>
          <div className='flex flex-row gap-6'>
            {loadingPlans
              ? Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className='relative bg-white rounded-lg border-2 border-gray-200 p-6 min-w-sm '
                  >
                    <div className='text-center mb-6'>
                      <div className='flex items-center justify-center mb-2'>
                        <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse'></div>
                      </div>
                      <div className='h-6 bg-gray-200 rounded animate-pulse mb-2'></div>
                      <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                    </div>

                    <div className='text-center mb-6'>
                      <div className='h-8 bg-gray-200 rounded animate-pulse mb-2'></div>
                      <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                    </div>

                    <div className='space-y-3 mb-6'>
                      {Array.from({ length: 3 }).map((_, featureIndex) => (
                        <div
                          key={featureIndex}
                          className='flex items-start gap-2'
                        >
                          <div className='w-4 h-4 bg-gray-200 rounded animate-pulse mt-0.5 flex-shrink-0'></div>
                          <div className='h-4 bg-gray-200 rounded animate-pulse flex-1'></div>
                        </div>
                      ))}
                    </div>

                    <div className='w-full py-2 px-4 rounded-lg bg-gray-200 animate-pulse h-10'></div>
                  </div>
                ))
              : plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-lg border-2 p-6 min-w-sm max-w-sm ${
                      plan.popular
                        ? 'border-accent-500 shadow-lg'
                        : currentActivePlanId === plan.plan ||
                          pendingApprovalPlanId === plan.plan
                        ? 'border-accent-500'
                        : 'border-gray-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                        <span className='bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
                          <Star className='w-3 h-3' />
                          Most Popular
                        </span>
                      </div>
                    )}

                    {currentActivePlanId === plan.plan && (
                      <div className='absolute -top-3 right-4'>
                        <span className='bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1'>
                          <Check className='w-3 h-3' />
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className='text-center mb-6'>
                      <div className='flex items-center justify-center mb-2'>
                        {plan.plan === '20_token' && (
                          <Users className='w-8 h-8 text-accent-400' />
                        )}
                        {plan.plan === 'unlimited_token' && (
                          <Crown className='w-8 h-8 text-accent-500' />
                        )}
                      </div>
                      <h3 className='text-xl font-bold text-gray-900'>
                        {plan.name}
                      </h3>
                      <p className='text-gray-500 text-sm mt-1'>
                        {plan.description}
                      </p>
                    </div>

                    <div className='text-center mb-6'>
                      <div className='flex items-baseline justify-center'>
                        <span className='text-3xl font-bold text-gray-900'>
                          ₱{getPrice(plan)}
                        </span>
                        <span className='text-gray-500 ml-1'>
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                        <p className='text-accent-600 text-sm mt-1'>
                          Save {getSavings(plan)}% annually
                        </p>
                      )}
                    </div>

                    <ul className='space-y-3 mb-6'>
                      {plan.features.map((feature, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <Check className='w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0' />
                          <span className='text-gray-700 text-sm'>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={async () => {
                        console.log(
                          'Before applySubscription - applyingPlanId:',
                          applyingPlanId,
                          'plan.id:',
                          plan.id
                        );
                        setApplyingPlanId(plan.id);
                        try {
                          const response = await applySubscription(plan.id);
                          console.log(
                            'After applySubscription response:',
                            response
                          );
                          if (response.success) {
                            setPendingApprovalPlanId(plan.plan);
                            console.log('Calling refetch...');
                            refetch(); // Refetch from backend to confirm and update context
                          } else {
                            alert(
                              `Failed to apply for subscription: ${response.message}`
                            );
                          }
                        } catch (error) {
                          console.error(
                            'Error applying for subscription:',
                            error
                          );
                          alert(
                            'An error occurred while applying for the subscription.'
                          );
                        } finally {
                          console.log(
                            'Finally block - setting applyingPlanId to null'
                          );
                          setApplyingPlanId(null);
                        }
                      }}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        currentActivePlanId === plan.plan ||
                        pendingApprovalPlanId === plan.plan ||
                        applyingPlanId === plan.id ||
                        userSubscriptionLoading
                          ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-accent-600 text-white hover:bg-accent-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                      disabled={
                        currentActivePlanId === plan.plan ||
                        pendingApprovalPlanId === plan.plan ||
                        applyingPlanId === plan.id ||
                        userSubscriptionLoading
                      }
                    >
                      {applyingPlanId === plan.id ? (
                        'Applying...'
                      ) : userSubscriptionLoading ? (
                        'Loading...'
                      ) : pendingApprovalPlanId === plan.plan ? (
                        'Pending Approval...'
                      ) : currentActivePlanId === plan.plan ? (
                        'Current Plan'
                      ) : (
                        <>
                          {plan.plan === '20_token' ? 'Downgrade' : 'Upgrade'}
                          <ArrowRight className='w-4 h-4' />
                        </>
                      )}
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </article>
  );
}
