# Gemini Photo Analysis Service (for 拍拍 demo)

This is a minimal Cloud Run service that uses Gemini API to analyze photos for composition tips.

## Deploy
1. gcloud auth login
2. gcloud config set project YOUR_PROJECT
3. gcloud run deploy paipai-gemini --source . --port 8080 --allow-unauthenticated --region asia-northeast1

## Usage in App
POST /analyze-photo with { "base64": "...", "prompt": "..." }
Returns { "analysis": "..." }

Mobile app (native) calls this deployed endpoint for real AI analysis.

This fulfills the "deployed project" requirement while keeping the main experience as native mobile app on device.

Use with your GEMINI_API_KEY in env (set when deploying to Cloud Run). 
For demo, the key is hardcoded as placeholder. Replace with your own key.
Get key from https://aistudio.google.com/app/apikey . Do not use real keys in production.
