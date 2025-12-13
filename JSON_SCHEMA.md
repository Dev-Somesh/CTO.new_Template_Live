# N8n Flow JSON Schema

This document describes the expected JSON schema for n8n workflows when using the n8n Flow Playground analyzer.

## Basic Structure

```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...}
}
```

## Detailed Structure

### Root Level
- **name** (string, optional): The name of your workflow
- **nodes** (array, **required**): Array of node objects that make up your workflow
- **connections** (object, optional): Object defining connections between nodes
- **active** (boolean, optional): Whether the workflow is active
- **disabled** (boolean, optional): Whether the workflow is disabled

### Node Object

Each node in the `nodes` array should have the following structure:

```json
{
  "id": "unique_node_id",
  "name": "Display Name",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "key": "value"
  },
  "credentials": {
    "credentialType": "credentialName"
  }
}
```

#### Node Properties
- **id** (string, **required**): Unique identifier for the node
- **name** (string, **required**): Display name for the node
- **type** (string, **required**): The node type (e.g., "n8n-nodes-base.webhook")
- **typeVersion** (number, optional): Version of the node type
- **position** (array, optional): [x, y] coordinates for UI positioning
- **parameters** (object, optional): Configuration parameters specific to the node
- **credentials** (object, optional): Credentials required by the node

### Common Node Types

- **n8n-nodes-base.webhook** - Trigger node for HTTP webhooks
- **n8n-nodes-base.schedule** - Trigger node for scheduled execution
- **n8n-nodes-base.http** - Make HTTP requests
- **n8n-nodes-base.openai** - Interact with OpenAI API
- **n8n-nodes-base.slack** - Send Slack messages
- **n8n-nodes-base.gmail** - Work with Gmail
- **n8n-nodes-base.code** - Execute JavaScript code
- **n8n-nodes-base.if** - Conditional logic
- **n8n-nodes-base.merge** - Merge data branches
- **n8n-nodes-base.database** - Database operations

### Connections Object

Defines how nodes connect to each other:

```json
{
  "connections": {
    "node_id_1": {
      "main": [
        [
          {
            "node": "node_id_2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

#### Connection Properties
- **node** (string): The ID of the target node
- **type** (string): Type of connection (usually "main")
- **index** (number): Output index (for nodes with multiple outputs)

## Complete Example

```json
{
  "name": "Email Notification Workflow",
  "nodes": [
    {
      "id": "webhook",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "parameters": {
        "path": "webhook-path",
        "method": "POST"
      }
    },
    {
      "id": "email",
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSendGmail",
      "typeVersion": 1,
      "position": [500, 300],
      "parameters": {
        "toEmail": "recipient@example.com",
        "subject": "Notification",
        "textPlain": "Message: {{$json.message}}"
      },
      "credentials": {
        "gmailOAuth": "gmail_credential"
      }
    }
  ],
  "connections": {
    "webhook": {
      "main": [
        [
          {
            "node": "email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Validation Rules

The analyzer expects:
1. Valid JSON format (proper syntax)
2. Root `nodes` property must be an array
3. Each node must have `id`, `name`, and `type` properties
4. Connections are optional but must reference valid node IDs

## Troubleshooting

### "Invalid JSON format"
- Check for syntax errors (missing commas, quotes, brackets)
- Use a JSON validator like [jsonlint.com](https://www.jsonlint.com/)

### "Invalid n8n flow format. Expected 'nodes' array"
- Ensure your JSON has a `nodes` property at the root level
- Make sure `nodes` is an array (enclosed in `[]`), not an object

### Missing nodes or invalid references
- Check that all node IDs referenced in connections exist in the nodes array
- Ensure node IDs are consistent (case-sensitive)

## Getting Your n8n Flow JSON

1. In n8n editor, click the menu button (⋮)
2. Select "Download"
3. Choose JSON format
4. Save the file or copy the content
5. Paste into the n8n Flow Playground analyzer
