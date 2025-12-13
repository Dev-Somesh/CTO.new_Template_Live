export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion?: number;
  position?: [number, number];
  parameters?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

export interface N8nConnection {
  source: string;
  target: string;
  type: string;
}

export interface FlowAnalysis {
  nodes: N8nNode[];
  connections: N8nConnection[];
  totalNodes: number;
  nodeTypes: string[];
  credentialTypes: string[];
  requiredTools: string[];
  configuration: ConfigurationStep[];
  insights: string[];
}

export interface ConfigurationStep {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  requiredParameters: ParameterInfo[];
  optionalParameters: ParameterInfo[];
  credentials?: CredentialInfo[];
  instructions: string;
}

export interface ParameterInfo {
  name: string;
  type: string;
  description: string;
  required: boolean;
  example?: string;
}

export interface CredentialInfo {
  type: string;
  description: string;
  required: boolean;
  setupInstructions?: string;
}

const CREDENTIAL_SETUP_INSTRUCTIONS: Record<string, string> = {
  openaiApi: "1. Go to https://platform.openai.com/api-keys\n2. Create a new API key\n3. Copy and paste the key in n8n",
  slackOAuth: "1. Go to Slack App settings\n2. Generate OAuth token\n3. Copy the token to n8n",
  hubspotOAuth: "1. Go to HubSpot App Marketplace\n2. Authorize n8n app\n3. Connect your account",
  gmailOAuth: "1. Grant Gmail access to n8n\n2. Authorize your Google account\n3. Choose which Gmail features to allow",
  httpBasic: "1. Provide username and password for the HTTP endpoint",
};

export function analyzeN8nFlow(jsonString: string): FlowAnalysis {
  const trimmedInput = jsonString.trim();
  
  if (!trimmedInput) {
    throw new Error("No JSON provided. Please paste your n8n flow JSON.");
  }

  let flowData: unknown;

  try {
    flowData = JSON.parse(trimmedInput);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Invalid JSON format: ${errorMessage}. Please ensure the pasted JSON is valid.`);
  }

  const typedFlowData = flowData as Record<string, unknown>;
  
  // Handle different n8n flow formats
  let nodesArray: unknown[] | undefined;
  
  // Try direct nodes property
  if (Array.isArray(typedFlowData.nodes)) {
    nodesArray = typedFlowData.nodes;
  }
  // Try nested workflow.nodes
  else if (
    typedFlowData.workflow &&
    typeof typedFlowData.workflow === "object"
  ) {
    const workflow = typedFlowData.workflow as Record<string, unknown>;
    if (Array.isArray(workflow.nodes)) {
      nodesArray = workflow.nodes;
    }
  }
  // Try nested data.nodes
  else if (
    typedFlowData.data &&
    typeof typedFlowData.data === "object"
  ) {
    const data = typedFlowData.data as Record<string, unknown>;
    if (Array.isArray(data.nodes)) {
      nodesArray = data.nodes;
    }
  }
  
  if (!nodesArray) {
    throw new Error(
      "Invalid n8n flow format. Expected 'nodes' array in the JSON. The flow must have a 'nodes' property containing an array of node objects. Supported formats: {nodes: [...]}, {workflow: {nodes: [...]}}, or {data: {nodes: [...]}}"
    );
  }

  const nodes: N8nNode[] = nodesArray.map((node: unknown) => {
    const typedNode = node as Record<string, unknown>;
    return {
      id: typedNode.id as string,
      name: (typedNode.name as string) || (typedNode.id as string),
      type: typedNode.type as string,
      typeVersion: typedNode.typeVersion as number,
      position: typedNode.position as [number, number],
      parameters: (typedNode.parameters as Record<string, unknown>) || {},
      credentials: (typedNode.credentials as Record<string, unknown>) || {},
    };
  });

  const connections: N8nConnection[] = [];
  
  // Try to find connections object in different locations
  let connectionsObj: Record<string, unknown> | undefined;
  
  if (typedFlowData.connections && typeof typedFlowData.connections === "object") {
    connectionsObj = typedFlowData.connections as Record<string, unknown>;
  } else if (
    typedFlowData.workflow &&
    typeof typedFlowData.workflow === "object"
  ) {
    const workflow = typedFlowData.workflow as Record<string, unknown>;
    if (workflow.connections && typeof workflow.connections === "object") {
      connectionsObj = workflow.connections as Record<string, unknown>;
    }
  } else if (
    typedFlowData.data &&
    typeof typedFlowData.data === "object"
  ) {
    const data = typedFlowData.data as Record<string, unknown>;
    if (data.connections && typeof data.connections === "object") {
      connectionsObj = data.connections as Record<string, unknown>;
    }
  }
  
  if (connectionsObj) {
    Object.entries(connectionsObj).forEach(([sourceId, targets]) => {
      if (targets && typeof targets === "object") {
        Object.entries(targets).forEach(([connectionType, targetArray]) => {
          if (Array.isArray(targetArray)) {
            targetArray.forEach((targetObj: unknown) => {
              const typedTargetObj = targetObj as Record<string, unknown>;
              connections.push({
                source: sourceId,
                target: typedTargetObj.node as string,
                type: connectionType,
              });
            });
          }
        });
      }
    });
  }

  const nodeTypes = [...new Set(nodes.map((n) => n.type))];
  const credentialTypes = extractCredentialTypes(nodes);
  const requiredTools = extractRequiredTools(nodes);
  const configurationSteps = generateConfigurationSteps(nodes, connections);
  const insights = generateInsights(nodes, connections, requiredTools);

  return {
    nodes,
    connections,
    totalNodes: nodes.length,
    nodeTypes,
    credentialTypes,
    requiredTools,
    configuration: configurationSteps,
    insights,
  };
}

function extractCredentialTypes(nodes: N8nNode[]): string[] {
  const credentials = new Set<string>();

  nodes.forEach((node) => {
    if (node.credentials && typeof node.credentials === "object") {
      Object.keys(node.credentials).forEach((key) => {
        credentials.add(key);
      });
    }

    if (node.parameters) {
      const paramStr = JSON.stringify(node.parameters);
      if (paramStr.includes("api") || paramStr.includes("token")) {
        const type = guessCredentialType(node.type);
        if (type) credentials.add(type);
      }
    }
  });

  return Array.from(credentials);
}

function guessCredentialType(nodeType: string): string | null {
  if (nodeType.includes("openai")) return "OpenAI API";
  if (nodeType.includes("slack")) return "Slack OAuth";
  if (nodeType.includes("hubspot")) return "HubSpot OAuth";
  if (nodeType.includes("gmail")) return "Gmail OAuth";
  if (nodeType.includes("http")) return "HTTP Authentication";
  if (nodeType.includes("database")) return "Database Connection";
  return null;
}

function extractRequiredTools(nodes: N8nNode[]): string[] {
  const tools = new Set<string>();

  nodes.forEach((node) => {
    if (node.type.includes("openai")) {
      tools.add("OpenAI Account & API Key");
    }
    if (node.type.includes("slack")) {
      tools.add("Slack Workspace & OAuth Token");
    }
    if (node.type.includes("gmail")) {
      tools.add("Google Account & Gmail Access");
    }
    if (node.type.includes("hubspot")) {
      tools.add("HubSpot Account & API Key");
    }
    if (node.type.includes("code")) {
      tools.add("JavaScript Knowledge");
    }
    if (node.type.includes("http")) {
      tools.add("Target API Documentation");
    }
    if (node.type.includes("database")) {
      tools.add("Database Credentials & Access");
    }
  });

  if (nodes.length > 0) {
    tools.add("n8n Account");
  }

  return Array.from(tools);
}

function generateConfigurationSteps(
  nodes: N8nNode[],
  connections: N8nConnection[]
): ConfigurationStep[] {
  return nodes.map((node) => {
    const requiredParameters: ParameterInfo[] = [];
    const optionalParameters: ParameterInfo[] = [];

    // Analyze parameters
    if (node.parameters && typeof node.parameters === "object") {
      Object.entries(node.parameters).forEach(([key, value]) => {
        const paramInfo: ParameterInfo = {
          name: key,
          type: typeof value,
          description: `Configure ${key}`,
          required: isParameterRequired(node.type, key),
          example: generateExample(key, value),
        };

        if (paramInfo.required) {
          requiredParameters.push(paramInfo);
        } else {
          optionalParameters.push(paramInfo);
        }
      });
    }

    const credentials = node.credentials
      ? Object.entries(node.credentials).map(([type]) => ({
          type,
          description: `Provide valid ${type} credentials`,
          required: true,
          setupInstructions: CREDENTIAL_SETUP_INSTRUCTIONS[
            type.toLowerCase().replace(/\s+/g, "")
          ],
        }))
      : [];

    const incomingConnections = connections.filter((c) => c.target === node.id);
    const outgoingConnections = connections.filter((c) => c.source === node.id);

    let instructions = `Step for ${node.name}:\n`;
    instructions += `Node Type: ${node.type}\n\n`;

    if (incomingConnections.length > 0) {
      instructions += `This node receives data from: ${incomingConnections.map((c) => c.source).join(", ")}\n`;
    }

    if (node.type.includes("trigger") || node.type.includes("webhook")) {
      instructions += `This is a trigger node that starts the workflow.\n`;
    }

    if (requiredParameters.length > 0) {
      instructions += `\nRequired Configuration:\n`;
      requiredParameters.forEach((param) => {
        instructions += `- ${param.name}: ${param.description}${param.example ? ` (Example: ${param.example})` : ""}\n`;
      });
    }

    if (credentials.length > 0) {
      instructions += `\nCredentials Required:\n`;
      credentials.forEach((cred) => {
        instructions += `- ${cred.type}: ${cred.description}\n`;
        if (cred.setupInstructions) {
          instructions += `  Setup: ${cred.setupInstructions}\n`;
        }
      });
    }

    if (outgoingConnections.length > 0) {
      instructions += `\nThis node sends data to: ${outgoingConnections.map((c) => c.target).join(", ")}\n`;
    }

    return {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      requiredParameters,
      optionalParameters,
      credentials,
      instructions,
    };
  });
}

function generateInsights(
  nodes: N8nNode[],
  connections: N8nConnection[],
  requiredTools: string[]
): string[] {
  const insights: string[] = [];

  if (nodes.length === 0) {
    insights.push("No nodes found in the flow");
    return insights;
  }

  // Check for trigger nodes
  const hasTrigger = nodes.some((n) =>
    ["webhook", "schedule", "trigger"].some((t) => n.type.toLowerCase().includes(t))
  );
  if (!hasTrigger) {
    insights.push(
      "⚠️ Warning: No trigger node found. The workflow won't start automatically."
    );
  } else {
    insights.push("✓ Trigger node found - workflow will start properly");
  }

  // Check for credentials
  const hasCredentials = nodes.some((n) => n.credentials && Object.keys(n.credentials).length > 0);
  if (!hasCredentials && nodes.some((n) => n.type.includes("openai") || n.type.includes("slack"))) {
    insights.push("⚠️ Credentials required: Add API keys and authentication tokens");
  } else if (hasCredentials) {
    insights.push("✓ Credentials are configured in the nodes");
  }

  // Check complexity
  if (nodes.length > 10) {
    insights.push("ℹ️ Complex workflow: This flow has many nodes and may take longer to configure");
  }

  // Check for branching logic
  const hasBranching = nodes.some((n) => n.type.includes("if"));
  if (hasBranching) {
    insights.push("✓ Conditional logic detected - flow has branching paths");
  }

  // Check for data transformation
  const hasTransformation = nodes.some(
    (n) =>
      n.type.includes("code") ||
      n.type.includes("function") ||
      n.type.includes("transform")
  );
  if (hasTransformation) {
    insights.push("✓ Data transformation nodes present - custom logic will process data");
  }

  // Summary
  insights.push(`\nFlow Summary: ${nodes.length} nodes, ${connections.length} connections`);
  insights.push(`Required integrations: ${requiredTools.length} external services`);

  return insights;
}

function isParameterRequired(nodeType: string, paramName: string): boolean {
  const requiredByNodeType: Record<string, string[]> = {
    "n8n-nodes-base.webhook": ["path"],
    "n8n-nodes-base.http": ["url", "method"],
    "n8n-nodes-base.openai": ["prompt"],
  };

  const required = requiredByNodeType[nodeType] || [];
  return required.includes(paramName);
}

function generateExample(key: string, value: unknown): string | undefined {
  if (typeof value === "string" && value.length > 50) {
    return value.substring(0, 50) + "...";
  }
  if (typeof value === "object") {
    return "[complex object]";
  }
  if (value === null || value === undefined) {
    return undefined;
  }
  return String(value);
}
