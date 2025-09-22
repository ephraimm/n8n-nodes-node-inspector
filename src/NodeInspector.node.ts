import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class NodeInspector implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Node Inspector',
		name: 'nodeInspector',
		icon: 'fa:search',
		group: ['utility'],
		version: 1,
		description: 'List and inspect all available n8n nodes',
		defaults: {
			name: 'Node Inspector',
		},
		inputs: [{ type: NodeConnectionType.Main }],
		outputs: [{ type: NodeConnectionType.Main }],
		credentials: [
			{
				name: 'nodeInspectorApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'List Nodes',
						value: 'listNodes',
						description: 'Get a list of all available nodes',
						action: 'List all available nodes',
					},
				],
				default: 'listNodes',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'options',
				options: [
					{
						name: 'All Nodes',
						value: 'all',
						description: 'Include all nodes (core, community, and custom)',
					},
					{
						name: 'Community Nodes Only',
						value: 'community',
						description: 'Include only community nodes',
					},
				],
				default: 'all',
				description: 'Filter which types of nodes to include',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		const filter = this.getNodeParameter('filter', 0) as string;

		if (operation === 'listNodes') {
			try {
				// Import the router logic
				const { getFilteredNodes } = await import('./nodeInspectorLogic');
				const nodes = await getFilteredNodes(filter);

				returnData.push({
					json: {
						nodes,
						filter,
						totalCount: nodes.length,
					},
				});
			} catch (error) {
				throw new NodeOperationError(this.getNode(), `Failed to retrieve nodes: ${(error as Error).message}`);
			}
		}

		return [returnData];
	}
}