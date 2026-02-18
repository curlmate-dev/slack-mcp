import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

const zAccessTokenResponse = z.object({
  accessToken: z.string(),
})

async function getAccessToken(jwt: string | undefined, connection: string | undefined) {
  if(!jwt || !connection) {
    throw new Error("missing jwt or connection in header");
  }
  const res = await fetch("https://curlmate.dev/api/token", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "x-connection": connection
    }
  });

  if (!res.ok) throw new Error(await res.text());
  const data = zAccessTokenResponse.parse(await res.json());
  return data.accessToken;
}

export class SlackMCP extends McpAgent<Env, {}> {
  server = new McpServer({
    name: "slack-mcp",
    version: "0.0.1",
  });

  async init() {
    this.server.registerTool(
      "auth_test",
      {
        description: "Authenticate user and workspace",
        inputSchema: {}
      },
      async ({}, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch("https://slack.com/api/auth.test", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          }
        })

        if (!response.ok) {
          return {
            content: [{ text: JSON.stringify(await response.text()), type: "text" }]
          }
        }

        return {
          content: [{ text: JSON.stringify(await response.json()), type: "text" }]
        };
      }
    );

    this.server.registerTool(
      "list_public_channels",
      {
        description: "List public channels in the workspace",
        inputSchema: {}
      },
      async ({}, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch("https://slack.com/api/conversations.list?types=public_channel", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          }
        })

        if (!response.ok) {
          return {
            content: [{ text: JSON.stringify(await response.text()), type: "text" }]
          }
        }

        return {
          content: [{ text: JSON.stringify(await response.json()), type: "text" }]
        };
      }
    );

    this.server.registerTool(
      "list_channel_types",
      {
        description: "List all channel types (public, private, IM, MPIM)",
        inputSchema: {}
      },
      async ({}, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch("https://slack.com/api/conversations.list?types=public_channel,private_channel,im,mpim", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          }
        })

        if (!response.ok) {
          return {
            content: [{ text: JSON.stringify(await response.text()), type: "text" }]
          }
        }

        return {
          content: [{ text: JSON.stringify(await response.json()), type: "text" }]
        };
      }
    );

    this.server.registerTool(
      "post_message",
      {
        description: "Post a message to a Slack channel",
        inputSchema: { 
          channel: z.string(),
          text: z.string()
        }
      },
      async ({ channel, text }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ channel, text })
        })

        if (!response.ok) {
          return {
            content: [{ text: JSON.stringify(await response.text()), type: "text" }]
          }
        }

        return {
          content: [{ text: JSON.stringify(await response.json()), type: "text" }]
        };
      }
    );

    this.server.registerTool(
      "list_conversations",
      {
        description: "List all conversations in the workspace",
        inputSchema: {}
      },
      async ({}, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch("https://slack.com/api/conversations.list", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          }
        })

        if (!response.ok) {
          return {
            content: [{ text: JSON.stringify(await response.text()), type: "text" }]
          }
        }

        return {
          content: [{ text: JSON.stringify(await response.json()), type: "text" }]
        };
      }
    );

    this.server.registerTool(
      "get_user_info",
      {
        description: "Get information about a Slack user",
        inputSchema: { 
          user: z.string()
        }
      },
      async ({ user }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch(`https://slack.com/api/users.info?user=${user}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          }
        })

        if (!response.ok) {
          return {
            content: [{ text: JSON.stringify(await response.text()), type: "text" }]
          }
        }

        return {
          content: [{ text: JSON.stringify(await response.json()), type: "text" }]
        };
      }
    );

    this.server.registerTool(
      "list_workspace_users",
      {
        description: "List all users in the workspace",
        inputSchema: {}
      },
      async ({}, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch("https://slack.com/api/users.list", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          }
        })

        if (!response.ok) {
          return {
            content: [{ text: JSON.stringify(await response.text()), type: "text" }]
          }
        }

        return {
          content: [{ text: JSON.stringify(await response.json()), type: "text" }]
        };
      }
    );
  }

  onError(_: unknown, error?: unknown): void | Promise<void> {
    console.error("SlackMCP initialization error:", error);
  }
}

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/sse")) {
      return SlackMCP.serveSSE("/sse", { binding: "SlackMCP" }).fetch(
        request,
        env,
        ctx
      );
    }

    if (url.pathname.startsWith("/mcp")) {
      return SlackMCP.serve("/mcp", { binding: "SlackMCP" }).fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  }
};
