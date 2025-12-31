# AI Live Chat Agent

A full-stack AI-powered customer support chat application built with React, Node.js, TypeScript, PostgreSQL, and Google Gemini.

## Features

- 🤖 AI-powered customer support using Google Gemini (free tier available)
- 💬 Real-time chat interface with message history
- 💾 Persistent conversation storage with PostgreSQL
- 🎨 Modern UI built with React, Tailwind CSS, and shadcn/ui
- 🔄 Session persistence across page reloads
- ✅ Input validation and error handling
- 📱 Responsive design

## Tech Stack

### Backend

- **Node.js** + **TypeScript**
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **Google Gemini API** - LLM integration (free tier available)

### Frontend

- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

## Prerequisites

- Node.js (v20.17.0 or higher)
- PostgreSQL database (or Docker for running PostgreSQL in a container)
- Google Gemini API key (get a free key at [Google AI Studio](https://makersuite.google.com/app/apikey))
- Docker and Docker Compose (optional, but recommended for easy PostgreSQL setup)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Spur_Assignment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your:
# - DATABASE_URL (PostgreSQL connection string)
# - GEMINI_API_KEY (your Google Gemini API key - get it free at https://makersuite.google.com/app/apikey)
# - PORT (optional, defaults to 3001)
```

**Example .env file:**

If using Docker for PostgreSQL (recommended):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spur_chat?schema=public"
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3001
NODE_ENV=development
```

If using a local PostgreSQL installation:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/spur_chat?schema=public"
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3001
NODE_ENV=development
```

**Getting a Gemini API Key:**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

### 3. Database Setup

**Option A: Using Docker (Recommended)**

```bash
# From the project root, start PostgreSQL
docker-compose up -d

# Wait a few seconds for PostgreSQL to be ready, then from the backend directory:
cd backend

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

**Option B: Using Local PostgreSQL**

Make sure PostgreSQL is installed and running on your system, then:

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

**To stop Docker PostgreSQL:**

```bash
docker-compose down
```

**To stop and remove all data:**

```bash
docker-compose down -v
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables (optional)
# Create .env file with:
# VITE_API_BASE_URL=http://localhost:3001
```

### 5. Running the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3001`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000` to use the chat application.

## Project Structure

```
Spur_Assignment/
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── prisma.ts          # Prisma client instance
│   │   ├── routes/
│   │   │   └── chat.ts            # Chat API endpoints
│   │   ├── services/
│   │   │   ├── conversationService.ts  # Database operations
│   │   │   └── llmService.ts          # OpenAI integration
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript type definitions
│   │   ├── utils/
│   │   │   └── validation.ts      # Input validation utilities
│   │   └── server.ts              # Express server setup
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   ├── ChatWidget.tsx     # Main chat component
│   │   │   ├── ChatInput.tsx      # Message input component
│   │   │   ├── MessageList.tsx    # Message display component
│   │   │   └── MessageBubble.tsx  # Individual message component
│   │   ├── lib/
│   │   │   └── utils.ts           # Utility functions (cn helper)
│   │   ├── services/
│   │   │   └── api.ts             # API client
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript types
│   │   ├── utils/
│   │   │   └── constants.ts       # API endpoints
│   │   ├── App.tsx                # Root component
│   │   └── index.css              # Tailwind CSS imports
│   └── package.json
└── README.md
```

## API Endpoints

### POST `/chat/message`

Send a message to the AI agent.

**Request:**

```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-session-id"
}
```

**Response:**

```json
{
  "reply": "We accept returns within 30 days...",
  "sessionId": "conversation-uuid"
}
```

### GET `/chat/history/:sessionId`

Retrieve conversation history for a session.

**Response:**

```json
{
  "messages": [
    {
      "id": "message-uuid",
      "conversationId": "conversation-uuid",
      "sender": "user",
      "text": "Hello",
      "timestamp": "2025-12-24T10:00:00Z"
    }
  ]
}
```

### GET `/health`

Health check endpoint.

## Architecture Overview

### Backend Architecture

The backend follows a layered architecture:

1. **Routes Layer** (`src/routes/`) - Handles HTTP requests and responses
2. **Services Layer** (`src/services/`) - Business logic and external integrations
   - `conversationService.ts` - Manages database operations for conversations and messages
   - `llmService.ts` - Handles Google Gemini API calls and prompt management
3. **Utils Layer** (`src/utils/`) - Shared utilities like validation
4. **Types Layer** (`src/types/`) - TypeScript type definitions

### Frontend Architecture

The frontend uses a component-based architecture:

1. **Components** - Reusable UI components
   - `ChatWidget` - Main container managing state and API calls
   - `MessageList` - Displays messages with auto-scroll
   - `MessageBubble` - Individual message rendering
   - `ChatInput` - Input field with send functionality
2. **Services** - API communication layer
3. **Utils** - Helper functions and constants

### Data Flow

```
User Input → ChatInput → ChatWidget → API Service → Backend
                                                      ↓
Database ← Conversation Service ← LLM Service ← Google Gemini API
                                                      ↓
Frontend ← API Response ← Backend Response
```

## Database Schema

### Conversation

- `id` (UUID) - Primary key
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Message

- `id` (UUID) - Primary key
- `conversationId` (UUID) - Foreign key to Conversation
- `sender` (String) - "user" or "ai"
- `text` (String) - Message content
- `timestamp` (DateTime)

## LLM Integration

### Provider

**Google Gemini Pro** (Free tier available)

Google Gemini offers a free tier with generous rate limits, making it perfect for development and small-scale applications. Get your free API key at [Google AI Studio](https://makersuite.google.com/app/apikey).

### Prompt Design

The system uses a structured prompt with:

1. **System Prompt**: Defines the AI as a helpful support agent for an e-commerce store
2. **Store Knowledge**: Hardcoded FAQ information including:
   - Shipping policies (free shipping over $50, standard/express options)
   - Return policy (30 days, unworn/unwashed)
   - Refund processing (5-7 business days)
   - Support hours (Monday-Friday, 9 AM - 6 PM EST)
   - Contact information
3. **Conversation History**: Last 10 messages included for context
4. **User Message**: Current user input

### Configuration

- **Model**: `gemini-pro`
- **History Limit**: 10 messages (for context without excessive tokens)
- **Response Length**: Natural truncation (Gemini handles this automatically)

### Error Handling

The LLM service handles:

- Invalid API keys (API_KEY_INVALID)
- Rate limiting (429, RESOURCE_EXHAUSTED)
- Service unavailability (500/503, UNAVAILABLE)
- Timeout errors
- Network failures

All errors are caught and returned as user-friendly messages in the chat.

### Why Gemini?

- **Free Tier**: Generous free tier perfect for development
- **No Credit Card Required**: Get started immediately
- **Good Performance**: Fast response times
- **Easy Integration**: Simple API with good documentation

## Design Decisions

### Why Prisma?

- Type-safe database queries
- Easy migrations
- Excellent TypeScript support
- Auto-generated client

### Why Tailwind CSS + shadcn/ui?

- Utility-first CSS for rapid development
- Consistent design system
- Accessible components out of the box
- Easy customization

### Why Session-based Conversations?

- Simple implementation (no auth required)
- Persistent across page reloads
- Easy to extend with user accounts later

### Why Optimistic UI Updates?

- Better user experience (instant feedback)
- Messages appear immediately
- Errors handled gracefully with rollback

## Trade-offs & Future Improvements

### Current Limitations

1. **No Authentication**: Sessions are stored in localStorage, not tied to user accounts
2. **Simple Error Handling**: Basic error messages, could be more detailed
3. **No Rate Limiting**: Backend doesn't limit requests per user
4. **Hardcoded FAQ**: Store knowledge is in the prompt, not a knowledge base
5. **No Streaming**: Responses are returned all at once, not streamed

### If I Had More Time...

1. **Authentication & User Management**

   - User registration/login
   - Multiple conversations per user
   - Conversation history management

2. **Enhanced LLM Features**

   - Streaming responses for better UX
   - Support for multiple LLM providers (Claude, etc.)
   - Fine-tuned models for better domain knowledge
   - Token usage tracking and cost monitoring

3. **Knowledge Base**

   - Dynamic FAQ management
   - Vector database for semantic search
   - RAG (Retrieval Augmented Generation) for better answers

4. **Advanced Features**

   - File uploads (images, documents)
   - Multi-language support
   - Sentiment analysis
   - Conversation analytics
   - Admin dashboard

5. **Production Readiness**

   - Rate limiting
   - Request validation middleware
   - Logging and monitoring (Winston, Sentry)
   - Caching layer (Redis)
   - Load balancing
   - Docker containerization
   - CI/CD pipeline

6. **Testing**
   - Unit tests for services
   - Integration tests for API endpoints
   - E2E tests for frontend
   - LLM response quality tests

## Troubleshooting

### Backend won't start

- Check that PostgreSQL is running
- Verify DATABASE_URL in .env is correct
- Ensure Prisma migrations have been run

### Frontend can't connect to backend

- Verify backend is running on port 3001
- Check VITE_API_BASE_URL in frontend .env (or use proxy in vite.config.ts)
- Check CORS settings in backend

### Gemini API errors

- Verify GEMINI_API_KEY is set correctly
- Check API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Review rate limits if getting 429 errors (free tier has generous limits)
- Ensure you're using the correct API key format

### Database connection errors

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists and user has permissions


