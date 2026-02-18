# Slack Remote MCP

This remote MCP Agent runs in wrangler and is deployed to cloudflare worker.
Tools implemented:  
`auth_test`, `list_public_channels`, `list_channel_types`, `post_message`, `list_conversations`, `get_user_info`, `list_workspace_users`

## Claude Desktop Config
```
"slack": {
  "command": "npx",
  "args": [
    "-y",
    "mcp-remote",
    "https://slack-mcp.curlmate.workers.dev/mcp",
    "--header",
    "access-token: your Slack Access Token from https://curlmate.dev"
  ]
}
```

## Instruction

```sh
npm install
npm start
```

This will start an MCP server on `http://localhost:5174/mcp`

Inside your `McpAgent`'s `init()` method, you can define resources, tools, etc:

```ts
export class MyMCP extends McpAgent<Env> {
  server = new McpServer({
    name: "Demo",
    version: "1.0.0"
  });

  async init() {
    this.server.resource("counter", "mcp://resource/counter", (uri) => {
      // ...
    });

    this.server.registerTool(
      "add",
      {
        description: "Add to the counter, stored in the MCP",
        inputSchema: { a: z.number() }
      },
      async ({ a }) => {
        // add your logic here
      }
    );
  }
}
```

## API Endpoints

auth user and workspace -
curl -X POST "https://slack.com/api/auth.test" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

list public channels -
curl -X GET "https://slack.com/api/conversations.list?types=public_channel" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

list channel types -
curl -X GET "https://slack.com/api/conversations.list?types=public_channel,private_channel,im,mpim" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

post messsage - 
curl -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "CHANNEL_ID",
    "text": "Hello from curl 🚀"
  }'

list conversations -
curl -X GET "https://slack.com/api/conversations.list" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

get user info -
curl -X GET "https://slack.com/api/users.info?user=USER_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

list workspace users -
curl -X GET "https://slack.com/api/users.list" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
