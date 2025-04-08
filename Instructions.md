
# Product Requirements Document (PRD)

## Project Overview

This web application provides comprehensive project management capabilities, integrating passwordless authentication, project tracking, task management, document handling, and chat functionalities. A key feature is the ability to interact with project files using Retrieval Augmented Generation (RAG), enhancing productivity and collaboration within project teams.

**Key Objectives:**

- Streamline project workflows by centralizing essential tools
- Enhance team collaboration through integrated chat and document interaction
- Leverage modern technologies for optimal performance and scalability
- Prioritize user experience with simplified authentication flows

**Technologies Used:**

- **Core:** Supabase, OpenAI API, Next.js, React, TypeScript
- **UI/Components:** `shadcn/ui`, Tailwind CSS, React Query, Zod, Lucide React, Recharts, `react-dropzone`, `date-fns`, `react-hook-form`
- **Authentication:** Passwordless magic links via Supabase Auth

---

## Core Functionalities

### 1. Passwordless Authentication

- **Magic Link Authentication:** Users can sign in securely using magic links sent to their email
- **Unified Flow:** Single form that handles both new registrations and returning users
- **User Data Collection:** Captures essential information including email, name, company, and phone
- **Company Association:** Automatically creates and associates companies with users upon first login

**Important Context:**

- **Supabase Auth Integration:** Manages user data, sessions, and magic link functionality
- **Session Persistence:** Ensures users remain logged in across pages
- **Error Handling:** Custom error pages for authentication failures to enhance user experience
- **Callback Route:** Processes authentication tokens and handles user/company setup

---

### 2. Project Dashboard

- **View List of Projects:** Users can see all their projects in a centralized location
- **Create New Projects:** Users can initiate new projects by providing essential details:
  - **Name**
  - **Description**
  - **Start Date**
  - **End Date**
  - **Company Association**
- **Project Details View:** Upon selecting a project, users can access:
  - **Tasks:** View and manage project tasks
  - **Documents:** Upload and view project-related documents
  - **Chat:** Interact with team members and the AI assistant

**Important Context:**

- **React Query:** Efficient data fetching and state management
- **Date Management with `date-fns`:** Handling and formatting project dates
- **UI Components with `shadcn/ui` and Tailwind CSS:** Consistent and responsive design
- **Company Context:** Projects are associated with specific companies

---

### 3. File Management (Core RAG Component)

- **Upload Project-Related Documents:** Users can upload PDFs and DOCX files
- **View Uploaded Documents List:** Access a list of all documents associated with a project
- **Process Uploaded Documents:**
  - **Text Extraction:**
    - **PDFs:** Using `pdf.js`
    - **DOCX Files:** Using `mammoth`
  - **Generate Embeddings:** Utilizing OpenAI's API
  - **Store in Vector Database:** Embeddings are stored using `pgvector` in Supabase

**Important Context:**

- **File Upload with `react-dropzone`:** Provides drag-and-drop functionality and file type restrictions
- **Supabase Storage:** Secure and organized storage of uploaded documents
- **Text Extraction Libraries:** Enable processing of documents for embedding generation
- **Embeddings Storage with `pgvector`:** Facilitates efficient similarity searches

---

### 4. RAG Chat Interface

- **Ask Questions:** Users can query the AI assistant about project documents
- **Receive AI Responses:** Contextual answers based on relevant document content and user queries
- **View Chat History:** Access previous interactions within the current session

**Important Context:**

- **OpenAI API:** Generates AI responses using the GPT model
- **Context Retrieval:** Embeddings enable retrieval of relevant document sections
- **Chat UI Components:** Built with `shadcn/ui` and Tailwind CSS
- **Markdown Rendering:** Displays AI responses in a readable format

---

## Detailed Technical Specifications

### Authentication

- **Libraries and Tools:**
  - **Supabase Auth:** Handles authentication flows and magic links
  - **NextAuth.js Patterns:** Follows similar patterns as NextAuth.js for middleware and protection
- **Configuration:**
  - Environment variables for sensitive data (`.env.local`)
  - Custom callbacks to handle user and company creation
- **User Experience:**
  - **Single Authentication Form:** Collects all necessary information
  - **Protected Routes:** Ensuring only authenticated users can access certain pages
  - **Magic Link Email:** Sends secure one-time login links
- **Error Handling:**
  - Custom error pages for authentication issues

---

### Project Dashboard

- **Data Management:**
  - **React Query:** Handles data fetching and caching
- **UI Components:**
  - **Project List and Creation Forms:** Built with React components and validated with `react-hook-form`
- **Date Handling:**
  - **`date-fns`:** Formats and manipulates date inputs

---

### File Management

- **File Uploads:**
  - **`react-dropzone`:** Enables drag-and-drop uploads with file type and size validations
  - **Accepted Formats:** PDFs (`.pdf`) and Word documents (`.docx`)
  - **Storage Structure:** Files are stored in Supabase Storage, organized by company, project, and user
- **Text Extraction:**
  - **PDFs:** Processed using `pdf.js`
  - **DOCX Files:** Processed using `mammoth`
- **Embeddings Generation:**
  - **OpenAI's `text-embedding-ada-002` Model:** Generates embeddings for text content
  - **Error Handling:** Graceful handling of rate limits and API errors
- **Vector Storage:**
  - **Supabase with `pgvector`:** Stores embeddings for similarity searches
  - **Database Schema:**
    - **Documents Table:** Stores `id`, `content`, and `embedding`
    - **Indexes:** Created on the embedding column for efficient querying

---

### RAG Chat Interface

- **User Queries:**
  - Captured through a chat input component
  - Inputs are sanitized for security
- **Context Retrieval:**
  - **Embeddings for Queries:** Generated to match against stored document embeddings
  - **Similarity Search:** Retrieves relevant document sections
- **Prompt Construction:**
  - Combines retrieved contexts with user queries to form prompts for the AI model
- **AI Response Generation:**
  - **OpenAI API:** Provides responses based on the constructed prompt
  - **Model Used:** GPT-4 or similar
- **Chat UI:**
  - **Components:** Built with `shadcn/ui` and Tailwind CSS for responsiveness
  - **Markdown Support:** Responses rendered using `react-markdown`

---

### Database and Vector Storage

- **Supabase Database:**
  - Primary storage for user data, project details, and embeddings
- **`pgvector` Extension:**
  - Enabled in Supabase to store vector embeddings
  - **Similarity Search Functions:** Custom SQL functions for matching embeddings
- **Company Structure:**
  - Companies table for organization data
  - Company_users table for membership and roles
  - Row-level security policies for proper data isolation

---

### Additional Libraries and Tools

- **Tailwind CSS:** Rapid UI development with utility-first CSS
- **Zod:** Schema validation for TypeScript
- **React Hook Form:** Simplifies form management
- **React Query:** Handles data fetching and caching
- **Date Libraries:** `date-fns` for date manipulation
- **Error Handling Utilities:** Custom error boundaries and notifications

---

## Project File Structure

The project follows Next.js 13+ App Router architecture with a clean and organized structure:

```
project-management-app/
├── .env.local                # Environment variables
├── .gitignore
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.mjs        # PostCSS configuration
├── middleware.ts             # Auth protection middleware
├── README.md                 # Project documentation
├── public/                   # Static assets
│   └── (images, icons, etc.)
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Landing page
│   ├── auth/                 # Authentication related pages
│   │   ├── signin/
│   │   │   └── page.tsx      # Unified sign-in/registration page
│   │   ├── callback/
│   │   │   └── route.ts      # Magic link callback handler
│   │   └── error/
│   │       └── page.tsx      # Auth error page
│   ├── dashboard/            # Main dashboard
│   │   └── page.tsx          # Dashboard home with projects list
│   ├── projects/             # Project-related pages
│   │   ├── [id]/             # Dynamic project routes
│   │   │   ├── page.tsx      # Project details
│   │   │   ├── documents/    # Document management
│   │   │   └── chat/         # RAG chat interface
│   ├── settings/             # User and company settings
│   │   └── page.tsx          # Settings page 
│   └── actions/              # Server actions
│       ├── projects.ts       # Project CRUD operations
│       └── documents.ts      # Document handling operations
├── components/               # Reusable components
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── separator.tsx
│   │   └── ...               # Other UI components
│   ├── navigation/           # Navigation components
│   │   └── nav-bar.tsx       # Main navigation bar
│   ├── providers/            # Context providers
│   │   └── supabase-provider.tsx # Supabase client provider
│   └── project/              # Project-specific components
│       ├── project-list.tsx  # List of projects
│       └── create-project-button.tsx # Project creation
├── lib/                      # Utility functions and configs
│   ├── supabase/             # Supabase related utilities
│   │   ├── server.ts         # Server-side Supabase client
│   │   └── client.ts         # Client-side Supabase helpers
│   ├── utils.ts              # General utility functions
│   └── hooks/                # Custom React hooks
│       └── use-user.ts       # User authentication hook
└── supabase/                 # Supabase configurations
    └── migrations/           # Database migrations
        └── 20240315000000_create_company_tables.sql # Company tables
```

---

## Development Guidelines

### Environment Setup

- **Environment Variables:**
  - Store in a `.env.local` file (not checked into version control)
  - Important variables include:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lvchppwwvvzpjdzgmejs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Y2hwcHd3dnZ6cGpkemdtZWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MjYxOTUsImV4cCI6MjA0NTEwMjE5NX0.u_-nChgLkWInc_XYTFLmHljLqf3eRh2oh4vVW4UxDx8 
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzanJjeW1pbWpmc2ZxYnJ5bWdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDU1ODI5OSwiZXhwIjoyMDQ2MTM0Mjk5fQ.aHME79fmNsvxSy2Ste-_8qz2STIKasgLZsneslJQQes

# OpenAI
OPENAI_API_KEY=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
```

**Security Note:** The `SUPABASE_SERVICE_ROLE_KEY` is sensitive and should be protected.

---

### Authentication

- **Supabase Auth Configuration:**
  - Set up in `middleware.ts` for route protection
  - Uses magic links for passwordless authentication
- **Session Handling:**
  - Implemented via `createMiddlewareClient` in middleware
  - User data is retrieved and available throughout the app
- **Protected Routes:**
  - Middleware redirects unauthenticated users to sign-in page
  - Authenticated users are redirected from auth pages to dashboard

---

### Project Dashboard

- **Project Listing:**
  - Displays all projects associated with the user's company
  - Includes a button for creating new projects
- **Project Details:**
  - Dynamic route showing details for a specific project
  - Integrates tasks, document management, and chat interface

---

### File Management

- **File Upload Component:**
  - Handles file selection and uploading
  - Provides feedback on upload status
- **File List Component:**
  - Displays uploaded documents for a project
  - Allows users to view or download files

---

### Text Extraction and Embedding Generation

- **Utility Functions:**
  - `extractText`: Extracts text from uploaded files
  - `generateEmbedding`: Generates embeddings using OpenAI API
- **Processing Flow:**
  1. User uploads a document
  2. Text is extracted client-side
  3. Text is sent to the serverless function for embedding generation
  4. Embedding is stored in the database

---

### RAG Chat Interface

- **Chat Interface Component:**
  - Captures user queries
  - Displays AI responses
- **Message Handling:**
  - User input is sanitized and sent to the backend
  - Relevant contexts are retrieved based on query embeddings
  - Responses are generated and returned to the frontend

---

### Database and Vector Storage

- **Supabase Configuration:**
  - Database tables for users, companies, projects, documents, and embeddings
- **Vector Storage with `pgvector`:**
  - Enabled via Supabase dashboard
  - Embeddings are stored and indexed for quick retrieval
- **Company Structure:**
  - Multi-company support with proper data isolation
  - User-company associations with role management

---

## Important Context and Considerations

### Error Handling

- **User Feedback:**
  - Provide clear error messages and instructions
  - Use toast notifications for transient messages
- **Global Error Boundaries:**
  - Implement React error boundaries to catch and display errors gracefully

---

### Performance and Scalability

- **Testing:**
  - Conduct performance tests with large datasets
  - Simulate multiple users to ensure scalability
- **Optimization:**
  - Implement caching where appropriate
  - Optimize database queries and indexing

---

### Security and Privacy

- **Data Protection:**
  - Secure handling of user data and documents
  - Compliance with data protection regulations
- **Authentication:**
  - Use of secure magic links instead of passwords
  - Proper session management and expiration

---

### User Experience

- **Responsive Design:**
  - Ensure the application is usable on various devices
- **Accessibility:**
  - Follow best practices to make the app accessible to all users
- **Intuitive Interface:**
  - Keep the UI clean and straightforward
  - Provide helpful guidance and tooltips where necessary

---

## Next Steps and Future Enhancements

- **Team Collaboration Features:**
  - Add user invitation system for companies
  - Implement role-based permissions
- **Advanced Document Processing:**
  - Support for more document types (Excel, images with OCR)
  - Improved document chunking strategies for better RAG
- **Analytics Dashboard:**
  - Project progress tracking
  - Team productivity metrics
- **Mobile Application:**
  - Native mobile experience with React Native
  - Push notifications for important updates

---

## Conclusion

This PRD outlines the comprehensive requirements and technical specifications for the project management application. The system provides a streamlined, secure experience with passwordless authentication and powerful project management capabilities, enhanced by AI-powered document interaction.