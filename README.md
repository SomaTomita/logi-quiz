## URL

https://logi-quiz.com

- You can enjoy quizzes without logging in — try up to 3 sections as a guest.
- Log in with the credentials below to explore all features including the dashboard and SRS review.

| Role  | Email               | Password    |
| ----- | ------------------- | ----------- |
| User  | example@example.com | password123 |
| Admin | admin@example.com   | password123 |

# Master Your Trade & Logistics Knowledge

A quiz app for easily reviewing international logistics knowledge through spaced repetition and gamified learning.

## Local Development Setup

See [LOCAL_SETUP.md](LOCAL_SETUP.md) for full details.

## Problem Statement

### Target Users

- Junior employees in the international logistics industry
- Junior employees handling production management at manufacturers or trading companies

### User Challenges

| Challenge                               | Solution                                                        |
| --------------------------------------- | --------------------------------------------------------------- |
| Want to learn casually while having fun | Enjoy quizzes without logging in (up to 3 sections as a guest)  |
| Want to make good use of commute time   | 15-second timer per question for focused, efficient sessions     |
| Worried about staying motivated         | Study streak tracking + SRS review to reinforce weak areas      |
| Hard to retain knowledge long-term      | Spaced Repetition System (Leitner box) schedules optimal review |

### Background & Motivation

- Drawing from my experience in the international logistics industry, I built this app to address specific challenges in the field.
- Many junior employees, myself included, struggle with the sheer volume of knowledge they need to absorb while being overwhelmed by daily tasks. I wanted to help alleviate this problem.
- While detailed explanations are available online and in internal shared documents, they only enable ad-hoc responses to customers. In reality, there is a lack of opportunities to proactively study and repeatedly practice this knowledge amidst a busy workload.
- When asked to explain unfamiliar terminology, or when a similar case arises months later, the lack of retained knowledge prevents quick and appropriate customer responses, leading to quality degradation in the field.
- This quiz app helps alleviate this situation by making it fun and easy to review international logistics knowledge in a game-like format.

## Tech Stack

### Backend

- Language: Ruby (v3.2.2)
- Framework: Rails (v7.0.6)
- Testing: RSpec

### Frontend

- Library: React (v18.2.0)
- Language: TypeScript
- UI Components: Material UI (v5)
- Testing: Jest / Playwright (E2E)

### Infrastructure

- Database: MySQL (v8.0.33)
- Containerization: Docker/Docker-compose
- Cloud: AWS (ECR, ECS, EC2, VPC, RDS, ACM, ELB, Route53, CloudWatch)
- Reverse Proxy: Nginx
- Application Hosting: Vercel

### Development Tools

- Version Control: Git/GitHub (simulated team development managed via Issues and Pull Requests)
- Code Editor: VSCode
- API Testing: Postman
- Database Management: Sequel Ace
- Data Modeling: dbdiagram.io
- Flowcharting: diagrams.net

## Features

### User-Facing

- Authentication
  - User registration
  - Login/Logout (token-based authentication)
  - Password reset
- Dashboard
  - Visualization of total play time and correct answers
  - Calendar-based study streak display
  - Recent session history per section
- Quiz
  - Section selection (10 categories)
  - 10 questions per session with 4 choices each
  - 15-second countdown timer per question
  - Results screen with score and full explanations
- SRS Review
  - Leitner-box spaced repetition: questions move up/down boxes based on correctness
  - Review intervals: 1 → 3 → 7 → 14 → 30 days
  - Automatically queues answered questions for optimal review timing
- Contact form (via Google Forms)

### Admin-Facing

- Authentication
  - Admin login/logout (token-based authentication)
- Section Management
  - Create, update, and delete sections
- Quiz Management
  - Create, update, and delete quizzes
- Analytics Dashboard
  - User engagement and learning trend analysis
  - Section-level performance and accuracy breakdown
  - Retention curves and learner segmentation

## ER Diagram

![ER Diagram](frontend/app/public/docs/dbdiagram_ERchart.png)

## Infrastructure Diagram

![Infra Chart](frontend/app/public/docs/diagrams_infra.png)

## Screenshots

### Landing Page

![Home](frontend/app/public/screenshots/user/home.png)

### Sign In

![Sign In](frontend/app/public/screenshots/user/signin.png)

### Sign Up

![Sign Up](frontend/app/public/screenshots/user/signup.png)

### Password Reset

![Password Reset](frontend/app/public/screenshots/user/reset_password.png)

### Section List (Guest)

![Section](frontend/app/public/screenshots/user/section.png)

### Quiz Start

![Quiz](frontend/app/public/screenshots/user/quiz.png)

### Quiz (with Timer)

![Quiz Timer](frontend/app/public/screenshots/user/quiz_timer.png)

### Quiz Result & Explanation

![Explanation](frontend/app/public/screenshots/user/explanation.png)

### Dashboard / Progress

![Dashboard](frontend/app/public/screenshots/user/dashboard_display.png)

### SRS Review

![Review](frontend/app/public/screenshots/user/review.png)

### Admin: Edit Sections

![Edit Section](frontend/app/public/screenshots/admin/edit_section.png)

### Admin: Create Section

![Create Section](frontend/app/public/screenshots/admin/create_section.png)

### Admin: Edit Quizzes

![Edit Quiz](frontend/app/public/screenshots/admin/edit_quiz.png)

### Admin: Create Quiz

![Create Quiz](frontend/app/public/screenshots/admin/create_quiz.png)

### Admin: Update Quiz

![Update Quiz](frontend/app/public/screenshots/admin/update_quiz.png)

### Admin: Delete Quiz

![Delete Quiz](frontend/app/public/screenshots/admin/delete_quiz.png)

### Admin: Analytics Dashboard

![Analytics](frontend/app/public/screenshots/admin/analytics.png)
