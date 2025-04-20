import React, { useState, useEffect } from 'react';
import { AxiosProgressEvent } from 'axios';
import {
  Typography, Box, Button,
  LinearProgress
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { SetMessage } from '../../util/errors';
import { HeaderMapping } from '@ddlabel/shared';
import { PackageApi } from '../../api/PackageApi';
import { DownloadErrorButton } from './DownloadErrorButton';
import { useSocket } from './useSocket';

export enum RunStatus {
  'ready', 'running', 'done'
};

type Prop = {
  closeButton: JSX.Element;
  setMessage: SetMessage;
  runStatus: RunStatus;
  setRunStatus: (status: RunStatus) => void;
  headerMapping: HeaderMapping;
  uploadFile: File;
  validateForm: () => boolean;
  csvLength: number;
};

// const socket = io(`${SOCKET_IO_HOST}`, { path: '/api/socket.io', autoConnect: false });
export const PackageUploadButton: React.FC<Prop> = (prop: Prop) => {
  const { closeButton, runStatus, setRunStatus, setMessage, headerMapping, uploadFile, validateForm, csvLength } = prop;
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [generateProgress, setGenerateProgress] = useState<number | null>(null);
  const [insertProgress, setInsertProgress] = useState<number | null>(null);
  const [errorResults, setErrorResults] = useState<unknown[] | undefined>(undefined);

  const setUploadError = (text: string) => setMessage({ text, level: 'error' });
  const setUploadInfo = (text: string) => setMessage({ text, level: 'info' });
  const setUploadSuccess = (text: string) => setMessage({ text, level: 'success' }); 
  const socket = useSocket(runStatus, setInsertProgress, setGenerateProgress);
 
  useEffect(() => {
    if (errorResults) {
      console.log('Error results updated:', errorResults);
    }
  }, [errorResults]);

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const total = progressEvent.total;
    if (total) {
      setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
    }

    if (progressEvent.loaded === total) {
      setUploadProgress(100);
      setUploadInfo('Upload Done. Preparing data...');
    }
  };

  const getFormData = () => {
    if (validateForm && !validateForm()) {
      setUploadError('Validation failed. Please check the form.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setUploadInfo('Please login');
      return;
    }

    const formData = new FormData();
    formData.append('packageCsvFile', uploadFile);
    formData.append('packageCsvLength', csvLength?.toString() || '0');
    formData.append('packageCsvMap', JSON.stringify(headerMapping));

    return formData;
  }

  const handleFileUpload = async () => {

    try {
      const formData = getFormData();
      if (!formData) {
        return
      }

      setRunStatus(RunStatus.running);
      const response = await new PackageApi().importPackage(formData, onUploadProgress, socket.id);

      setRunStatus(RunStatus.done);
      setUploadSuccess(`Import Done - ${response.message}`);
      
    } catch (error: any) {
      const errMsg = error?.constructor.name === 'AxiosError' 
        ? error?.response?.data?.message 
        : error?.message;
      const errErrors = error?.constructor.name === 'AxiosError' 
        ? error?.response?.data?.errors 
        : error?.errors;

      setUploadError(errMsg || 'Failed to import packages.');
      setRunStatus(RunStatus.done);
      setErrorResults(errErrors);
    }
  };

  const valueBuffer = insertProgress !== null ? Math.min(insertProgress + 20, 100) : 0;
  const progress = uploadProgress ? Math.round(uploadProgress) : 0;

  return (
    <>
      {runStatus === RunStatus.ready && (
        <Button variant="contained" color="secondary" startIcon={<Upload />} component="label">
          Submit File
          <button type="button" style={{ display: 'none' }} onClick={handleFileUpload} />
        </Button>
      )}

      {uploadProgress !== null && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress color="success" variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary">
            {progress === 100 ? 'Done' : 'Uploading'}: {`${progress}%`}
          </Typography>
        </Box>
      )}

      {generateProgress !== null && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress color="warning" variant="determinate" value={generateProgress} />
          <Typography variant="body2" color="textSecondary">Generating: {`${Math.round(generateProgress)}%`}</Typography>
        </Box>
      )}

      {insertProgress !== null && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="buffer" value={insertProgress} valueBuffer={valueBuffer} />
          <Typography variant="body2" color="textSecondary">Inserting: {`${Math.round(insertProgress)}%`}</Typography>
        </Box>
      )}

      {runStatus === RunStatus.done && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            { !!errorResults?.length ? <DownloadErrorButton data={errorResults} /> : null }
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            {closeButton}
          </Box>
        </Box>
      )}
    </>
  );
};

export default PackageUploadButton;
