import express from "express";
import K8sController from "../controllers/k8s.js";

const router = express.Router();
const k8s = new K8sController();

router
    .get('/pods/:namespace', k8s.listAllPods)
    .get('/pods/:namespace/:podname', k8s.describePod)
    .get('/containers/:namespace/:podname', k8s.getContainerDetails)


export default router;