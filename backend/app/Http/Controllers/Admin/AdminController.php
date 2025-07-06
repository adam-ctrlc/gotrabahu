<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Job;
use App\Models\ApplyJob;
use App\Models\Subscription;
use App\Models\UserSubscription;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;


class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin_user = JWTAuth::user();

        if (!$admin_user || $admin_user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to access this resource',
            ], 401);
        }

        $usersPerPage = $request->input('users_per_page', 3); // Default to 3
        $employersPerPage = $request->input('employers_per_page', 3); // Default to 3
        $employeePage = $request->input('employee_page', 1); // Default to page 1
        $employerPage = $request->input('employer_page', 1); // Default to page 1

        $usersQuery = User::where('role', 'employee');
        $employersQuery = User::where('role', 'employeer');

        $users = ($usersPerPage === 'all') ? $usersQuery->get() : $usersQuery->paginate($usersPerPage, ['*'], 'employee_page', $employeePage);
        $employers = ($employersPerPage === 'all') ? $employersQuery->get() : $employersQuery->paginate($employersPerPage, ['*'], 'employer_page', $employerPage);

        $admin = User::where('role', 'admin')->get();
        $total_users = User::where('role', 'employee')->count();
        $total_employers = User::where('role', 'employeer')->count();
        $total_jobs = Job::count();
        $total_applications = ApplyJob::count();
        $new_users = User::where('created_at', '>=', now()->subMonth())->get();
        $new_jobs = Job::where('created_at', '>=', now()->subMonth())->get();
        $new_applications = ApplyJob::where('created_at', '>=', now()->subMonth())->get();

        return response()->json([
            'success' => true,
            'message' => 'Users fetched successfully',
            'data' => [
                'admin' => $admin,
                'users' => $users,
                'employers' => $employers,
                'total_users' => $total_users,
                'total_employers' => $total_employers,
                'total_jobs' => $total_jobs,
                'total_applications' => $total_applications,
                'new_users' => $new_users,
                'new_jobs' => $new_jobs,
                'new_applications' => $new_applications,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found or token invalid',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'max:255'],
            'profile_picture' => ['nullable', 'string', 'max:255'],
            'role' => ['required', 'string', Rule::in(['admin', 'employee', 'employeer'])],
        ])->validate();

        $user = User::create($validator);

        return response()->json([
            'success' => true,
            'message' => 'Admin successfully created a user',
            'data' => $user
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => ['required'],
        ])->validate();

        $user = User::find($validator['id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Admin cannot find the user',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Admin successfully fetched user details',
            'data' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found or token invalid',
            ], 401);
        }

        $validator = Validator::make(array_merge($request->all(), ['id' => $id]), [
            'id' => ['required'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($id)],
            'password' => ['nullable', 'string', 'min:8'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'max:255'],
            'profile_picture' => ['nullable', 'string', 'max:255'],
            'role' => ['required', 'string', Rule::in(['admin', 'employee', 'employeer'])],
        ])->validate();

        $user = User::find($validator['id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Admin cannot find the user',
            ], 404);
        }

        $updateData = $request->except(['password']);

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->input('password'));
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Admin successfully updated user details',
            'data' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found or token invalid',
            ], 401);
        }

        $validator = Validator::make(['id' => $id], [
            'id' => ['required'],
        ])->validate();

        $user = User::find($validator['id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Admin cannot find the user',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Admin successfully soft deleted user',
        ]);
    }

    public function get_subscriptions()
    {
        $admin_user = JWTAuth::user();

        if (!$admin_user || $admin_user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to access this resource',
            ], 401);
        }

        $subscriptions = UserSubscription::with(['user', 'subscription'])->paginate(40);

        $formattedSubscriptions = $subscriptions->map(function ($subscription) {
            return [
                'id' => $subscription->id,
                'user_id' => $subscription->user_id,
                'subscriptions_id' => $subscription->subscriptions_id,
                'status' => $subscription->status,
                'created_at' => $subscription->created_at->toIso8601String(),
                'updated_at' => $subscription->updated_at->toIso8601String(),
                'first_name' => $subscription->user->first_name ?? null,
                'last_name' => $subscription->user->last_name ?? null,
                'middle_name' => $subscription->user->middle_name ?? null,
                'username' => $subscription->user->username ?? null,
                'birth_date' => $subscription->user->birth_date ? $subscription->user->birth_date->toDateString() : null,
                'phone' => $subscription->user->phone ?? null,
                'city' => $subscription->user->city ?? null,
                'profile_picture' => $subscription->user->profile_picture ?? null,
                'subscription' => $subscription->subscription->plan ?? null,
                'requested_at' => $subscription->created_at->toIso8601String(),
                'user_token' => $subscription->user->token ?? 0,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Subscriptions fetched successfully',
            'data' => $formattedSubscriptions
        ]);
    }

    public function update_user_subscription(Request $request)
    {
        Log::info('update_user_subscription: Function hit. Request all:', $request->all());
        $user = JWTAuth::user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'You are not an admin.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => ['required'],
            'subscriptions_id' => ['required', Rule::in(['1', '2', '3'])],
            'status' => ['required', Rule::in(['active', 'inactive', 'pending'])],
            'token_count' => ['nullable', 'integer', 'min:0'],
        ])->validated();

        Log::info('update_user_subscription: Incoming request data', $validator);

        $user_subscription = UserSubscription::where('user_id', $validator['user_id'])->latest()->first();

        if (!$user_subscription) {
            Log::warning('update_user_subscription: User subscription not found for user_id', ['user_id' => $validator['user_id']]);
            return response()->json([
                'success' => false,
                'message' => 'User subscription not found or not authorized to update'
            ], 404);
        }

        $subscription_plan = Subscription::find($validator['subscriptions_id'])->plan ?? null;

        Log::info('update_user_subscription: Subscription plan', ['plan' => $subscription_plan]);

        $user_subscription->update([
            'status' => $validator['status']
        ]);

        Log::info('update_user_subscription: User subscription status updated', ['status' => $validator['status']]);

        if ($validator['status'] === 'active' && $subscription_plan === '20_token') {
            Log::info('update_user_subscription: Attempting to update user token');
            $user = User::find($validator['user_id']);
            if ($user) {
                Log::info('update_user_subscription: User token BEFORE update', ['user_id' => $user->id, 'current_token' => $user->token, 'token_count_from_request' => $validator['token_count'] ?? 'null/undefined']);
                $user->update([
                    'token' => $validator['token_count'] ?? 20
                ]);
                Log::info('update_user_subscription: User token updated successfully', ['user_id' => $user->id, 'new_token' => $user->token]);
            } else {
                Log::warning('update_user_subscription: User not found for token update', ['user_id' => $validator['user_id']]);
            }
        } else {
            Log::info('update_user_subscription: Token update conditions not met', [
                'status' => $validator['status'],
                'subscription_plan' => $subscription_plan
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $user_subscription,
            'user_token_updated' => isset($user) ? $user->token : null
        ]);
    }
}
