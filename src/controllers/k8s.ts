import express, { type Request, type Response } from 'express';
import K8sService from '../services/k8s.js';
import { log } from 'console';

class K8sController {

    private readonly k8s: K8sService;

    constructor() {
        this.k8s = new K8sService();
    }

    public listAllPods = async (req: Request, res: Response) => {
        try {
            const { namespace } = req.params;
            const result = await this.k8s.listPods(namespace as string);
            console.log(result);
            return res.status(200).json({
                result
            });
        } catch (error) {
            console.log('Failed to list pods', error);
        }
    }

    public describePod = async (req: Request, res: Response) => {
        try {
            const { namespace, podname } = req.params;
            const result = await this.k8s.describePod(namespace as string, podname as string);
            console.log(result);
            return res.status(200).json({
                result
            });
        } catch (error) {
            console.log('Failed to describe pod', error);
        }
    }

    public getContainerDetails = async (req: Request, res: Response) => {
        try {
            const { namespace, podname } = req.params;
            const result = await this.k8s.getContainerDetails(namespace as string, podname as string);
            return res.status(200).json({
                result
            });
        } catch (error) {
            console.log('Failed to fetch container details', error);
        }
    }

    public listNamespaces = async (req: Request, res: Response) => {
        try {
            const result = await this.k8s.listNamespace();
            return res.status(200).json({
                result
            });
        } catch (error) {
            console.log('Failed to list namespaces', error);
        }
    }

    public createNamespace = async (req: Request, res: Response) => {
        try {
            const { namespace } = req.body;
            const result = await this.k8s.createNamespace(namespace);
            return res.status(200).json({
                result
            });
        } catch (error) {
            console.log('Failed to create namespace', error);
        }
    }

    public listDeployments = async (req: Request, res: Response) => {
        try {
            const { namespace } = req.params;
            const result = await this.k8s.listDeployments(namespace as string);
            return res.status(200).json({
                result
            });
        } catch (error: any) {
            console.log(error.message, error);
            return error;
        }
    }

    public createDeployment = async (req: Request, res: Response) => {
        try {
            const { namespace, deploymentData } = req.body;
            const result = await this.k8s.createDeployment(namespace, deploymentData);
            res.status(200).json({
                result
            });
        } catch (error) {
            console.log('Failed to create deployment', error);
        }
    }

    public patchDeployment = async (req: Request, res: Response) => {
        try {
            const { namespace, name, patchData } = req.body;
            const result = await this.k8s.patchDeployment(namespace, name, patchData);
            res.status(result?.statusCode ?? 200).json({
                message: result?.message,
                status: result?.success
            });
        } catch (error) {
            console.log('Failed to create deployment', error);
            return res.status(500).json({
                message: "Failed to patch deployment",
                error: error
            });
        }
    }

    public listServices = async (req: Request, res: Response) => {
        try {
            const { namespace } = req.params
            const result = await this.k8s.listServices(namespace as string);
            return res.status(200).json({
                result
            });
        } catch (error) {
            console.log("Failed to list services");
            res.status(500).json({ error })
        }
    }

    public createService = async (req: Request, res: Response) => {
        try {
            const { namespace, serviceData } = req.body
            const result = await this.k8s.createService(namespace, serviceData);
            return res.status(200).json({
                result
            });
        } catch (error) {
            console.log("Failed to create service");
            res.status(500).json({ error })
        }
    }

    public patchService = async (req: Request, res: Response) => {
        try {
            const { namespace, name, patchData } = req.body;
            const result = await this.k8s.patchService(namespace, name, patchData);
            res.status(200).json({
                "message": "Service updated successfully",
                "status": "success",
                "data": result
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                "message": "Failed to update service",
                "error": error
            })
        }
    }
}


export default K8sController;