import { IWebhookDescription } from 'n8n-workflow';

export const webhooks: IWebhookDescription[] = [
    {
        // An internal name for this webhook definition.
        // Must be unique within this package if you have multiple.
        name: 'NodeInspectorApi',
        // This path is relative to the compiled output of this index.ts file (i.e., dist/index.js).
        // It tells n8n to load the router exported from dist/NodeInspectorApi.js
        routerPath: './NodeInspectorApi',
    },
]; 