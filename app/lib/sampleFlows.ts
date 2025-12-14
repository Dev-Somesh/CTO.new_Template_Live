export interface SampleFlow {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  json: string;
}

export const SAMPLE_FLOWS: SampleFlow[] = [
  {
    id: "slack-notification",
    name: "Slack Notification Workflow",
    description:
      "Send notifications to a Slack channel when triggered via webhook",
    difficulty: "easy",
    category: "Communication",
    tags: ["slack", "webhook", "notification"],
    json: JSON.stringify(
      {
        name: "Slack Notification",
        nodes: [
          {
            id: "webhook",
            name: "Webhook Trigger",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300],
            parameters: {
              path: "slack-notification",
              method: "POST",
            },
          },
          {
            id: "slack",
            name: "Send Slack Message",
            type: "n8n-nodes-base.slack",
            typeVersion: 1,
            position: [450, 300],
            parameters: {
              channel: "#notifications",
              text: "{{$json.message}}",
            },
            credentials: {
              slackOAuth: "slack_credential",
            },
          },
        ],
        connections: {
          webhook: {
            main: [
              {
                node: "slack",
                type: "main",
                index: 0,
              },
            ],
          },
        },
      },
      null,
      2
    ),
  },
  {
    id: "email-openai",
    name: "Email Summarization with AI",
    description: "Summarize emails using OpenAI and send the summary via email",
    difficulty: "medium",
    category: "AI & Automation",
    tags: ["openai", "email", "gmail", "ai"],
    json: JSON.stringify(
      {
        name: "Email Summarization",
        nodes: [
          {
            id: "schedule",
            name: "Daily Schedule",
            type: "n8n-nodes-base.schedule",
            typeVersion: 1,
            position: [250, 300],
            parameters: {
              interval: ["days"],
              daysInterval: 1,
            },
          },
          {
            id: "gmail",
            name: "Get Unread Emails",
            type: "n8n-nodes-base.gmail",
            typeVersion: 1,
            position: [450, 300],
            parameters: {
              maxResults: 5,
              labelIds: ["UNREAD"],
            },
            credentials: {
              gmailOAuth: "gmail_credential",
            },
          },
          {
            id: "openai",
            name: "Summarize with OpenAI",
            type: "n8n-nodes-base.openai",
            typeVersion: 1,
            position: [650, 300],
            parameters: {
              prompt: "Summarize this email:\n{{$json.body}}",
              model: "gpt-3.5-turbo",
            },
            credentials: {
              openaiApi: "openai_credential",
            },
          },
          {
            id: "sendEmail",
            name: "Send Summary Email",
            type: "n8n-nodes-base.gmail",
            typeVersion: 1,
            position: [850, 300],
            parameters: {
              to: "user@example.com",
              subject: "Email Summary",
              body: "{{$json.text}}",
            },
            credentials: {
              gmailOAuth: "gmail_credential",
            },
          },
        ],
        connections: {
          schedule: {
            main: [
              {
                node: "gmail",
                type: "main",
                index: 0,
              },
            ],
          },
          gmail: {
            main: [
              {
                node: "openai",
                type: "main",
                index: 0,
              },
            ],
          },
          openai: {
            main: [
              {
                node: "sendEmail",
                type: "main",
                index: 0,
              },
            ],
          },
        },
      },
      null,
      2
    ),
  },
  {
    id: "webhook-conditional",
    name: "Conditional Data Processing",
    description:
      "Process webhook data with conditional logic and route to different endpoints",
    difficulty: "medium",
    category: "Logic & Routing",
    tags: ["webhook", "conditional", "routing"],
    json: JSON.stringify(
      {
        name: "Conditional Webhook Processor",
        nodes: [
          {
            id: "webhook",
            name: "Incoming Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300],
            parameters: {
              path: "process-data",
              method: "POST",
            },
          },
          {
            id: "conditional",
            name: "Check Priority",
            type: "n8n-nodes-base.if",
            typeVersion: 1,
            position: [450, 300],
            parameters: {
              conditions: {
                boolean: [
                  {
                    value1: "{{$json.priority}}",
                    operation: "equals",
                    value2: "high",
                  },
                ],
              },
            },
          },
          {
            id: "highPriority",
            name: "Send Alert Email",
            type: "n8n-nodes-base.gmail",
            typeVersion: 1,
            position: [650, 150],
            parameters: {
              to: "admin@example.com",
              subject: "High Priority Alert",
              body: "{{$json.message}}",
            },
            credentials: {
              gmailOAuth: "gmail_credential",
            },
          },
          {
            id: "normalPriority",
            name: "Log to Slack",
            type: "n8n-nodes-base.slack",
            typeVersion: 1,
            position: [650, 450],
            parameters: {
              channel: "#logs",
              text: "{{$json.message}}",
            },
            credentials: {
              slackOAuth: "slack_credential",
            },
          },
        ],
        connections: {
          webhook: {
            main: [
              {
                node: "conditional",
                type: "main",
                index: 0,
              },
            ],
          },
          conditional: {
            main: [
              [
                {
                  node: "highPriority",
                  type: "main",
                  index: 0,
                },
              ],
              [
                {
                  node: "normalPriority",
                  type: "main",
                  index: 0,
                },
              ],
            ],
          },
        },
      },
      null,
      2
    ),
  },
  {
    id: "api-integration",
    name: "External API Integration",
    description:
      "Fetch data from external API, transform it, and store in a database",
    difficulty: "hard",
    category: "Data Integration",
    tags: ["api", "http", "database", "integration"],
    json: JSON.stringify(
      {
        name: "API to Database Integration",
        nodes: [
          {
            id: "schedule",
            name: "Run Every Hour",
            type: "n8n-nodes-base.schedule",
            typeVersion: 1,
            position: [250, 300],
            parameters: {
              interval: ["hours"],
              hoursInterval: 1,
            },
          },
          {
            id: "apiCall",
            name: "Fetch from API",
            type: "n8n-nodes-base.http",
            typeVersion: 4,
            position: [450, 300],
            parameters: {
              url: "https://api.example.com/data",
              method: "GET",
              authentication: "oAuth2",
            },
          },
          {
            id: "transform",
            name: "Transform Data",
            type: "n8n-nodes-base.code",
            typeVersion: 2,
            position: [650, 300],
            parameters: {
              jsCode:
                'return items.map(item => ({\n  id: item.id,\n  name: item.name,\n  timestamp: new Date(),\n  processed: true\n}));',
            },
          },
          {
            id: "database",
            name: "Save to Database",
            type: "n8n-nodes-base.postgresdb",
            typeVersion: 2,
            position: [850, 300],
            parameters: {
              operation: "executeQuery",
              query:
                "INSERT INTO data_table (id, name, timestamp) VALUES ($1, $2, $3)",
            },
            credentials: {
              postgresqlConnection: "postgres_credential",
            },
          },
        ],
        connections: {
          schedule: {
            main: [
              {
                node: "apiCall",
                type: "main",
                index: 0,
              },
            ],
          },
          apiCall: {
            main: [
              {
                node: "transform",
                type: "main",
                index: 0,
              },
            ],
          },
          transform: {
            main: [
              {
                node: "database",
                type: "main",
                index: 0,
              },
            ],
          },
        },
      },
      null,
      2
    ),
  },
];

export function getSampleFlowById(id: string): SampleFlow | undefined {
  return SAMPLE_FLOWS.find((flow) => flow.id === id);
}

export function getSampleFlowsByCategory(category: string): SampleFlow[] {
  return SAMPLE_FLOWS.filter((flow) => flow.category === category);
}

export function getSampleFlowsByDifficulty(difficulty: "easy" | "medium" | "hard"): SampleFlow[] {
  return SAMPLE_FLOWS.filter((flow) => flow.difficulty === difficulty);
}
