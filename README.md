# New App

## Overview

New App is an online platform that allows users to create, manage, and share teaching outlines. It provides an intuitive interface for educators to build structured lesson plans, organize topics, and plan their teaching schedules effectively.

## User Journeys

### 1. Create a New Teaching Outline

1. **Navigate to the Home Page**: Open the app to view the home page displaying your existing teaching outlines.
2. **Click 'Create New Outline'**: Select the 'Create New Outline' button to start a new teaching outline.
3. **Enter Outline Details**:
   - **Title**: Provide a meaningful title for your teaching outline.
   - **Description**: Add an overview or summary of the outline.
   - **Content**: Input the main content of your outline. You can use Markdown syntax to format the text.
4. **Save the Outline**: Click the 'Save Outline' button to store your teaching outline.
5. **Confirmation**: A confirmation message appears, and the new outline is added to your list.

### 2. View Existing Teaching Outlines

1. **View Outline List**: The home page lists all your teaching outlines.
2. **Select an Outline**: Click on the 'View' button of an outline to see its details.
3. **Review Outline**: The app displays the title, description, and content of the outline in a readable format.

### 3. Edit a Teaching Outline

1. **Select an Outline to Edit**: From the list, click the 'Edit' button next to the outline you wish to modify.
2. **Modify Outline Details**: Update the title, description, or content fields as needed.
3. **Save Changes**: Click 'Save Changes' to update the outline.
4. **Confirmation**: A message confirms that your changes have been saved.

### 4. Delete a Teaching Outline

1. **Select an Outline to Delete**: Click the 'Delete' button next to the outline you want to remove.
2. **Confirm Deletion**: A prompt asks you to confirm the deletion.
3. **Outline Removed**: Upon confirmation, the outline is deleted from your list.

## External APIs Used

- **Progressier**: Used for Progressive Web App (PWA) support, enabling offline access and installation prompts.
- **Sentry**: Implemented for error tracking and logging in both frontend and backend.

## Environment Variables

- `NEON_DB_URL`: The connection string for the Neon database.
- `VITE_PUBLIC_SENTRY_DSN`: The DSN for Sentry error logging.
- `VITE_PUBLIC_APP_ENV`: The environment in which the app is running (e.g., production, development).
- `VITE_PUBLIC_APP_ID`: The unique identifier for the app used by Progressier.

## Notes

- This app does not require authentication and is free to use.
- All data is stored securely in a Neon database using Drizzle ORM.
- Markdown is supported in the content field, allowing for rich text formatting.