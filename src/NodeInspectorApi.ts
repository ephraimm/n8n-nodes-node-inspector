import { Router } from 'express';
import { Container } from 'typedi';
import { NodeTypes, INodeType, INodeTypeDescription } from 'n8n-workflow'; // Added INodeType and INodeTypeDescription for better typing

const router = Router();

router.get('/custom/nodes', async (req, res) => {
  try {
    const nodeTypesInstance = Container.get(NodeTypes);
    const allNodeTypes: INodeType[] = nodeTypesInstance.getAll();

    const nodes = allNodeTypes.map((nodeType) => {
      // Ensure node.description exists before trying to access its properties
      const description = nodeType.description as INodeTypeDescription | undefined;

      if (!description) {
        // This case should be rare for well-formed nodes
        return {
          name: nodeType.name,
          displayName: 'N/A (No description)',
          type: determineNodeType(nodeType.name),
          version: 'N/A',
          description: 'Node description unavailable.',
          inputs: [],
          outputs: [],
          credentials: [],
          properties: [],
        };
      }

      return {
        name: nodeType.name,
        displayName: description.displayName,
        type: determineNodeType(nodeType.name),
        version: description.version,
        description: description.description,
        // inputs and outputs are arrays of strings like ['main'] or ['main', 'error']
        inputs: description.inputs || [],
        outputs: description.outputs || [],
        credentials: description.credentials || [],
        properties: description.properties,
      };
    });

    res.json(nodes);
  } catch (error) {
    console.error('Failed to retrieve nodes:', error);
    res.status(500).json({ error: 'Failed to retrieve nodes.', details: (error as Error).message });
  }
});

function determineNodeType(name: string): string {
  if (name.startsWith('n8n-nodes-base.')) return 'core'; // n8n core nodes often start with 'n8n-nodes-base.'
  if (name.startsWith('n8n-nodes-')) return 'core-contrib'; // Other nodes shipped with n8n but not in base
  if (name.startsWith('@')) return 'community'; // Typically scoped packages
  return 'custom'; // Or unknown
}

export default router; 