import express, { type Request, type Response } from 'express';
import K8sService from '../services/k8s.js';

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
            res.status(200).json({
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
            res.status(200).json({
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
            res.status(200).json({
                result
            });
        } catch (error) {
            console.log('Failed to fetch container details', error);
        }
    }
}


export default K8sController;