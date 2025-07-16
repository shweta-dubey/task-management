# Task Management Application

A modern, responsive task management application built with **Next.js**, **Redux Toolkit**, **Material-UI**, and **React Hook Form**. This application demonstrates best practices in React development, state management, and user interface design.

## 🚀 Features

### Core Functionality

- ✅ **Create, Read, Update, Delete (CRUD) Tasks**
- ✅ **Task Completion Toggle**
- ✅ **Search and Filter Tasks**
- ✅ **Priority Management** (Low, Medium, High)
- ✅ **Due Date Tracking** with overdue indicators
- ✅ **Persistent Storage** using localStorage
- ✅ **Server-Side Rendering** for initial page load

### Technical Features

- ✅ **Redux Toolkit** for state management
- ✅ **React Hook Form** with validation
- ✅ **Material-UI** components with custom theming
- ✅ **TypeScript** for type safety
- ✅ **Mock API** using Next.js API routes
- ✅ **Loading states** and error handling
- ✅ **Responsive design** for all screen sizes

### User Experience

- ✅ **Modern UI/UX** with Material Design
- ✅ **Smooth animations** and transitions
- ✅ **Confirmation dialogs** for destructive actions
- ✅ **Real-time search** and filtering
- ✅ **Visual priority indicators**
- ✅ **Floating action button** for quick task creation

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.5 (Pages Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) v5
- **Form Handling**: React Hook Form with Yup validation
- **Date Handling**: Day.js with MUI Date Picker
- **Styling**: Material-UI theming + Custom CSS

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd task-management
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TaskCard.tsx    # Individual task display
│   ├── TaskForm.tsx    # Task creation/editing form
│   ├── TaskFilters.tsx # Search and filter controls
│   ├── Layout.tsx      # Main layout wrapper
│   ├── ConfirmDialog.tsx # Confirmation modal
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── EmptyState.tsx  # Empty state display
├── pages/              # Next.js pages
│   ├── index.tsx       # Main task list page
│   ├── _app.tsx        # App configuration
│   └── api/            # API routes
│       └── tasks/      # Task-related endpoints
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   └── taskSlice.ts    # Task state management
├── types/              # TypeScript type definitions
│   └── task.ts         # Task-related types
├── utils/              # Utility functions
│   └── localStorage.ts # Local storage helpers
└── styles/             # Global styles
    └── globals.css     # Global CSS
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#1976d2)
- **Secondary**: Pink (#dc004e)
- **Success**: Green (for low priority)
- **Warning**: Orange (for medium priority)
- **Error**: Red (for high priority)

### Typography

- **Font Family**: Roboto, Helvetica, Arial
- **Headings**: Semi-bold weights
- **Body**: Regular weights

### Components

- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: Rounded corners (8px), no text transform
- **Form Fields**: Rounded corners (8px), consistent spacing

## 🔧 API Endpoints

### GET /api/tasks

- Returns all tasks
- Supports server-side rendering

### POST /api/tasks

- Creates a new task
- Requires: name, description, priority, dueDate

### PUT /api/tasks/[id]

- Updates an existing task
- Supports partial updates

### DELETE /api/tasks/[id]

- Deletes a task by ID
- Returns confirmation message

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- **Desktop**: 3-column grid layout
- **Tablet**: 2-column grid layout
- **Mobile**: Single-column layout

## 🎯 Key Features Explained

### Task Management

- **Create**: Full form with validation for all required fields
- **Edit**: Pre-populated form with existing task data
- **Delete**: Confirmation dialog to prevent accidental deletion
- **Complete**: One-click toggle with visual feedback

### Search & Filter

- **Real-time search**: Searches both task name and description
- **Priority filter**: Filter by specific priority levels
- **Combined filtering**: Search and priority filters work together

### Data Persistence

- **localStorage**: Tasks persist between browser sessions
- **Mock API**: Simulates real API calls with delays
- **Error handling**: Graceful error messages for failed operations

### User Experience

- **Loading states**: Spinners during API calls
- **Empty states**: Helpful messages when no tasks exist
- **Confirmation dialogs**: Prevent accidental destructive actions
- **Snackbar notifications**: Success and error messages

## 🚀 Performance Optimizations

- **Server-Side Rendering**: Fast initial page load
- **Code Splitting**: Automatic code splitting by Next.js
- **Memoization**: useMemo for expensive computations
- **Optimized Re-renders**: Efficient Redux state updates

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting with Next.js rules
- **Consistent formatting**: Prettier-compatible code style

## 📋 Task Form Validation

- **Task Name**: Required, minimum 3 characters
- **Description**: Required, minimum 10 characters
- **Priority**: Required, must be low/medium/high
- **Due Date**: Required, must be in the future

## 🎨 UI Components

### TaskCard

- Displays task information in a card format
- Shows priority, due date, and completion status
- Includes edit and delete actions
- Visual indicators for overdue tasks

### TaskForm

- Modal dialog for creating/editing tasks
- Full form validation with error messages
- Date picker integration
- Loading states during submission

### TaskFilters

- Search input with real-time filtering
- Priority dropdown filter
- Task statistics display (total, completed, pending)

## 🔮 Future Enhancements

- **Categories/Tags**: Organize tasks by category
- **Drag & Drop**: Reorder tasks by priority
- **Dark Mode**: Theme switching capability
- **Export/Import**: Backup and restore functionality
- **Notifications**: Browser notifications for due tasks
- **Collaboration**: Multi-user support


**Built with ❤️ using Next.js, Redux Toolkit, and Material-UI**
