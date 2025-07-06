<?php

namespace App\Http\Controllers\Comment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Models\Job;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentController extends Controller
{
    public function index(string $job_id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make(['job_id' => $job_id], [
            'job_id' => ['required'],
        ])->validate();

        $comments = Comment::query()
            ->join('users', 'comments.user_id', '=', 'users.id')
            ->where('comments.job_id', $validator['job_id'])
            ->whereNotNull('comments.user_id')
            ->select(
                DB::raw("CONCAT(users.last_name, ', ', users.first_name) as full_name"),
                'comments.*'
            )
            ->get();

        return response()->json([
            'success' => true,
            'message' => $comments->isEmpty() ? 'No comments found on job ' . $validator['job_id'] : 'Comments on job ' . $validator['job_id'] . ' fetched successfully',
            'data' => $comments,
        ], 200);
    }

    public function store(Request $request)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'job_id' => ['required', 'exists:jobs,id'],
            'comments' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'error' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $job = Job::find($validated['job_id']);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found',
            ], 404);
        }

        $comment = Comment::create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'comment' => $validated['comments'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment created successfully',
            'data' => $comment,
        ], 201);
    }

    public function destroy_comment_post_owner(string $comment_id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make(['comment_id' => $comment_id], [
            'comment_id' => ['required'],
        ])->validate();

        $comment = DB::table('jobs')
            ->join('comments', 'jobs.id', '=', 'comments.job_id')
            ->select('jobs.employeer_id', 'comments.id')
            ->where('comments.id', $validator['comment_id'])
            ->where('jobs.employeer_id', $user->id)
            ->groupBy('jobs.employeer_id', 'comments.id')
            ->first();

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found or you are not the owner of the comment',
            ], 404);
        }

        if ($comment->employeer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete a comment on a job you do not own',
            ], 403);
        }

        Comment::where('id', $validator['comment_id'])->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment soft deleted successfully',
        ], 200);
    }

    public function destroy(string $id)
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make(['id' => $id], [
            'id' => ['required'],
        ])->validate();

        $comment = Comment::where('user_id', $user->id)
            ->where('id', $validator['id'])
            ->first();

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found or you are not the owner of the comment',
            ], 404);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment soft deleted successfully',
        ], 200);
    }
}
