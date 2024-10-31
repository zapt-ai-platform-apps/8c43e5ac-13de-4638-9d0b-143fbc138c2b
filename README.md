# New App

## Overview

**New App** is an online platform designed for teachers to create and manage courses and lessons, and for students to enroll and learn at their own pace. The app supports rich text content with Markdown, ensuring that lessons are engaging and well-formatted. Users must sign in to access the platform's features.

## User Journeys

### 1. Sign Up / Sign In

1. **Access the App**: Visit the application URL.
2. **Sign in with ZAPT**: Click on "Sign in with ZAPT" to open the authentication modal.
3. **Enter Credentials**: Provide your email address to receive a magic link or use social login providers ('Google', 'Facebook', 'Apple').
4. **Verify and Login**: Follow the instructions sent to your email to complete the login process.

### 2. Explore Available Courses (Students)

1. **Browse Courses**: After signing in, view the list of all available courses created by teachers.
2. **View Course Details**: Click on a course to see more information, including the description and lesson list.
3. **Enroll in Course**: Click 'View' to access the course content and start learning.

### 3. Create a New Course (Teachers)

1. **Navigate to Dashboard**: After signing in, you are directed to the dashboard displaying available courses.
2. **Click 'Create New Course'**: Start a new course by clicking the button.
3. **Enter Course Details**:
   - **Title**: Provide a title for your course.
   - **Description**: Add an overview or summary.
4. **Save the Course**: Click 'Save Course' to add it to the platform.

### 4. Add Lessons to a Course (Teachers)

1. **Select Your Course**: From the dashboard, choose your course to add lessons.
2. **Click 'Add Lesson'**: Begin creating a new lesson.
3. **Enter Lesson Details**:
   - **Title**: Provide a title for the lesson.
   - **Content**: Add lesson content using Markdown for rich formatting.
4. **Save the Lesson**: Click 'Save Lesson' to add it to the course.

### 5. Access Lessons (Students)

1. **Select a Course**: Choose a course from the available courses.
2. **View Lessons**: Access the list of lessons within the course.
3. **Read Lesson Content**: Click on a lesson to view its content formatted in Markdown.

### 6. Edit or Delete Courses and Lessons (Teachers)

1. **Manage Courses**: From the dashboard, view your courses.
2. **Edit or Delete Course**:
   - **Edit**: Click 'Edit' next to your course to update information.
   - **Delete**: Click 'Delete' to remove the course.
3. **Manage Lessons**: Within a course, view the lessons.
4. **Edit or Delete Lesson**:
   - **Edit**: Click 'Edit' next to the lesson to update content.
   - **Delete**: Click 'Delete' to remove the lesson.

## External APIs Used

- **Supabase Authentication**: Handles user authentication and session management.
- **Sentry**: Used for error tracking and monitoring.

## Environment Variables

- `NEON_DB_URL`: Connection string for the Neon database.
- `VITE_PUBLIC_SENTRY_DSN`: Sentry DSN for error tracking.
- `VITE_PUBLIC_APP_ENV`: App environment (e.g., production, development).
- `VITE_PUBLIC_APP_ID`: Public app ID for the application.

## Notes

- Authentication is required to access and interact with the platform.
- The platform uses Markdown for rich text content in lessons.
- Teachers can only edit or delete courses and lessons they have created.
- Data is stored securely using a Neon database with Drizzle ORM.
- The app is free to use and open to all users.