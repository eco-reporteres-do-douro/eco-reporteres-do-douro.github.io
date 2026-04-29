"""Backend tests for Douro 7.E Blog API"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture(scope="module")
def auth_token():
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@douro7e.pt",
        "password": "douro7e2025"
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    return response.json().get("token")

@pytest.fixture(scope="module")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}

# --- Auth Tests ---
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "admin@douro7e.pt", "password": "douro7e2025"})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data
        assert data["email"] == "admin@douro7e.pt"
        assert data["role"] == "admin"

    def test_login_invalid(self):
        r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "admin@douro7e.pt", "password": "wrong"})
        assert r.status_code == 401

    def test_get_me(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == "admin@douro7e.pt"

    def test_get_me_no_auth(self):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

# --- Posts Tests ---
class TestPosts:
    def test_get_posts(self):
        r = requests.get(f"{BASE_URL}/api/posts")
        assert r.status_code == 200
        assert isinstance(r.json(), list)
        assert len(r.json()) >= 3  # seeded data

    def test_get_posts_by_category(self):
        r = requests.get(f"{BASE_URL}/api/posts?category=paisagem")
        assert r.status_code == 200
        data = r.json()
        for post in data:
            assert post["category"] == "paisagem"

    def test_get_single_post(self):
        r = requests.get(f"{BASE_URL}/api/posts/paisagem-douro")
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == "paisagem-douro"
        assert "title" in data
        assert "content" in data

    def test_post_not_found(self):
        r = requests.get(f"{BASE_URL}/api/posts/nonexistent-id-xyz")
        assert r.status_code == 404

    def test_create_post(self, auth_headers):
        payload = {"title": "TEST_Post", "content": "Test content", "category": "outros", "excerpt": "test"}
        r = requests.post(f"{BASE_URL}/api/posts", json=payload, headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["title"] == "TEST_Post"
        assert "id" in data
        # Cleanup
        requests.delete(f"{BASE_URL}/api/posts/{data['id']}", headers=auth_headers)

    def test_create_post_no_auth(self):
        r = requests.post(f"{BASE_URL}/api/posts", json={"title": "fail", "content": "x", "category": "outros"})
        assert r.status_code == 401

# --- Categories ---
class TestCategories:
    def test_get_categories(self):
        r = requests.get(f"{BASE_URL}/api/categories")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 5
        ids = [c["id"] for c in data]
        for expected in ["museu-do-douro", "paisagem", "gastronomia", "historia", "cultura"]:
            assert expected in ids

# --- Comments ---
class TestComments:
    def test_get_comments(self):
        r = requests.get(f"{BASE_URL}/api/comments")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_comment(self):
        payload = {"name": "TEST_User", "message": "Test comment", "post_id": "bem-vindos"}
        r = requests.post(f"{BASE_URL}/api/comments", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_User"
        assert data["approved"] == True
        assert "id" in data
        # Cleanup
        auth = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "admin@douro7e.pt", "password": "douro7e2025"}).json()
        requests.delete(f"{BASE_URL}/api/comments/{data['id']}", headers={"Authorization": f"Bearer {auth['token']}"})

# --- Gallery ---
class TestGallery:
    def test_get_gallery(self):
        r = requests.get(f"{BASE_URL}/api/gallery")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_gallery_item(self, auth_headers):
        payload = {"title": "TEST_Image", "image_url": "https://example.com/img.jpg", "description": "test"}
        r = requests.post(f"{BASE_URL}/api/gallery", json=payload, headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["title"] == "TEST_Image"
        requests.delete(f"{BASE_URL}/api/gallery/{data['id']}", headers=auth_headers)

# --- Timeline ---
class TestTimeline:
    def test_get_timeline(self):
        r = requests.get(f"{BASE_URL}/api/timeline")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 4  # seeded data

    def test_create_timeline_event(self, auth_headers):
        payload = {"date": "2026-01-01", "title": "TEST_Event", "description": "Test"}
        r = requests.post(f"{BASE_URL}/api/timeline", json=payload, headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["title"] == "TEST_Event"
        requests.delete(f"{BASE_URL}/api/timeline/{data['id']}", headers=auth_headers)

# --- Team ---
class TestTeam:
    def test_get_team(self):
        r = requests.get(f"{BASE_URL}/api/team")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_team_member(self, auth_headers):
        payload = {"name": "TEST_Member", "role": "Aluno", "description": "test"}
        r = requests.post(f"{BASE_URL}/api/team", json=payload, headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_Member"
        requests.delete(f"{BASE_URL}/api/team/{data['id']}", headers=auth_headers)
