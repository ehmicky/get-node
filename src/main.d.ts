export type NodeMeta = {
	path: string;
	version: string;
};

export default function getNode(
	version: string,
	options?: {
		output?: string;
		progress?: boolean;
		mirror?: string;
		fetch?: boolean;
		arch?: string;
		cwd?: string;
	}
): Promise<NodeMeta>;
