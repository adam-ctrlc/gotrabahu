<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Subscription;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\UserSubscription;
use Illuminate\Support\Facades\DB;

class SubscriptionsController extends Controller
{
    public function index()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $subscriptions = DB::table('user_subscriptions')
            ->join('subscriptions', 'user_subscriptions.subscriptions_id', '=', 'subscriptions.id')
            ->join('users', 'user_subscriptions.user_id', '=', 'users.id')
            ->where('user_subscriptions.user_id', $user->id)
            ->select(
                'user_subscriptions.status as application_status',
                'subscriptions.id',
                'subscriptions.plan',
                'subscriptions.description',
                'subscriptions.price',
                DB::raw("CONCAT(users.last_name, ', ', users.first_name) as full_name")
            )
            ->orderBy('user_subscriptions.created_at', 'desc')
            ->first();


        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }

    public function current_plan()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $subscriptions = UserSubscription::where('user_id', $user->id)->orderBy('created_at', 'desc')->first();

        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }

    public function apply(string $subscriptions_id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $validator = Validator::make(['subscriptions_id' => $subscriptions_id], [
            'subscriptions_id' => ['required', 'string', Rule::in(['1', '2', '3'])],
        ])->validate();

        // Check for existing active subscription
        $existingActiveSubscription = UserSubscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if ($existingActiveSubscription) {
            $existingActiveSubscription->update(['status' => 'inactive']);
        }

        // Check for existing pending subscription
        $existingPendingSubscription = UserSubscription::where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($existingPendingSubscription) {
            $existingPendingSubscription->update([
                'subscriptions_id' => $validator['subscriptions_id'],
                'status' => 'pending',
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Subscription application updated successfully.',
                'data' => $existingPendingSubscription
            ], 200);
        }

        // If no existing active or pending subscription, create a new one
        $subscription = UserSubscription::create([
            'user_id' => $user->id,
            'subscriptions_id' => $validator['subscriptions_id'],
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscription applied successfully. Waiting for admin approval.',
            'data' => $subscription
        ], 201);
    }


    public function history()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $subscriptions = DB::table('user_subscriptions')
            ->join('subscriptions', 'user_subscriptions.subscriptions_id', '=', 'subscriptions.id')
            ->where('user_subscriptions.user_id', $user->id)
            ->select(
                'user_subscriptions.status',
                'user_subscriptions.created_at',
                'user_subscriptions.updated_at',
                'subscriptions.plan',
                'subscriptions.price',
                'subscriptions.description'
            )
            ->orderBy('user_subscriptions.created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }
}
