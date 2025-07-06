<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subscription;
use Tymon\JWTAuth\Facades\JWTAuth;

class SubscriptionsMethodController extends Controller
{
    public function index()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'data' => 'Not authorized'
            ]);
        }

        $subscription = Subscription::where('status', 'active')->get();

        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    }
}
