# Gemini API Setup Instructions

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API Key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy the API key

## Setting Up the API Key

1. Open `frontend/src/components/Patient/AIReportAnalysis.jsx`
2. Find the line: `const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY', {`
3. Replace `YOUR_GEMINI_API_KEY` with your actual API key
4. Do the same for the second API call in the `sendMessage` function

## Example:
```javascript
// Replace this:
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY', {

// With this:
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', {
```

## Features Included

✅ **AI Report Analysis**
- Upload medical reports/images
- AI-powered analysis using Gemini
- Report card detection and validation
- Interactive chat with AI about the report
- Data persistence in localStorage

✅ **Doctor Appointment Management**
- View all appointments
- Mark appointments as completed
- Reschedule appointments
- Cancel appointments
- Add notes to appointments
- Status tracking with color coding

✅ **Home Page Integration**
- AI Report Analysis section
- Recent analysis display
- Direct links to analysis tool

## Security Note
For production use, consider:
- Using environment variables for API keys
- Implementing proper error handling
- Adding rate limiting
- Validating file uploads more strictly
