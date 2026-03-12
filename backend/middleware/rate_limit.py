from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import time

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 30, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}

    async def dispatch(self, request: Request, call_next):
        # only rate limit message-related endpoints
        if not request.url.path.startswith("/auth"):
            client_ip = request.client.host
            now = time.time()

            if client_ip not in self.requests:
                self.requests[client_ip] = []

            # remove old requests outside the window
            self.requests[client_ip] = [
                t for t in self.requests[client_ip]
                if now - t < self.window_seconds
            ]

            if len(self.requests[client_ip]) >= self.max_requests:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Slow down!"}
                )

            self.requests[client_ip].append(now)

        return await call_next(request)