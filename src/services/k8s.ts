import * as k8s from "@kubernetes/client-node";
import { DeploymentInput, DeploymentPatch } from "../utils/interfaces/inputs.js";
import { renderTemplate } from "../utils/render_template.js";

class K8sService {

    private readonly kc: k8s.KubeConfig;
    private readonly k8sApi;
    private readonly appsApi;

    constructor() {
        // Initialize Kubernetes client
        this.kc = new k8s.KubeConfig();
        this.kc.loadFromDefault();
        this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
        this.appsApi = this.kc.makeApiClient(k8s.AppsV1Api);
    }

    // list pods in a namespace
    public async listPods(namespace: string): Promise<Array<any>> {

        try {
            const res = await this.k8sApi.listNamespacedPod({ namespace });
            return res.items.map((pod: k8s.V1Pod) => pod.metadata?.name);
        } catch (error: any) {
            throw new Error("Failed to list pods", error);
        }
    }

    //  describe a pod in a namespace
    public async describePod(namespace: string, podName: string): Promise<any> {

        try {
            const res = await this.k8sApi.readNamespacedPod({ name: podName, namespace });
            return res;
        } catch (error: any) {
            throw new Error("Failed to describe pod", error);
        }
    }

    // fetch container details of a pod in a namespace
    public async getContainerDetails(namespace: string, podName: string): Promise<any> {
        try {
            const res = await this.describePod(namespace, podName);
            return res.spec.containers;
        } catch (error: any) {
            throw new Error("Failed to get container details", error);
        }
    }

    // list all namespaces
    public async listNamespace() {
        try {
            const res = await this.k8sApi.listNamespace();
            return res.items.map((item) => item.metadata?.name)
        } catch (error: any) {
            throw new Error("Failed list namespaces", error);
        }
    }

    public async createNamespace(namespace: string) {
        try {

            const namespaces = await this.listNamespace();

            if (namespaces.indexOf(namespace)) {
                throw new Error("Namespace already exist!");
            }

            const namespaceManifest: k8s.V1Namespace = {
                metadata: {
                    name: namespace
                }
            };
            const res = await this.k8sApi.createNamespace({ body: namespaceManifest });
            return res;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async listDeployments(namespace: string) {
        try {

            const namespaces = await this.listNamespace();

            if (!namespaces.indexOf(namespace)) {
                return {
                    statusCode: 400,
                    message: "Namespace does not exist",
                    success: "fail"
                }
            }

            const res = await this.appsApi.listNamespacedDeployment({ namespace });
            return res;
        } catch (error: any) {
            throw new Error("Failed to list deployments", error);
        }
    }

    public async listDeploymentNames(namespace: string) {
        try {
            const deployments = await this.listDeployments(namespace);

            const deplymentsNameList = deployments.items.filter((deployment: k8s.V1Deployment) => {
                return deployment.name;
            });

            return deplymentsNameList;
        } catch (error) {
            console.log("Failed to get deployments name list");
        }
    }

    public async createDeployment(namespace: string, data: DeploymentInput) {
        try {
            // check if deployment already exist
            const deployments = await this.listDeploymentNames(namespace);

            if (deployments.indexOf(data.name)) {
                console.log("Deployment with this name already exist");
                return;
            }

            const deploymentObj: k8s.V1Deployment = await renderTemplate('../K8s-Dashboard/src/templates/k8s/deployment.json', data);
            const res = await this.appsApi.createNamespacedDeployment({ namespace, body: deploymentObj });
            return res;
        } catch (error: any) {
            console.log(error);
            throw new Error("Failed to create deployment", error)
        }
    }

    public async patchDeployment(namespace: string, name: string, patchData: DeploymentPatch) {
        try {
            // fetch deployment to update
            const deployment = await this.appsApi.readNamespacedDeployment({ namespace, name });

            // check if deployment exist
            if (!deployment) {
                console.log("Deployment does not exist");
                return;
            }

            // update deployment with new values
            const res = await this.appsApi.patchNamespacedDeployment({
                "name": name,
                "namespace": namespace,
                "body": patchData
            });

            return {
                "statusCode": Number(200),
                "message": "Deployment patched successfully",
                "success": true
            }

        } catch (error) {
            console.log("Failed to update deployment", error);
            throw new Error("Failed to update deployment");
        }
    }
}

export default K8sService;