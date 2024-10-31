# New App

## Overview

New App is an online platform that allows users to create, manage, and share teaching outlines. Users can easily build structured lesson plans, organize topics, and plan their teaching schedule.

## User Journeys

### 1. Create a New Teaching Outline

1. **Navigate to the Home Page**: When you open the app, you are presented with the home page displaying any existing teaching outlines.
2. **Click 'Create New Outline'**: Click on the 'Create New Outline' button to start a new teaching outline.
3. **Enter Outline Details**:
   - **Title**: Provide a title for your teaching outline.
   - **Description**: Add an overview or summary of the outline.
   - **Add Sections**: Create sections by adding titles and content for each part of your lesson plan.
4. **Save the Outline**: Click the 'Save Outline' button to save your teaching outline.

### 2. View Existing Teaching Outlines

1. **View Outline List**: The home page displays a list of existing teaching outlines.
2. **Select an Outline**: Click on an outline to view its details.
3. **Review Outline**: View the sections and content within the outline.

### 3. Edit a Teaching Outline

1. **Select an Outline to Edit**: From the list of outlines, click the 'Edit' button next to the outline you wish to modify.
2. **Modify Outline Details**: Update the title, description, or content of the sections.
3. **Save Changes**: Click 'Save Changes' to update the outline.

### 4. Delete a Teaching Outline

1. **Select an Outline to Delete**: From the list of outlines, click the 'Delete' button next to the outline you wish to remove.
2. **Confirm Deletion**: Confirm that you want to delete the outline.

## External APIs Used

- **None**

## Environment Variables

- `NEON_DB_URL`: The connection string for the Neon database.

## Notes

This app does not require authentication and is free to use. All data is stored in a Neon database using Drizzle ORM.
