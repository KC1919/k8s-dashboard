import express from "express";
import K8sController from "../controllers/k8s.js";

const router = express.Router();
const k8s = new K8sController();

router
    .get('/pods/:namespace', k8s.listAllPods)
    .get('/pods/:namespace/:podname', k8s.describePod)
    .get('/containers/:namespace/:podname', k8s.getContainerDetails)
    .get('/namespaces', k8s.listNamespaces)
    .get('/deployments/:namespace', k8s.listDeployments)
    .post('/namespaces/create', k8s.createNamespace)
    .post('/deployments/create', k8s.createDeployment)
    .patch('/deployments/update', k8s.patchDeployment)


export default router;