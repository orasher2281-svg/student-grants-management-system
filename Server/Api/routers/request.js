import express from 'express';
import { checkAuth } from '../../middleware/checkAuthorization.js';
import { getActiveDraft, getRequestDetails, getRequestFile, getRequestStatus, getUnapprovedRequests, saveDraft, submitRequest, updateRequestStatus } from '../controllers/request.js';
import { upload } from '../../middleware/upload.js';
import { checkAdmin } from '../../middleware/checkAdmine.js';
const router= express.Router();
router.use(checkAuth);
const requestUploadFields = upload.fields([
    { name: 'studentIdCard', maxCount: 1 },
    { name: 'parentsIdCards', maxCount: 2 },
    { name: 'enrollmentCertificate', maxCount: 1 },
    { name: 'bankAccountConfirmation', maxCount: 1 }
]);
router.post('/saveDraft', requestUploadFields, saveDraft);
router.post('/submitRequest', requestUploadFields, submitRequest);
router.get('/getRequestStatus', getRequestStatus);
router.get('/getUnapprovedRequests', checkAdmin, getUnapprovedRequests);
router.put('/changeStatus/:requestId', checkAdmin, updateRequestStatus);
router.get('/getRequestDetails/:requestId', checkAdmin, getRequestDetails);
router.get('/getRequestFile/:requestId/:fileKey', checkAdmin, getRequestFile);
router.get('/getActiveDraft',getActiveDraft)

export default router;
   