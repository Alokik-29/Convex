from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, rooms, websocket
from middleware.rate_limit import RateLimitMiddleware

app = FastAPI(title="Convex", version="1.0.0")
app.add_middleware(RateLimitMiddleware, max_requests=30, window_seconds=60)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(rooms.router)
app.include_router(websocket.router)

@app.get("/")
async def root():
    return {"message": "Welcome to ChatSphere!"}