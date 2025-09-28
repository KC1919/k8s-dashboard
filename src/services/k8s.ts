import * as k8s from "@kubernetes/client-node";

class K8sService {

    private readonly kc: k8s.KubeConfig;
    private readonly k8sApi;

    constructor() {
        // Initialize Kubernetes client
        this.kc = new k8s.KubeConfig();
        this.kc.loadFromDefault();
        this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
    }

    // list pods in a namespace
    public async listPods(namespace: string): Promise<Array<any>> {
        const res = await this.k8sApi.listNamespacedPod({ namespace });
        return res.items.map((pod: k8s.V1Pod) => pod.metadata?.name);
    }

    //  describe a pod in a namespace
    public async describePod(namespace: string, podName: string): Promise<any> {
        const res = await this.k8sApi.readNamespacedPod({ name: podName, namespace });
        return res;
    }

    // fetch container details of a pod in a namespace
    public async getContainerDetails(namespace: string, podName: string): Promise<any> {
        const res = await this.describePod(namespace, podName);
        return res.spec.containers;
    }
}

export default K8sService;