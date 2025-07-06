<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Jobs\JobsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\Auth\AuthProvider;
use App\Http\Middleware\Admin\AdminProvider;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Middleware\CorsMiddleware;
use App\Http\Controllers\Payment\SubscriptionsController;
use App\Http\Controllers\Payment\SubscriptionsMethodController;
use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Comment\CommentController;

Route::prefix('v1')->group(function () {
    // Users
    Route::middleware([CorsMiddleware::class])->prefix('auth')->group(function () {
        Route::post('/login', [UserController::class, 'login']);
        Route::post('/register', [UserController::class, 'register']);
        Route::post('/forgot-password', [UserController::class, 'forgot_password']);

        Route::middleware(['auth.provider'])->group(function () {
            Route::get('/me', [UserController::class, 'me']);
            Route::get('/history', [UserController::class, 'history']);
            Route::put('/update/{id}', [UserController::class, 'update']);
            Route::post('/upload-profile-picture', [UserController::class, 'uploadProfilePicture']);
            Route::get('/all-users', [UserController::class, 'get_all_user_applied']);
            Route::get('/all-users/{id}', [UserController::class, 'get_all_user_details']);
            Route::post('/update-user-apply/{id}', [JobsController::class, 'update_user_apply']);
        });
    });

    // Admin
    Route::middleware(['admin.provider'])->prefix('/admin')->group(function () {
        Route::get('/', [AdminController::class, 'index']);
        Route::post('/', [AdminController::class, 'store']);
        Route::get('/get-subscriptions', [AdminController::class, 'get_subscriptions']);
        Route::post('/update_user_subscription', [AdminController::class, 'update_user_subscription']);
        Route::get('/{id}', [AdminController::class, 'show']);
        Route::put('/{id}', [AdminController::class, 'update']);
        Route::delete('/{id}', [AdminController::class, 'destroy']);
    });

    // Jobs
    Route::prefix('jobs')->middleware(['auth.provider', 'cors'])->group(function () {
        Route::get('/', [JobsController::class, 'index']);
        Route::post('/', [JobsController::class, 'store']);

        // Specific routes must come before parameterized routes
        Route::get('/user-applied', [JobsController::class, 'get_all_user_applied']);
        Route::get('/user-details/{id}', [JobsController::class, 'get_user_details']);
        Route::get('/user-profile/{id}', [JobsController::class, 'get_user_profile_details']);

        // Rating routes - must be before the general user-applied/{id} route to avoid conflicts
        Route::get('/user-applied/rate/test', function () {
            return response()->json(['message' => 'Rating routes are working']);
        });
        Route::get('/user-applied/rate/{job_id}/{user_id}', [JobsController::class, 'get_rate_employee']);
        Route::post('/user-applied/rate/{job_id}/{user_id}', [JobsController::class, 'rate_employee']);
        Route::put('/user-applied/rate/{job_id}/{user_id}', [JobsController::class, 'update_rating']);
        Route::delete('/user-applied/rate/{job_id}/{user_id}', [JobsController::class, 'delete_rating']);

        // General user-applied route - must come after specific rating routes
        Route::post('/user-applied/{id}', [JobsController::class, 'update_user_apply']);

        // Parameterized routes come last
        Route::get('/history', [JobsController::class, 'employerJobHistory']);
        Route::get('/{id}', [JobsController::class, 'show']);
        Route::put('/{id}', [JobsController::class, 'update']);
        Route::delete('/{id}', [JobsController::class, 'destroy']);
        Route::post('/{id}/end', [JobsController::class, 'end_job']);
        Route::post('/{id}/apply', [JobsController::class, 'apply']);
        Route::post('/{id}/cancel-apply', [JobsController::class, 'cancel_apply']);
    });

    // Comments
    Route::prefix('comments')->middleware(['auth.provider'])->group(function () {
        Route::get('/{id}', [CommentController::class, 'index']);
        Route::post('/', [CommentController::class, 'store']);
        Route::delete('/{id}', [CommentController::class, 'destroy']);
        Route::delete('post-owner/{id}', [CommentController::class, 'destroy_comment_post_owner']);
    });

    // Subscriptions
    Route::prefix('subscription')->middleware(['auth.provider'])->group(function () {
        Route::get('/', [SubscriptionsController::class, 'index']);
        Route::get('/history', [SubscriptionsController::class, 'history']);
        Route::post('/apply/{subscriptions_id}', [SubscriptionsController::class, 'apply']);
    });

    // Subscriptions Methods
    Route::prefix('subscription-methods')->middleware(['auth.provider'])->group(function () {
        Route::get('/', [SubscriptionsMethodController::class, 'index']);
    });

    // Payment
    Route::prefix('payment')->middleware(['auth.provider'])->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::get('/{id}', [PaymentController::class, 'show']);
    });
});
