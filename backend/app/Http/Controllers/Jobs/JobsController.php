<?php

namespace App\Http\Controllers\Jobs;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\Job;
use App\Models\User;
use App\Models\ApplyJob;
use App\Models\Rating;
use App\Models\Comment;
use App\Models\UserSubscription;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class JobsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication failed.'
            ], 401);
        }

        $query = Job::query();

        if ($user->role === 'employee') {
            $query->where('life_cycle', 'active');
        } elseif ($user->role === 'employeer') {
            $query->where('employeer_id', $user->id);
            // Add applicants count for employers
            $query->withCount('applications as applicants_count');
        } elseif ($user->role === 'admin') {
            // Admin can see all jobs from all employers
            $query->withCount('applications as applicants_count');
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized role.'
            ], 403);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%')
                    ->orWhere('company', 'like', '%' . $search . '%')
                    ->orWhere('location', 'like', '%' . $search . '%');
            });
        }

        $jobs = $query->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
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
                'message' => 'Not authorized'
            ], 401);
        }

        if ($user->role !== 'employeer') {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to create a job'
            ], 403);
        }


        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'salary' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'duration' => ['required', 'date'],
        ])->validate();

        $job = Job::create([
            'employeer_id' => $user->id,
            'title' => $validator['title'],
            'description' => $validator['description'],
            'location' => $validator['location'],
            'salary' => $validator['salary'],
            'company' => $validator['company'],
            'contact' => $validator['contact'],
            'life_cycle' => 'active',
            'duration' => $validator['duration'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $job
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        $validator = Validator::make(['id' => $id], [
            'id' => ['required'],
        ])->validate();

        $query = Job::query();

        if ($user->role === 'employeer') {
            $query->where('employeer_id', $user->id);
        }
        // For employees, they can view any active job
        // The user_application field already indicates if they have applied

        $job = $query->with('employer')->find($validator['id']);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found or you are not authorized to view this job'
            ], 404);
        }

        // Check if current user has applied for this job
        $userApplication = ApplyJob::where('job_id', $id)
            ->where('user_id', $user->id)
            ->first();

        $comments = DB::table('comments')
            ->join('users', 'comments.user_id', '=', 'users.id')
            ->whereNotNull('comments.user_id')
            ->select('comments.*', 'users.first_name', 'users.last_name')
            ->get();

        $appliedUsers = DB::table('apply_jobs')
            ->join('users', 'apply_jobs.user_id', '=', 'users.id')
            ->where('apply_jobs.job_id', $id)
            ->select(
                'apply_jobs.id as application_id',
                'apply_jobs.status as status',
                'apply_jobs.created_at as application_date',
                'users.id as user_id',
                'users.first_name',
                'users.last_name',
                'users.username',
                'users.phone',
                'users.address',
                'users.city',
                'users.profile_picture',
                // Add any other user details needed in the frontend
            )
            ->get();


        return response()->json([
            'success' => true,
            'data' => $job,
            'comment' => $comments,
            'user_application' => $userApplication,
            'applied_users' => $appliedUsers,
        ], 200);
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
                'message' => 'Not authorized'
            ], 401);
        }

        if ($user->role !== 'employeer') {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to update this job'
            ], 403);
        }

        $own_job = Job::where('employeer_id', $user->id)->find($id);

        if (!$own_job) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to update this job'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'salary' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'duration' => ['required', 'date'],
            'life_cycle' => ['required', 'string', 'max:255'],
        ])->validate();


        $own_job->update($validator);

        return response()->json([
            'success' => true,
            'data' => $own_job
        ], 200);
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
                'message' => 'Not authorized'
            ], 401);
        }

        if ($user->role !== 'employeer') {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to delete this job'
            ], 403);
        }

        $own_job = Job::where('employeer_id', $user->id)->find($id);

        if (!$own_job) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to delete this job'
            ], 404);
        }

        $own_job->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job deleted successfully'
        ], 200);
    }

    public function end_job(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        if ($user->role !== 'employeer') {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to end this job'
            ], 403);
        }

        $job = Job::where('employeer_id', $user->id)->find($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found or you are not authorized to end this job'
            ], 404);
        }

        $job->update([
            'life_cycle' => 'ended',
        ]);

        $set_user_status_done = ApplyJob::where('job_id', $id)
            ->where('status', 'applied')
            ->update([
                'status' => 'done',
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Job ended successfully and all users status is done',
            'data' => $set_user_status_done
        ], 200);
    }

    public function employerJobHistory(): JsonResponse
    {
        $user = JWTAuth::user();

        if (!$user || $user->role !== 'employeer') {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized or not an employer'
            ], 401);
        }

        $jobs = Job::where('employeer_id', $user->id)
            ->withCount([
                'applications as total_applicants_count',
                'applications as hired_count' => function ($query) {
                    $query->where('status', 'accepted');
                }
            ])
            ->get();

        $formattedJobs = $jobs->map(function ($job) {
            return [
                'id' => $job->id,
                'title' => $job->title,
                'location' => $job->location,
                'salary' => $job->salary,
                'type' => 'Full-time', // Assuming default, or add to job model
                'status' => $job->life_cycle === 'ended' ? 'completed' : 'active', // Map life_cycle to status
                'postedDate' => $job->created_at->toDateString(),
                'endedDate' => $job->life_cycle === 'ended' ? $job->updated_at->toDateString() : null, // Assuming updated_at for ended date if life_cycle is ended
                'totalApplicants' => $job->total_applicants_count,
                'interviewed' => 0, // Placeholder, requires more backend logic
                'hired' => $job->hired_count,
                'views' => 0, // Placeholder, requires more backend logic
                'duration' => $job->created_at->diffInDays($job->life_cycle === 'ended' ? $job->updated_at : now()) . ' days', // Calculate duration
                'hiredCandidate' => null, // Requires fetching specific hired candidate if needed
                'applicants_count' => $job->total_applicants_count, // Add this line
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedJobs
        ], 200);
    }

    public function all_employeer_jobs(Request $request)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        $validate_employeer = Validator::make($request->all(), [
            'employeer_id' => ['required', 'string', 'max:255'],
        ])->validate();

        $jobs = ApplyJob::whereHas('job', function ($query) use ($validate_employeer) {
            $query->where('employeer_id', $validate_employeer['employeer_id'])
                ->where('life_cycle', 'active');
        })
            ->with(['job' => function ($query) {
                $query->select('id', 'title', 'description', 'location', 'salary', 'company', 'contact', 'max_applicants', 'type', 'life_cycle', 'duration', 'created_at');
            }, 'user'])
            ->paginate(20);

        if ($jobs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No jobs found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $jobs
        ], 200);
    }

    public function apply(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        // Check if the user has an active unlimited token plan
        $activeUnlimitedSubscription = UserSubscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->with('subscription')
            ->latest()
            ->first();

        if ($user->role === 'employee' && !($activeUnlimitedSubscription && $activeUnlimitedSubscription->subscription && $activeUnlimitedSubscription->subscription->plan === 'unlimited_token')) {
            // Check if the user has enough tokens to apply for a job (only for 20_token plan or no plan)
            if ($user->token <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have no tokens left to apply for jobs. Please subscribe to get more tokens.'
                ], 400);
            }
        }

        $job = Job::find($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found'
            ], 404);
        }

        $is_done = Job::where('id', $id)->where('life_cycle', 'ended')->first();

        if ($is_done) {
            return response()->json([
                'success' => false,
                'message' => 'This job is already ended'
            ], 400);
        }

        $already_applied = ApplyJob::where('job_id', $id)
            ->where('user_id', $user->id)
            ->withTrashed()
            ->first();

        if ($already_applied) {
            if ($already_applied->trashed()) {
                $already_applied->restore();
                $already_applied->update(['status' => 'applied']);
                return response()->json([
                    'success' => true,
                    'message' => 'Job application restored and re-applied successfully',
                    'data' => $already_applied,
                    'user' => $user
                ], 200);
            } else if ($already_applied->status === 'applied') {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already applied for this job'
                ], 400);
            }
        }

        try {
            $apply_job = ApplyJob::create([
                'job_id' => $id,
                'user_id' => $user->id,
                'status' => 'applied',
            ]);

            // Only decrement token if user is an employee and does not have an unlimited plan
            if ($user->role === 'employee' && !($activeUnlimitedSubscription && $activeUnlimitedSubscription->subscription && $activeUnlimitedSubscription->subscription->plan === 'unlimited_token')) {
                $user->decrement('token');
            }

            return response()->json([
                'success' => true,
                'message' => 'Job applied successfully',
                'data' => $apply_job,
                'user' => $user
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle unique constraint violation
            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already applied for this job'
                ], 400);
            }

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while applying for the job'
            ], 500);
        }
    }


    public function cancel_apply(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        $job = Job::find($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found'
            ], 404);
        }

        $application = ApplyJob::where('job_id', $id)
            ->where('user_id', $user->id)
            ->where('status', 'applied')
            ->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'You have not applied for this job'
            ], 400);
        }

        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job application cancelled successfully'
        ], 200);
    }


    public function get_all_user_applied()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication failed: User not found after token parsing.'
            ], 401);
        }

        $query = ApplyJob::with(['job', 'user']);

        if ($user->role === 'employee') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'employeer') {
            $query->whereHas('job', function ($q) use ($user) {
                $q->where('employeer_id', $user->id);
            });
        } elseif ($user->role === 'admin') {
            // Admins can see all applied jobs without specific filtering by user_id or employer_id
        } else {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to view applied jobs for this role.'
            ], 403);
        }

        $user_applied = $query->paginate(20);

        if ($user_applied->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No applied jobs found for your role.',
                'data' => []
            ], 200);
        }

        return response()->json([
            'success' => true,
            'data' => $user_applied->items()
        ], 200);
    }

    public function get_user_details(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        // Assuming $id is now user_id based on frontend call
        $appliedUser = DB::table('users')
            ->where('id', $id)
            ->select(
                'id as user_id',
                'first_name',
                'last_name',
                'username',
                'phone',
                'address',
                'city',
                'profile_picture',
                // Add any other user details needed in the frontend
            )
            ->first();

        if (!$appliedUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found or you are not authorized to view this user'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $appliedUser,
        ], 200);
    }

    public function get_user_profile_details(string $id)
    {
        $user = JWTAuth::user();

        if ($user->role === 'employeer' || $user->role === 'employee' || $user->role === 'admin') {
            $user_details = User::find($id);

            if (!$user_details) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // Get user's application history with job details
            $applicationHistory = DB::table('apply_jobs')
                ->join('jobs', 'apply_jobs.job_id', '=', 'jobs.id')
                ->join('users as employers', 'jobs.employeer_id', '=', 'employers.id')
                ->where('apply_jobs.user_id', $id)
                ->select(
                    'apply_jobs.id as application_id',
                    'apply_jobs.status',
                    'apply_jobs.created_at as applied_date',
                    'jobs.id as job_id',
                    'jobs.title as job_title',
                    'jobs.company',
                    'jobs.location',
                    'jobs.salary',
                    'jobs.life_cycle',
                    'jobs.created_at as job_posted_date',
                    'employers.first_name as employer_first_name',
                    'employers.last_name as employer_last_name'
                )
                ->orderBy('apply_jobs.created_at', 'desc')
                ->get();

            // Get user's ratings received from employers
            $ratings = DB::table('ratings')
                ->join('jobs', 'ratings.job_id', '=', 'jobs.id')
                ->join('users as employers', 'jobs.employeer_id', '=', 'employers.id')
                ->where('ratings.user_id', $id)
                ->select(
                    'ratings.id as rating_id',
                    'ratings.rating',
                    'ratings.created_at as rating_date',
                    'jobs.id as job_id',
                    'jobs.title as job_title',
                    'jobs.company',
                    'employers.first_name as employer_first_name',
                    'employers.last_name as employer_last_name'
                )
                ->orderBy('ratings.created_at', 'desc')
                ->get();

            // Calculate average rating
            $averageRating = $ratings->isNotEmpty() ? $ratings->avg('rating') : 0;

            // Get statistics
            $stats = [
                'total_applications' => $applicationHistory->count(),
                'pending_applications' => $applicationHistory->where('status', 'applied')->count(),
                'accepted_applications' => $applicationHistory->where('status', 'accepted')->count(),
                'rejected_applications' => $applicationHistory->where('status', 'rejected')->count(),
                'total_ratings' => $ratings->count(),
                'average_rating' => round($averageRating, 2),
                'completed_jobs' => $applicationHistory->where('status', 'accepted')->where('life_cycle', 'ended')->count()
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user_details,
                    'application_history' => $applicationHistory,
                    'ratings' => $ratings,
                    'stats' => $stats
                ]
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to view this user profile.'
            ], 403);
        }
    }


    public function update_user_apply(Request $request, string $application_id)
    {
        $employeer = JWTAuth::user();

        if (!$employeer) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        // Find the ApplyJob record by application_id
        $applied_job = ApplyJob::with('job')->find($application_id);

        if (!$applied_job) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }

        // Ensure the employer owns the job associated with the application
        if ($applied_job->job->employeer_id !== $employeer->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to update this application'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => ['required', 'string', Rule::in(['applied', 'accepted', 'rejected'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . $validator->errors()->first()
            ], 422);
        }

        $validated = $validator->validated();
        $oldStatus = $applied_job->status;
        $newStatus = $validated['status'];

        // Handle token management
        $user = User::find($applied_job->user_id);
        if ($user) {
            // If changing FROM accepted TO rejected/applied, increment token back
            if ($oldStatus === 'accepted' && ($newStatus === 'rejected' || $newStatus === 'applied')) {
                $user->increment('token');
            }
            // If changing TO accepted FROM rejected/applied, decrement token
            elseif (($oldStatus === 'rejected' || $oldStatus === 'applied') && $newStatus === 'accepted') {
                if ($user->token > 0) {
                    $user->decrement('token');
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'User has insufficient tokens to be accepted for this job.'
                    ], 400);
                }
            }
        }

        $applied_job->update([
            'status' => $newStatus
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated successfully',
            'data' => $applied_job->load('job'),
            'job_id' => $applied_job->job_id
        ], 200);
    }

    public function get_rate_employee(Request $request, string $job_id, string $user_id)
    {
        Log::info('get_rate_employee called', ['job_id' => $job_id, 'user_id' => $user_id]);

        $employeer = JWTAuth::user();

        if (!$employeer) {
            Log::warning('get_rate_employee: Not authorized');
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        // Verify that the employer owns the job
        $job = Job::where('id', $job_id)
            ->where('employeer_id', $employeer->id)
            ->first();

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found or you are not authorized to rate users for this job'
            ], 404);
        }

        $rating = Rating::where('user_id', $user_id)
            ->where('job_id', $job_id)
            ->first();

        Log::info('get_rate_employee: Rating query result', ['rating' => $rating]);

        // Return success even if no rating exists - this is normal for first-time ratings
        return response()->json([
            'success' => true,
            'data' => $rating,
            'message' => $rating ? 'Rating found' : 'No rating found'
        ], 200);
    }

    public function rate_employee(Request $request, string $job_id, string $user_id)
    {
        Log::info('rate_employee called', ['job_id' => $job_id, 'user_id' => $user_id, 'request_data' => $request->all()]);

        $employeer = JWTAuth::user();

        if (!$employeer) {
            Log::warning('rate_employee: Not authorized');
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'rating' => ['required', 'string', Rule::in(['1', '2', '3', '4', '5'])],
        ])->validate();

        $job = Job::where('id', $job_id)
            ->where('employeer_id', $employeer->id)
            ->first();

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found or you are not authorized to rate users for this job'
            ], 404);
        }

        if ($job->life_cycle !== 'ended') {
            return response()->json([
                'success' => false,
                'message' => 'Job is not ended yet'
            ], 400);
        }

        // Check if user was actually hired for this job
        $application = ApplyJob::where('job_id', $job_id)
            ->where('user_id', $user_id)
            ->where('status', 'accepted')
            ->first();

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'User was not hired for this job'
            ], 400);
        }

        // Check if rating already exists
        $existingRating = Rating::where('user_id', $user_id)
            ->where('job_id', $job_id)
            ->first();

        if ($existingRating) {
            return response()->json([
                'success' => false,
                'message' => 'Rating already exists for this user. Use update instead.'
            ], 400);
        }

        $rating = Rating::create([
            'user_id' => $user_id,
            'job_id' => $job_id,
            'rating' => $validator['rating'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rating added successfully',
            'data' => $rating
        ], 200);
    }

    public function update_rating(Request $request, string $job_id, string $user_id)
    {
        Log::info('update_rating called', ['job_id' => $job_id, 'user_id' => $user_id, 'request_data' => $request->all()]);

        $employeer = JWTAuth::user();

        if (!$employeer) {
            Log::warning('update_rating: Not authorized');
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'rating' => ['required', 'string', Rule::in(['1', '2', '3', '4', '5'])],
        ])->validate();

        // Verify that the employer owns the job
        $job = Job::where('id', $job_id)
            ->where('employeer_id', $employeer->id)
            ->first();

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found or you are not authorized to rate users for this job'
            ], 404);
        }

        $rating = Rating::where('user_id', $user_id)
            ->where('job_id', $job_id)
            ->first();

        if (!$rating) {
            return response()->json([
                'success' => false,
                'message' => 'Rating not found'
            ], 404);
        }

        $rating->update([
            'rating' => $validator['rating']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rating updated successfully',
            'data' => $rating
        ], 200);
    }

    public function delete_rating(string $job_id, string $user_id)
    {
        $employeer = JWTAuth::user();

        if (!$employeer) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized'
            ], 401);
        }

        // Verify that the employer owns the job
        $job = Job::where('id', $job_id)
            ->where('employeer_id', $employeer->id)
            ->first();

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found or you are not authorized to rate users for this job'
            ], 404);
        }

        $rating = Rating::where('user_id', $user_id)
            ->where('job_id', $job_id)
            ->first();

        if (!$rating) {
            return response()->json([
                'success' => false,
                'message' => 'Rating not found'
            ], 404);
        }

        $rating->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rating deleted successfully'
        ], 200);
    }
}
