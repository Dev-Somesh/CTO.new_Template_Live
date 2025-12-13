# N8n Flow Playground

A modern web application that allows users to analyze and configure n8n workflow JSON files without needing to install or use n8n directly. Users can paste their n8n flow JSON and get instant insights about nodes, requirements, credentials, and step-by-step configuration guidance.

## Features

- **Flow JSON Analysis**: Upload or paste n8n flow JSON to instantly analyze the workflow structure
- **Node Details**: View all nodes, their types, connections, and configuration parameters
- **Credential Requirements**: Identify all required credentials, API keys, and external services
- **Step-by-Step Configuration Guide**: Get detailed instructions on how to configure each node
- **Sample Workflows**: Explore pre-built example workflows to learn best practices
- **Insights & Warnings**: Automatic analysis to identify missing triggers, required credentials, and complexity
- **Dark Mode Support**: Full dark mode implementation for comfortable usage
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
app/
├── components/
│   ├── FlowAnalyzer.tsx       # Main analysis and configuration guide component
│   ├── FlowUploader.tsx        # File upload and JSON input component
│   └── SampleFlowsGallery.tsx  # Gallery of sample workflows
├── lib/
│   ├── n8nFlowAnalyzer.ts     # Flow JSON parsing and analysis engine
│   └── sampleFlows.ts          # Pre-built sample workflow definitions
├── layout.tsx                  # Root layout
├── page.tsx                    # Home page with navigation
└── globals.css                 # Global styles with Tailwind CSS
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## How to Use

1. **Upload a Flow**: 
   - Paste your n8n flow JSON directly into the textarea
   - Or upload a JSON file from your computer
   - Click "Analyze Flow" to get started

2. **Explore Samples**:
   - Browse pre-built workflow examples
   - Filter by difficulty level or category
   - Click "Analyze This Flow" to see the full breakdown

3. **Review the Analysis**:
   - **Overview Tab**: See key metrics and insights
   - **Nodes Tab**: Explore each node's configuration and connections
   - **Credentials Tab**: Identify all required credentials and services
   - **Guide Tab**: Follow step-by-step configuration instructions

## Sample Workflows Included

- **Slack Notification Workflow**: Send messages to Slack via webhook
- **Email Summarization with AI**: Fetch emails and summarize using OpenAI
- **Conditional Data Processing**: Route data based on conditions
- **API Integration**: Fetch from external APIs and store in database

## Technologies Used

- **Next.js 16.0.7**: React framework with App Router
- **React 19.2.1**: UI library
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Node.js**: Runtime environment

## Development

### Build the project
```bash
npm run build
```

### Run linting
```bash
npm run lint
```

### Start development server
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features
- [n8n Documentation](https://docs.n8n.io) - learn about n8n workflows
- [Tailwind CSS](https://tailwindcss.com) - learn about utility-first CSS

## License

This project is open source and available under the MIT License.
