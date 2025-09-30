export interface DeploymentInput {
    name: string;
    replicas: number;
    image: string;
    tag: string;
    port: Array<number>;
    namespace: string;
}

export interface DeploymentPatch {
    name: string;
    op: string,
    path: string,
    value: string | number
}