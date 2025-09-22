import { Container } from 'typedi';
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export async function getFilteredNodes(filter: string) {
  try {
    const nodeTypesInstance = Container.get('NodeTypes') as any;
    const allNodeTypes: INodeType[] = nodeTypesInstance.getAll();

    const nodes = allNodeTypes.map((nodeType: INodeType) => {
      const description = nodeType.description as INodeTypeDescription | undefined;

      if (!description) {
        return {
          name: (nodeType as any).type,
          displayName: 'N/A (No description)',
          type: determineNodeType((nodeType as any).type),
          version: 'N/A',
          description: 'Node description unavailable.',
          inputs: [],
          outputs: [],
          credentials: [],
          properties: [],
        };
      }

      return {
        name: (nodeType as any).type,
        displayName: description.displayName,
        type: determineNodeType((nodeType as any).type),
        version: description.version,
        description: description.description,
        inputs: description.inputs || [],
        outputs: description.outputs || [],
        credentials: description.credentials || [],
        properties: description.properties,
      };
    });

    // Apply filter
    if (filter === 'community') {
      return nodes.filter(node => node.type === 'community');
    }

    return nodes;
  } catch (error) {
    throw new Error(`Failed to retrieve nodes: ${error}`);
  }
}

function determineNodeType(name: string): string {
  if (name.startsWith('n8n-nodes-base.')) return 'core';
  if (name.startsWith('n8n-nodes-')) return 'core-contrib';
  if (name.startsWith('@')) return 'community';
  return 'custom';
}