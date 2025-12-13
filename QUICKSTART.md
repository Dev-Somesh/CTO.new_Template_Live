# N8n Flow Playground - Quick Start Guide

Welcome to the n8n Flow Playground! This guide will help you get started with analyzing your n8n workflows.

## Getting Started

### Option 1: Upload Your Own Flow

1. **Prepare your n8n flow JSON**
   - Open your n8n workflow editor
   - Click the menu button (⋮) in the top right
   - Select "Download"
   - Choose "JSON" format
   - Save the file or copy the content

2. **Analyze the flow**
   - Go to the home page and click "Upload Your Flow"
   - Paste your JSON into the textarea or upload the file
   - Click "Analyze Flow"
   - Review the detailed analysis

### Option 2: Explore Sample Workflows

1. **Browse samples**
   - Go to the home page and click "Explore Samples"
   - Filter by category or difficulty level
   - Click on a workflow to see details

2. **Analyze a sample**
   - Click "Analyze This Flow" on any sample
   - Review the complete breakdown

## What You Get

Once you analyze a workflow, you'll see:

### Overview Tab
- Key metrics (number of nodes, connections, credentials)
- Flow insights and warnings
- Recommended actions

### Nodes Tab
- Detailed information about each node
- Node types and configurations
- Connection flow (incoming and outgoing)

### Credentials Tab
- List of required credentials
- External services needed
- Setup instructions for each credential

### Configuration Guide Tab
- Step-by-step setup instructions
- Required parameters for each node
- Credential configuration details
- Data flow explanation

## Common Issues & Solutions

### "Invalid JSON format" Error

This means the JSON syntax is incorrect. Common causes:

1. **Missing closing brace**: Make sure all `{` and `}` are paired
2. **Trailing comma**: Remove commas after the last item in arrays/objects
3. **Missing quotes**: All property names and string values need quotes
4. **Copy-paste issue**: Make sure you copied the entire JSON

**Solution**:
- Use the example flow (`EXAMPLE_FLOW.json`) as a template
- Validate your JSON at [jsonlint.com](https://www.jsonlint.com/)
- Check the JSON_SCHEMA.md file for the correct format

### "Invalid n8n flow format" Error

This means your JSON is valid but doesn't have the required structure.

**Common causes**:
1. Missing `nodes` property
2. `nodes` is an object instead of an array
3. Nodes are missing required properties

**Solution**:
- Ensure your JSON has a `nodes` property
- Make sure `nodes` is an array (use `[]` not `{}`)
- Each node needs `id`, `name`, and `type` properties

## Example Flow

Here's a simple example you can test:

```json
{
  "name": "Simple Webhook to Email",
  "nodes": [
    {
      "id": "webhook",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "test",
        "method": "POST"
      }
    },
    {
      "id": "email",
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSendGmail",
      "parameters": {
        "toEmail": "test@example.com",
        "subject": "Test"
      },
      "credentials": {
        "gmailOAuth": "gmail_cred"
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

## Documentation

For more detailed information, check:

- **JSON_SCHEMA.md** - Complete reference for n8n JSON format
- **EXAMPLE_FLOW.json** - Full working example
- **IMPROVEMENTS.md** - Recent improvements and fixes
- **README.md** - Project overview

## Tips & Best Practices

1. **Start with samples**: Review sample workflows to understand the structure
2. **Validate before uploading**: Use [jsonlint.com](https://www.jsonlint.com/) to check your JSON
3. **Keep backups**: Save your workflow JSON before making changes
4. **Review insights**: Pay attention to warnings about missing triggers or credentials
5. **Follow the guide**: Use the step-by-step configuration guide to set up nodes

## Getting Help

If you encounter issues:

1. Check the error message - it tells you what's wrong
2. Look at the JSON_SCHEMA.md for reference
3. Compare your JSON with EXAMPLE_FLOW.json
4. Ensure your JSON is valid at [jsonlint.com](https://www.jsonlint.com/)

## Next Steps

1. ✅ Analyze a sample workflow to understand the analyzer
2. ✅ Export your first n8n workflow as JSON
3. ✅ Analyze your workflow in the playground
4. ✅ Follow the configuration guide to set up your flow
5. ✅ Share your workflow JSON with the community

Happy automating! 🚀
