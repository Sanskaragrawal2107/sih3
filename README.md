# DPR Evaluation Platform

An AI-powered evaluation platform for Detailed Project Reports (DPR) compliance with Ministry of Development of North Eastern Region (MDoNER) guidelines.

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini 2.5 Flash for comprehensive DPR evaluation
- **MDoNER Compliance**: Evaluates projects against PM-DevINE scheme guidelines
- **Multi-format Support**: Supports PDF, DOCX, and TXT file uploads
- **Comprehensive Reporting**: Provides detailed analysis with compliance scores and recommendations
- **Real-time Processing**: Live progress tracking during analysis
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **Knowledge Base**: LlamaIndex Cloud
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key
- LlamaCloud API credentials (optional)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dpr-evaluation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_LLAMA_API_KEY=your_llama_api_key_here
   VITE_LLAMA_ORG_ID=your_llama_org_id_here
   VITE_LLAMA_INDEX_NAME=sih
   VITE_LLAMA_PROJECT_NAME=Default
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🔑 API Keys Setup

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### LlamaCloud API (Optional)
1. Sign up at [LlamaIndex Cloud](https://cloud.llamaindex.ai/)
2. Create a project and get your API credentials
3. Add them to your `.env` file

## 📖 Usage

1. **Upload DPR Document**: Drag and drop or click to upload your DPR file (PDF, DOCX, or TXT)
2. **Start Analysis**: Click "Analyze DPR" to begin the evaluation process
3. **Review Results**: Get comprehensive analysis including:
   - Overall compliance score
   - Red flags and issues
   - Missing components
   - Strengths and recommendations
   - Detailed summary

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AnalysisResults.tsx
│   └── FileUpload.tsx
├── services/            # API services
│   ├── gemini.ts       # Google Gemini integration
│   └── llamaCloud.ts   # LlamaCloud integration
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🔍 Evaluation Criteria

The platform evaluates DPRs across multiple dimensions:

- **Budget & Financial Analysis**
- **Project Timeline & Scheduling**
- **Technical Feasibility**
- **Environmental & Social Impact**
- **Resource Allocation & Management**
- **Compliance & Documentation**
- **Data Consistency & Accuracy**
- **Risk Assessment**

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ministry of Development of North Eastern Region (MDoNER)
- Google Gemini AI for advanced language processing
- LlamaIndex for knowledge base integration
- React and Vite communities for excellent development tools

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ for the development of North Eastern Region
