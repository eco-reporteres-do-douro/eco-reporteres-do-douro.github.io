from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import bcrypt
import jwt
import secrets
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from bson import ObjectId

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

def get_jwt_secret():
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Create app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# --- Pydantic Models ---
class LoginRequest(BaseModel):
    email: str
    password: str

class PostCreate(BaseModel):
    title: str
    content: str
    category: str
    excerpt: str = ""
    cover_image: str = ""

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None

class CommentCreate(BaseModel):
    name: str
    message: str
    post_id: Optional[str] = None

class GalleryItemCreate(BaseModel):
    title: str
    description: str = ""
    image_url: str
    category: str = ""

class TimelineEventCreate(BaseModel):
    date: str
    title: str
    description: str

class TeamMemberCreate(BaseModel):
    name: str
    role: str
    description: str = ""
    image_url: str = ""

# --- Auth Routes ---
@api_router.post("/auth/login")
async def login(request: LoginRequest, response: Response):
    email = request.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"id": user_id, "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "admin"), "token": access_token}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

# --- Posts/Works Routes ---
@api_router.get("/posts")
async def get_posts(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    posts = await db.posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return posts

@api_router.get("/posts/{post_id}")
async def get_post(post_id: str):
    post = await db.posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@api_router.post("/posts")
async def create_post(post: PostCreate, request: Request):
    user = await get_current_user(request)
    doc = post.model_dump()
    doc["id"] = secrets.token_urlsafe(8)
    doc["author"] = user.get("name", "Admin")
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.posts.insert_one(doc)
    del doc["_id"]
    return doc

@api_router.put("/posts/{post_id}")
async def update_post(post_id: str, post: PostUpdate, request: Request):
    await get_current_user(request)
    update_data = {k: v for k, v in post.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.posts.update_one({"id": post_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    updated = await db.posts.find_one({"id": post_id}, {"_id": 0})
    return updated

@api_router.delete("/posts/{post_id}")
async def delete_post(post_id: str, request: Request):
    await get_current_user(request)
    result = await db.posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted"}

# --- Categories ---
@api_router.get("/categories")
async def get_categories():
    return [
        {"id": "museu-do-douro", "name": "Museu do Douro", "description": "Trabalhos sobre o Museu do Douro"},
        {"id": "paisagem", "name": "Paisagem", "description": "A paisagem e natureza do Douro"},
        {"id": "gastronomia", "name": "Gastronomia", "description": "Gastronomia e vinhos do Douro"},
        {"id": "historia", "name": "História", "description": "História e tradições do Douro"},
        {"id": "cultura", "name": "Cultura", "description": "Cultura e património do Douro"},
        {"id": "outros", "name": "Outros", "description": "Outros trabalhos e projetos"},
    ]

# --- Comments ---
@api_router.get("/comments")
async def get_comments(post_id: Optional[str] = None):
    query = {}
    if post_id:
        query["post_id"] = post_id
    comments = await db.comments.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return comments

@api_router.post("/comments")
async def create_comment(comment: CommentCreate):
    doc = comment.model_dump()
    doc["id"] = secrets.token_urlsafe(8)
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["approved"] = True
    await db.comments.insert_one(doc)
    del doc["_id"]
    return doc

@api_router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str, request: Request):
    await get_current_user(request)
    result = await db.comments.delete_one({"id": comment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted"}

# --- Gallery ---
@api_router.get("/gallery")
async def get_gallery():
    items = await db.gallery.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return items

@api_router.post("/gallery")
async def create_gallery_item(item: GalleryItemCreate, request: Request):
    await get_current_user(request)
    doc = item.model_dump()
    doc["id"] = secrets.token_urlsafe(8)
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.gallery.insert_one(doc)
    del doc["_id"]
    return doc

@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str, request: Request):
    await get_current_user(request)
    result = await db.gallery.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Gallery item deleted"}

# --- Timeline ---
@api_router.get("/timeline")
async def get_timeline():
    events = await db.timeline.find({}, {"_id": 0}).sort("created_at", 1).to_list(100)
    return events

@api_router.post("/timeline")
async def create_timeline_event(event: TimelineEventCreate, request: Request):
    await get_current_user(request)
    doc = event.model_dump()
    doc["id"] = secrets.token_urlsafe(8)
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.timeline.insert_one(doc)
    del doc["_id"]
    return doc

@api_router.delete("/timeline/{event_id}")
async def delete_timeline_event(event_id: str, request: Request):
    await get_current_user(request)
    result = await db.timeline.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Timeline event deleted"}

# --- Team ---
@api_router.get("/team")
async def get_team():
    members = await db.team.find({}, {"_id": 0}).sort("created_at", 1).to_list(100)
    return members

@api_router.post("/team")
async def create_team_member(member: TeamMemberCreate, request: Request):
    await get_current_user(request)
    doc = member.model_dump()
    doc["id"] = secrets.token_urlsafe(8)
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.team.insert_one(doc)
    del doc["_id"]
    return doc

@api_router.put("/team/{member_id}")
async def update_team_member(member_id: str, member: TeamMemberCreate, request: Request):
    await get_current_user(request)
    update_data = member.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.team.update_one({"id": member_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    updated = await db.team.find_one({"id": member_id}, {"_id": 0})
    return updated

@api_router.delete("/team/{member_id}")
async def delete_team_member(member_id: str, request: Request):
    await get_current_user(request)
    result = await db.team.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"message": "Team member deleted"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Startup event - seed admin & indexes
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.posts.create_index("category")
    await db.posts.create_index("id", unique=True)
    await db.comments.create_index("post_id")
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@douro7e.pt")
    admin_password = os.environ.get("ADMIN_PASSWORD", "douro7e2025")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({"email": admin_email, "password_hash": hashed, "name": "Admin 7.E", "role": "admin", "created_at": datetime.now(timezone.utc).isoformat()})
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")

    # Seed sample data if empty
    post_count = await db.posts.count_documents({})
    if post_count == 0:
        sample_posts = [
            {"id": "bem-vindos", "title": "Bem-vindos ao nosso blogue!", "content": "Este é o blogue da turma 7.E! Aqui vamos partilhar os nossos trabalhos e descobertas sobre o Douro, uma das regiões mais bonitas de Portugal. Acompanhem-nos nesta aventura!", "category": "outros", "excerpt": "Conheçam o nosso projeto sobre o Douro.", "cover_image": "https://images.pexels.com/photos/20095795/pexels-photo-20095795.jpeg", "author": "Turma 7.E", "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": "museu-douro-visita", "title": "A nossa visita ao Museu do Douro", "content": "O Museu do Douro localiza-se em Peso da Régua e é um espaço dedicado à cultura e história da Região Demarcada do Douro. A nossa turma teve a oportunidade de visitar este museu incrível e aprender sobre a história vinhateira da região, a paisagem cultural e as tradições locais.", "category": "museu-do-douro", "excerpt": "Descobrimos a história e cultura no Museu do Douro.", "cover_image": "https://images.pexels.com/photos/34930529/pexels-photo-34930529.jpeg", "author": "Turma 7.E", "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
            {"id": "paisagem-douro", "title": "A paisagem do Douro", "content": "A paisagem do Alto Douro Vinhateiro é Património Mundial da UNESCO desde 2001. Os socalcos, as vinhas em terraços, o rio serpenteando entre as montanhas criam um cenário único no mundo. A nossa turma explorou esta beleza natural e cultural.", "category": "paisagem", "excerpt": "A beleza única do Douro, Património Mundial.", "cover_image": "https://images.pexels.com/photos/32906683/pexels-photo-32906683.jpeg", "author": "Turma 7.E", "created_at": datetime.now(timezone.utc).isoformat(), "updated_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.posts.insert_many(sample_posts)
        logger.info("Sample posts seeded")

    timeline_count = await db.timeline.count_documents({})
    if timeline_count == 0:
        sample_timeline = [
            {"id": "inicio", "date": "Março de 2026", "title": "Início do projeto", "description": "A turma 7.E iniciou o projeto sobre o Douro.", "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": "pesquisa", "date": "Abril de 2026", "title": "Início das pesquisas", "description": "Pesquisa sobre a história, cultura e tradições do Douro.", "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": "visita", "date": "27 de abril de 2026", "title": "Visita ao Museu do Douro", "description": "Visita de estudo ao Museu do Douro.", "created_at": datetime.now(timezone.utc).isoformat()},
            {"id": "blogue", "date": "Maio de 2026", "title": "Lançamento do blogue", "description": "Publicação do blogue com todos os nossos trabalhos.", "created_at": datetime.now(timezone.utc).isoformat()},
        ]
        await db.timeline.insert_many(sample_timeline)
        logger.info("Sample timeline seeded")

    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"# Test Credentials\n\n## Admin\n- Email: {admin_email}\n- Password: {admin_password}\n- Role: admin\n\n## Auth Endpoints\n- POST /api/auth/login\n- GET /api/auth/me\n- POST /api/auth/logout\n")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
