# Chat System Setup Guide

## Overview
The chat system now uses an online AI service (OpenAI) as the primary response provider, with Rasa as a fallback when the online service is unavailable.

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

### 2. Fallback System

The chat system works as follows:

1. **Primary**: Attempts to get responses from OpenAI GPT-3.5-turbo
2. **Fallback**: If OpenAI fails, uses the local Rasa server
3. **Final Fallback**: If both fail, shows a generic error message

### 3. Rasa Server (Fallback)

To ensure the fallback system works properly, keep your Rasa server running:

```bash
# In the Rasa project directory
rasa run --enable-api --cors "*" --port 5005
```

### 4. Testing the System

- **With OpenAI**: Normal chat responses will come from OpenAI
- **Without OpenAI**: Disable internet or use invalid API key to test Rasa fallback
- **Complete Failure**: Stop Rasa server to test final fallback message

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