<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\PaymentMethods;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
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

        $payments = Payment::where('user_id', $user->id)->paginate(40);
        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    public function store(Request $request)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method_id' => ['required', 'integer']
        ])->validate();

        $payment = Payment::create([
            'user_id' => $user->id,
            'amount' => $validator['amount'],
            'payment_method_id' => $validator['payment_method_id']
        ]);

        return response()->json([
            'success' => true,
            'data' => $payment
        ], 201);
    }

    public function show($id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $validator = Validator::make(['id' => $id], [
            'id' => ['required', 'integer', 'exists:payments,id']
        ])->validate();

        $payment = Payment::where('user_id', $user->id)->find($validator['id']);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }
}
