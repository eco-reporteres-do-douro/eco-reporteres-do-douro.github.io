# Douro 7.E Blog - PRD

## Problem Statement
Blog about the Douro region for school class 7.E. Portuguese language. Colors: #722F37 (wine), #7C3A00 (brown). Published blog with organized content about Douro, Museu do Douro, etc.

## Architecture
- **Backend**: FastAPI + MongoDB (motor async driver)
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Auth**: JWT (bcrypt + PyJWT) with httpOnly cookies + Bearer token
- **Database**: MongoDB with collections: users, posts, comments, gallery, timeline, team

## User Personas
1. **Visitors**: View blog posts, gallery, timeline, team. Leave comments.
2. **Admin (Team 7.E)**: Login to manage all content (posts, gallery, timeline, team members, comments).

## Core Requirements
- Home page with hero, themes preview, about preview
- About Us page with class description
- Works/Posts organized by theme categories
- Photo Gallery (masonry layout)
- Timeline/Chronology of the project
- Team/Contacts page
- Comment system on posts
- Admin dashboard for content management

## What's Been Implemented (2025-12-01)
- Full backend API with auth, CRUD for posts/gallery/timeline/team/comments
- Admin seeding with sample data (3 posts, 4 timeline events)
- Complete frontend with all pages and navigation
- Editorial design with Playfair Display + Work Sans
- Bento grid for themes, glassmorphism header
- Admin dashboard with tabbed interface
- Comment form on post pages
- Category-based filtering for works
- Responsive design (mobile + desktop)

## Categories
- museu-do-douro, paisagem, gastronomia, historia, cultura, outros

## Prioritized Backlog
### P0 (Done)
- [x] Home page, About, Works, Gallery, Timeline, Team, Login, Admin

### P1
- [ ] Image upload (instead of URL paste)
- [ ] Rich text editor for posts
- [ ] SEO metadata per post

### P2
- [ ] Social sharing buttons
- [ ] Newsletter subscription
- [ ] Search functionality
- [ ] Comment moderation (approve/reject)

## Next Tasks
- Add more real content (team members, gallery images)
- Consider adding image upload functionality
- Add social sharing for posts
