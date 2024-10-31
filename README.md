# New App

## Overview

New App is an online teaching platform that allows educators to create and manage courses with ease. Students can browse available courses, enroll, and access lesson content. The platform supports rich content formatting using Markdown and requires users to sign in to access its features.

## User Journeys

### 1. Sign Up / Sign In

1. **Access the App**: Visit the application URL.
2. **Sign In with ZAPT**: Click on "Sign in with ZAPT" to open the authentication modal.
3. **Enter Credentials**: Provide your email address to receive a magic link or use social login providers ('Google', 'Facebook', 'Apple').
4. **Verify and Login**: Follow the instructions sent to your email to complete the login process.

### 2. Create a New Course (Teachers)

1. **Navigate to Dashboard**: After signing in, you are directed to the dashboard displaying available courses.
2. **Click 'Create New Course'**: Start a new course by clicking the button.
3. **Enter Course Details**:
   - **Title**: Provide a title for your course.
   - **Description**: Add an overview or summary.
4. **Save the Course**: Click 'Save Course' to add it to your list.

### 3. Add Lessons to a Course (Teachers)

1. **Select a Course**: From your courses list, choose a course to add lessons to.
2. **Click 'Add Lesson'**: Begin creating a new lesson.
3. **Enter Lesson Details**:
   - **Title**: Provide a title for the lesson.
   - **Content**: Add lesson content using Markdown for rich formatting.
4. **Save the Lesson**: Click 'Save Lesson' to add it to the course.

### 4. View and Enroll in Courses (Students)

1. **Browse Courses**: After signing in, view the list of all available courses.
2. **View Course Details**: Click on a course to see more information.
3. **Enroll in Course**: Click 'Enroll' to enroll in the course and access its lessons.

### 5. Access Lessons (Students)

1. **Navigate to 'My Courses'**: View the courses you are enrolled in.
2. **Select a Course**: Choose a course to study.
3. **View Lessons**: Access the list of lessons within the course.
4. **Read Lesson Content**: Click on a lesson to view its content.

### 6. Edit or Delete Courses and Lessons (Teachers)

1. **Manage Courses**: From the dashboard, view your courses.
2. **Edit or Delete**: Use the 'Edit' or 'Delete' buttons next to each course or lesson.
3. **Save Changes**: For edits, update the information and save changes. Confirm deletion when prompted.

## External APIs Used

- **Supabase Authentication**: Handles user authentication and session management.

## Environment Variables

- `NEON_DB_URL`: Connection string for the Neon database.
- `VITE_PUBLIC_SENTRY_DSN`: Sentry DSN for error tracking.
- `VITE_PUBLIC_APP_ENV`: App environment (e.g., production, development).
- `VITE_PUBLIC_APP_ID`: Public app ID for the application.

## Notes

- Authentication is required to access and interact with the platform.
- The platform uses Markdown for rich text content in lessons.
- Data is stored securely using a Neon database with Drizzle ORM.
- The app is free to use and open to all users.
- Sentry is used for error tracking on both frontend and backend.
