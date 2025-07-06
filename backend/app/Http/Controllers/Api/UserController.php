<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\ApplyJob;
use App\Models\Rating;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

    protected function respond_with_token($token, $user)
    {
        return response()->json([
            'success' => true,
            'message' => 'User logged in successfully',
            'data' => $user->username,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60 * 24,
        ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ])->validate();

        $user = User::where('username', $validator['username'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username or password'
            ], 401);
        }

        if (!Hash::check($validator['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password'
            ], 401);
        }

        $token = JWTAuth::fromUser($user);
        return $this->respond_with_token($token, $user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'User logged out successfully',
        ], 200);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role' => ['required', Rule::in('employee', 'employeer')],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'profile_picture' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $userData = $validator;
        $userData['password'] = Hash::make($userData['password']);

        $user = User::create($userData);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => $user->username
        ], 201);
    }

    public function me()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        $me = User::where('id', $user->id)->first();

        $accepted_jobs = ApplyJob::where('user_id', $user->id)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        if (!$accepted_jobs) {
            $accepted_jobs = 0;
        }

        $rating = Rating::where('user_id', $user->id)
            ->avg('rating');

        if (!$rating) {
            $rating = 0;
        }

        $total_jobs = ApplyJob::where('user_id', $user->id)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $me,
                'jobs' => $accepted_jobs,
                'total_jobs' => $total_jobs,
                'rating' => $rating
            ]
        ], 200);
    }

    public function history()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized.'
            ]);
        }
        $jobs = DB::table('apply_jobs')
            ->join('jobs', 'apply_jobs.job_id', '=', 'jobs.id')
            ->join('users', 'jobs.employeer_id', '=', 'users.id')
            ->where('apply_jobs.user_id', operator: $user->id)
            ->select(
                DB::raw("CONCAT(users.last_name, ', ', users.first_name) as employer_name"),
                'jobs.*'
            )
            ->get();


        return response()->json([
            'success' => true,
            'jobs' => $jobs
        ]);
    }

    public function update(Request $request, string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'username' => ['string', 'max:255', Rule::unique('users')->ignore($id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['nullable', 'in:admin,employee,user'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'profile_picture' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $user->update($validator);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ], 200);
    }

    public function forgot_password(Request $request)
    {
        $step = $request->input('step', 1);

        if ($step == 1) {
            // Step 1: Verify username and phone
            $check_user = Validator::make($request->all(), [
                'username' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'max:255'],
            ])->validate();

            $user = User::where('username', $check_user['username'])->where('phone', $check_user['phone'])->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found with provided username and phone number'
                ], 404);
            }

            // Generate a simple verification code (in production, use proper SMS service)
            $verification_code = rand(100000, 999999);

            // Store verification code in session or cache (simplified for demo)
            session(['verification_code' => $verification_code, 'reset_user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'Verification code sent to your phone',
                'verification_code' => $verification_code // In production, don't return this
            ], 200);
        } elseif ($step == 2) {
            // Step 2: Verify code
            $validator = Validator::make($request->all(), [
                'code' => ['required', 'string', 'size:6'],
            ])->validate();

            $stored_code = session('verification_code');
            if (!$stored_code || $validator['code'] != $stored_code) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid verification code'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Verification code confirmed'
            ], 200);
        } elseif ($step == 3) {
            // Step 3: Reset password
            $validate_password = Validator::make($request->all(), [
                'password' => ['required', 'string', 'min:8'],
            ])->validate();

            $user_id = session('reset_user_id');
            if (!$user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session expired. Please start over.'
                ], 400);
            }

            $user = User::find($user_id);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $user->update([
                'password' => Hash::make($validate_password['password'])
            ]);

            // Clear session data
            session()->forget(['verification_code', 'reset_user_id']);

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid step'
        ], 400);
    }

    public function uploadProfilePicture(Request $request)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'profile_picture' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,webp',
                'max:2048' // 2MB max size
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Delete old profile picture if exists
            if ($user->profile_picture) {
                $oldImagePath = str_replace('/storage/', '', $user->profile_picture);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            // Store the new image
            $image = $request->file('profile_picture');
            $imageName = time() . '_' . $user->id . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('profile_pictures', $imageName, 'public');

            // Update user's profile picture path
            $user->update([
                'profile_picture' => '/storage/' . $imagePath
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile picture updated successfully',
                'data' => [
                    'profile_picture' => '/storage/' . $imagePath
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage()
            ], 500);
        }
    }
}
