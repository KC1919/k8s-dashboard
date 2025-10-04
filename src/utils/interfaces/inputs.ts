export interface DeploymentInput {
    name: string;
    replicas: number;
    image: string;
    tag: string;
    port: Array<number>;
    namespace: string;
}

export interface PatchInput {
    op: string,
    path: string,
    value: string | number
}

export interface ServiceInput {
    name: string,
    serviceType: string,
    appName: string,
    ports: Array<{
        protocol: string,
        port: number,
        targetPort: number
        nodeport?: number
    }>,
}