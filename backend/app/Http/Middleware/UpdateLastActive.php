<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($user = $request->user()) {
            // 1分以内の連続リクエストでは更新しない
            if (!$user->last_active_at || $user->last_active_at->lt(now()->subMinute())) {
                $user->updateQuietly(['last_active_at' => now()]);
            }
        }

        return $response;
    }
}
