# Product Requirements Document (PRD)

## Project Overview

This web application is designed to provide comprehensive project management capabilities, integrating user authentication, project tracking, task management, document handling, and chat functionalities. A key feature is the ability to interact with project files using Retrieval Augmented Generation (RAG), enhancing productivity and collaboration within project teams.

**Key Objectives:**

- Streamline project workflows by centralizing essential tools.
- Enhance team collaboration through integrated chat and document interaction.
- Leverage modern technologies for optimal performance and scalability.

**Technologies Used:**

- **Core:** Supabase, OpenAI API, Next.js, React, TypeScript
- **UI/Components:** `shadcn/ui`, Tailwind CSS, React Query, Zod, Lucide React, Recharts, `react-dropzone`, `date-fns`, `react-hook-form`

---

## Core Functionalities

### 1. User Authentication

- **Simple User Login:** Users can log in securely using their Google accounts via NextAuth.js.
- **Session Management:** Persistent user sessions across the application to ensure a seamless experience.

**Important Context:**

- **NextAuth.js with Google Provider:** Facilitates secure authentication.
- **Supabase Auth Integration:** Manages user data and sessions.
- **Session Persistence:** Achieved using NextAuth's session management, ensuring users remain logged in across pages.
- **Error Handling:** Custom error pages for authentication failures to enhance user experience.

---

### 2. Project Dashboard

- **View List of Projects:** Users can see all their projects in a centralized location.
- **Create New Projects:** Users can initiate new projects by providing essential details:
  - **Name**
  - **Description**
  - **Start Date**
  - **End Date**
- **Project Details View:** Upon selecting a project, users can access:
  - **Tasks:** View and manage project tasks.
  - **Documents:** Upload and view project-related documents.
  - **Chat:** Interact with team members and the AI assistant.

**Important Context:**

- **React Query:** Efficient data fetching and state management.
- **Date Management with `date-fns`:** Handling and formatting project dates.
- **UI Components with `shadcn/ui` and Tailwind CSS:** Consistent and responsive design.

---

### 3. File Management (Core RAG Component)

- **Upload Project-Related Documents:** Users can upload PDFs and DOCX files.
- **View Uploaded Documents List:** Access a list of all documents associated with a project.
- **Process Uploaded Documents:**
  - **Text Extraction:**
    - **PDFs:** Using `pdf.js`
    - **DOCX Files:** Using `mammoth`
  - **Generate Embeddings:** Utilizing OpenAI's API.
  - **Store in Vector Database:** Embeddings are stored using `pgvector` in Supabase.

**Important Context:**

- **File Upload with `react-dropzone`:** Provides drag-and-drop functionality and file type restrictions.
- **Supabase Storage:** Secure and organized storage of uploaded documents.
- **Text Extraction Libraries:** Enable processing of documents for embedding generation.
- **Embeddings Storage with `pgvector`:** Facilitates efficient similarity searches.

---

### 4. RAG Chat Interface

- **Ask Questions:** Users can query the AI assistant about project documents.
- **Receive AI Responses:** Contextual answers based on relevant document content and user queries.
- **View Chat History:** Access previous interactions within the current session.

**Important Context:**

- **OpenAI API:** Generates AI responses using the GPT model.
- **Context Retrieval:** Embeddings enable retrieval of relevant document sections.
- **Chat UI Components:** Built with `shadcn/ui`, Tailwind CSS, and `@tanstack/react-virtual` for performance.
- **Markdown Rendering:** `react-markdown` displays AI responses in a readable format.

---

## Detailed Technical Specifications

### Authentication

- **Libraries and Tools:**
  - **NextAuth.js:** Manages authentication flows.
  - **Supabase Adapter:** Integrates NextAuth with Supabase Auth.
- **Configuration:**
  - Environment variables for sensitive data (`.env.local`).
  - Custom callbacks to include user ID in sessions.
- **User Experience:**
  - **Sign-In and Sign-Out Buttons:** Implemented in UI components.
  - **Protected Routes:** Ensuring only authenticated users can access certain pages.
- **Error Handling:**
  - Custom error pages for authentication issues.

---

### Project Dashboard

- **Data Management:**
  - **React Query:** Handles data fetching and caching.
- **UI Components:**
  - **Project List and Creation Forms:** Built with React components and validated with `react-hook-form` and `Zod`.
- **Date Handling:**
  - **`date-fns`:** Formats and manipulates date inputs.

---

### File Management

- **File Uploads:**
  - **`react-dropzone`:** Enables drag-and-drop uploads with file type and size validations.
  - **Accepted Formats:** PDFs (`.pdf`) and Word documents (`.docx`).
  - **Storage Structure:** Files are stored in Supabase Storage, organized by `userId` and `projectId`.
- **Text Extraction:**
  - **PDFs:** Processed using `pdf.js`.
  - **DOCX Files:** Processed using `mammoth`.
- **Embeddings Generation:**
  - **OpenAI's `text-embedding-ada-002` Model:** Generates embeddings for text content.
  - **Error Handling:** Graceful handling of rate limits and API errors.
- **Vector Storage:**
  - **Supabase with `pgvector`:** Stores embeddings for similarity searches.
  - **Database Schema:**
    - **Documents Table:** Stores `id`, `content`, and `embedding`.
    - **Indexes:** Created on the embedding column for efficient querying.

---

### RAG Chat Interface

- **User Queries:**
  - Captured through a chat input component.
  - Inputs are sanitized using libraries like `DOMPurify`.
- **Context Retrieval:**
  - **Embeddings for Queries:** Generated to match against stored document embeddings.
  - **Similarity Search:** Retrieves relevant document sections.
- **Prompt Construction:**
  - Combines retrieved contexts with user queries to form prompts for the AI model.
- **AI Response Generation:**
  - **OpenAI API:** Provides responses based on the constructed prompt.
  - **Model Used:** `text-davinci-003` or similar.
- **Chat UI:**
  - **Components:** Built with `shadcn/ui` and Tailwind CSS for responsiveness.
  - **Virtualization:** Utilizes `@tanstack/react-virtual` for performance with large chat histories.
  - **Markdown Support:** Responses rendered using `react-markdown`.

---

### Database and Vector Storage

- **Supabase Database:**
  - Primary storage for user data, project details, and embeddings.
- **`pgvector` Extension:**
  - Enabled in Supabase to store vector embeddings.
  - **Similarity Search Functions:** Custom SQL functions for matching embeddings.

---

### Additional Libraries and Tools

- **Tailwind CSS:** Rapid UI development with utility-first CSS.
- **Zod:** Schema validation for TypeScript.
- **React Hook Form:** Simplifies form management.
- **SWR/React Query:** Handles data fetching and caching.
- **Date Libraries:** `date-fns` for date manipulation.
- **Error Handling Utilities:** Custom error boundaries and notifications.

---

## Project File Structure

To maintain clarity and scalability, the project is structured as follows:

```
your-project/
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── README.md
├── public/
│   └── (Static assets like images and icons)
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].ts
│   │   ├── files/
│   │   │   └── upload.ts
│   │   ├── embeddings/
│   │   │   └── generate.ts
│   │   └── chat/
│   │       └── query.ts
│   └── projects/
│       ├── index.tsx
│       └── [projectId].tsx
├── components/
│   ├── AuthButtons.tsx
│   ├── FileUpload.tsx
│   ├── FileList.tsx
│   ├── ChatInterface.tsx
│   ├── ProjectCard.tsx
│   └── (Other shared components)
├── lib/
│   ├── supabaseClient.ts
│   ├── openaiClient.ts
│   ├── utility.ts
│   └── (Other utility functions)
├── styles/
│   └── globals.css
```

**Explanation:**

- **Root Files:** Essential configuration and metadata files for the project.
- **`public/`:** Stores static assets accessible during build time.
- **`pages/`:** Contains Next.js pages and API routes.
  - **`_app.tsx` and `_document.tsx`:** Custom components for initializing pages and augmenting the app's HTML structure.
  - **`index.tsx`:** The main landing page or dashboard redirect.
  - **`api/`:** Serverless functions handling backend operations like authentication and data processing.
  - **`projects/`:** Pages related to project listing and details.
- **`components/`:** Reusable UI components used across multiple pages.
- **`lib/`:** Utility modules and configurations for external services.
- **`styles/`:** Global styling files, including Tailwind CSS configurations.

---

## Development Guidelines

### Environment Setup

- **Environment Variables:**
  - Store in a `.env.local` file (not checked into version control).
  - Important variables include:
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lvchppwwvvzpjdzgmejs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Y2hwcHd3dnZ6cGpkemdtZWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MjYxOTUsImV4cCI6MjA0NTEwMjE5NX0.u_-nChgLkWInc_XYTFLmHljLqf3eRh2oh4vVW4UxDx8 
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzanJjeW1pbWpmc2ZxYnJ5bWdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDU1ODI5OSwiZXhwIjoyMDQ2MTM0Mjk5fQ.aHME79fmNsvxSy2Ste-_8qz2STIKasgLZsneslJQQes

# Google Authentication
GOOGLE_CLIENT_ID=823079035197-2sa3g9phmuktq4b92rge97qa4qlpdbu1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=uOukEMbAket2jw/3Y2cAr7G5JroGcXVmA+wJwVPykII=

# OpenAI
OPENAI_API_KEY=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


**Security Note:** The `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` are sensitive and should be protected.

---

### Authentication

- **NextAuth.js Configuration:**
  - Set up in `pages/api/auth/[...nextauth].ts`.
  - Uses the Google provider and Supabase adapter.
- **Session Handling:**
  - Implemented via `SessionProvider` in `_app.tsx`.
  - User ID is included in the session for easy access.
- **Protected Routes:**
  - Utilize `getSession` in `getServerSideProps` to protect pages.

---

### Project Dashboard

- **Project Listing (`pages/projects/index.tsx`):**
  - Displays all projects associated with the user.
  - Includes a form for creating new projects.
- **Project Details (`pages/projects/[projectId].tsx`):**
  - Dynamic route showing details for a specific project.
  - Integrates tasks, document management, and chat interface.

---

### File Management

- **File Upload Component (`components/FileUpload.tsx`):**
  - Handles file selection and uploading.
  - Provides feedback on upload status.
- **File List Component (`components/FileList.tsx`):**
  - Displays uploaded documents for a project.
  - Allows users to view or download files.

---

### Text Extraction and Embedding Generation

- **Utility Functions (`lib/utility.ts`):**
  - `extractText`: Extracts text from uploaded files.
  - `generateEmbedding`: Generates embeddings using OpenAI API.
- **Processing Flow:**
  1. User uploads a document.
  2. Text is extracted client-side.
  3. Text is sent to the serverless function for embedding generation.
  4. Embedding is stored in the database.

---

### RAG Chat Interface

- **Chat Interface Component (`components/ChatInterface.tsx`):**
  - Captures user queries.
  - Displays AI responses.
- **Message Handling:**
  - User input is sanitized and sent to the backend.
  - Relevant contexts are retrieved based on query embeddings.
  - Responses are generated and returned to the frontend.
- **Performance Optimization:**
  - Uses `@tanstack/react-virtual` to efficiently render chat history.

---

### Database and Vector Storage

- **Supabase Configuration:**
  - Database tables for users, projects, documents, and embeddings.
- **Vector Storage with `pgvector`:**
  - Enabled via Supabase dashboard.
  - Embeddings are stored and indexed for quick retrieval.
- **Similarity Search Functions:**
  - Custom SQL functions facilitate efficient querying.

---

### Additional Tools and Libraries

- **Form Handling with `react-hook-form` and `Zod`:**
  - Simplifies form state management and validation.
- **Data Fetching with React Query:**
  - Optimizes data retrieval and caching.
- **Date Management with `date-fns`:**
  - Handles formatting and manipulation of date fields.

---

## Important Context and Considerations

### Error Handling

- **User Feedback:**
  - Provide clear error messages and instructions.
  - Use toast notifications for transient messages.
- **Global Error Boundaries:**
  - Implement React error boundaries to catch and display errors gracefully.

---

### Performance and Scalability

- **Testing:**
  - Conduct performance tests with large datasets.
  - Simulate multiple users to ensure scalability.
- **Optimization:**
  - Implement caching where appropriate.
  - Optimize database queries and indexing.

---

### Security and Privacy

- **Data Protection:**
  - Secure handling of user data and documents.
  - Compliance with data protection regulations.
- **Input Sanitization:**
  - Prevent XSS and injection attacks by sanitizing all user inputs.

---

### User Experience

- **Responsive Design:**
  - Ensure the application is usable on various devices.
- **Accessibility:**
  - Follow best practices to make the app accessible to all users.
- **Intuitive Interface:**
  - Keep the UI clean and straightforward.
  - Provide helpful guidance and tooltips where necessary.

---

## References and Documentation

- **NextAuth.js:** [https://next-auth.js.org/](https://next-auth.js.org/)
- **Supabase:** [https://supabase.com/docs/](https://supabase.com/docs/)
- **React Hook Form:** [https://react-hook-form.com/](https://react-hook-form.com/)
- **Zod:** [https://zod.dev/](https://zod.dev/)
- **React Query:** [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- **Date-fns:** [https://date-fns.org/](https://date-fns.org/)
- **OpenAI API:** [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)
- **pgvector Documentation:** [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

---

## Conclusion

This PRD outlines the comprehensive requirements and technical specifications for the project. By adhering to the guidelines and structure provided, developers will have a clear roadmap for implementation, ensuring the project's objectives are met efficiently and effectively.

---

**Note to Developers:**

- Prioritize code readability and maintainability.
- Reuse components and functions wherever possible.
- Keep the end-user experience in mind throughout development.
- Regularly update documentation to reflect any changes or new insights.

---

**Final Remarks:**

This document serves as a blueprint for the project's development. It encompasses all essential aspects, from core functionalities and technical details to important context and best practices. By following this PRD, the development team can work cohesively towards delivering a robust and user-friendly application.