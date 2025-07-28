# Chat System Setup Guide

## Overview
The chat system uses OpenAI GPT-3.5-turbo as the primary AI service, with Rasa as a fallback when OpenAI is unavailable. This provides the best of both worlds: advanced conversational AI from OpenAI with reliable local fallback support.

## Setup Instructions

### 1. Configure OpenAI API Key

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your OpenAI API key:
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key or use an existing one
   - Copy the API key

3. Edit the `.env` file and replace `your_openai_api_key_here` with your actual API key:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. Restart your Expo development server:
   ```bash
   npx expo start
   ```

### 2. AI Service Architecture

The chat system uses a three-tier fallback architecture:

1. **Primary (OpenAI)**: 
   - Uses GPT-3.5-turbo for natural, contextual responses
   - Maintains conversation history for better context
   - Provides advanced sentiment analysis and categorization
   - Requires internet connection and valid API key

2. **Secondary (Rasa)**:
   - Local AI assistant with predefined responses
   - Works offline and doesn't require external API keys
   - Provides structured mental health support
   - Includes custom links and resources

3. **Final Fallback**:
   - Generic supportive message with crisis resources
   - Always available even if both AI services fail
   - Includes emergency mental health contact information

### 3. Rasa Server (Fallback)

To ensure the fallback system works properly, keep your Rasa server running:

```bash
# In the Rasa project directory
rasa run --enable-api --cors "*" --port 5005
```

### 4. Testing the System

#### Testing OpenAI (Primary)
- Ensure valid API key is set in `.env`
- Normal chat responses will show "Powered by OpenAI"
- Responses will be more natural and contextual

#### Testing Rasa Fallback
- Set invalid OpenAI API key or disable internet
- Responses will show "Using local AI assistant"
- Will receive structured, predefined responses

#### Testing Final Fallback
- Stop both OpenAI (invalid key) and Rasa server
- Will show "Limited functionality" message
- Provides crisis support resources

#### Health Check
- Visit `/api/ai-chat/health` to check service status
- Shows availability of both OpenAI and Rasa
- Indicates which service is currently primary

### 5. Monitoring and Debugging

#### Service Status
- Each chat response includes a `provider` field indicating which service was used
- Frontend can display service status to users
- Health check endpoint provides real-time service monitoring

#### Conversation Context
- OpenAI maintains conversation history (last 10 messages)
- Provides more coherent, contextual responses
- Rasa fallback uses individual message processing

#### Error Handling
- Graceful degradation between services
- Detailed error logging for debugging
- User-friendly error messages

## Features

- **Smart Fallback**: Automatically switches to Rasa if OpenAI is unavailable
- **Consistent Experience**: Users get responses regardless of which system is active
- **Error Handling**: Graceful degradation with informative fallback messages
- **Mental Health Focus**: OpenAI is configured specifically for mental health assistance

## Troubleshooting

### OpenAI Issues
- Check API key is correct and has credits
- Verify internet connection
- Check OpenAI service status

### Rasa Issues
- Ensure Rasa server is running on port 5005
- Check Rasa model is trained and loaded
- Verify endpoints.yml configuration

### Environment Variables
- Restart Expo server after changing .env
- Ensure .env file is in project root
- Check variable name starts with `EXPO_PUBLIC_`