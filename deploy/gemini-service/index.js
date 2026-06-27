const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'REPLACE_WITH_YOUR_GEMINI_OR_LLM_KEY'); // 拍拍 2026.6.27 (demo key - 请替换为自己的 key)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

app.post('/analyze-photo', async (req, res) => {
  try {
    const { base64, prompt } = req.body;
    const result = await model.generateContent([
      { text: prompt || '你是专业的摄影指导专家，专长建筑摄影。分析这张照片的构图，针对拍摄建筑入口给出3条具体改进建议，用中文，每条简短实用。' },
      { inlineData: { mimeType: 'image/jpeg', data: base64 } }
    ]);
    res.json({ analysis: result.response.text() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.send('Gemini Photo Analysis Service - Deployed on Cloud Run'));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
