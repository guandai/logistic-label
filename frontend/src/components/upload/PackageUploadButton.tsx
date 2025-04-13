import React, { useState, useEffect } from 'react';
import { AxiosProgressEvent } from 'axios';
import {
  Typography, Box, Button,
   LinearProgress
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { io } from 'socket.io-client';
import { SetMessage } from '../../util/errors';
import { HeaderMapping } from '@ddlabel/shared';
import { PackageApi } from '../../api/PackageApi';
import { SOCKET_IO_HOST } from '../../env_var';

const socket = io(`${SOCKET_IO_HOST}`, { path: '/api/socket.io' });

export enum RunStatus {
  'ready' , 'running' , 'done'
} ;

type Prop = {
  setMessage: SetMessage;
  runStatus: RunStatus;
  setRunStatus: (status: RunStatus) => void;
  headerMapping: HeaderMapping;
  uploadFile: File;
  validateForm: () => boolean;
  csvLength: number;
};

export const PackageUploadButton: React.FC<Prop> = (prop: Prop) => {
  const { runStatus, setRunStatus, setMessage, headerMapping, uploadFile, validateForm, csvLength } = prop;
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [generateProgress, setGenerateProgress] = useState<number | null>(null);
  const [insertProgress, setInsertProgress] = useState<number | null>(null);
  const setUploadError = (text: string) => setMessage({ text, level: 'error' });
  const setUploadInfo = (text: string) => setMessage({ text, level: 'info' });
  const setUploadSuccess = (text: string) => setMessage({ text, level: 'success' });

  useEffect(() => {
    socket.on('insert', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setInsertProgress(progressPercentage);
    });

    socket.on('generate', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setGenerateProgress(progressPercentage);
    });

    return () => {
      socket.off('generate');
      socket.off('insert');
    };
  }, []);

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const total = progressEvent.total;
    if (total) {
      setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
    }

    if (progressEvent.loaded === total) {
      setUploadProgress(100);
      setUploadInfo('Upload Done. preparing data...');
    }
  };

  const handleFileUpload = async (e: any) => {
    if (validateForm && !validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) { return setUploadInfo('Please login'); }

    try {
      const formData = new FormData();
      const packageCsvFile = uploadFile;
      formData.append('packageCsvFile', packageCsvFile);
      formData.append('packageCsvLength', csvLength?.toString() || '0');
      formData.append('packageCsvMap', JSON.stringify(headerMapping));

      setRunStatus(RunStatus.running);
      const response = await new PackageApi().importPackage(formData, onUploadProgress, socket.id);

      setRunStatus(RunStatus.done);
      setUploadSuccess(`Import Done - ${response.message}`);
      
    } catch (error: any) {
      const err = error?.constructor.name === 'AxiosError' ? error?.response?.data?.message : error?.message;
      setUploadError(err || 'Failed to import packages.');
    }
  };

  // Calculate the buffer value based on some logic or placeholder value
  const valueBuffer = insertProgress !== null ? Math.min(insertProgress + 20, 100) : 0;
  return (
  <>
    {runStatus === RunStatus.ready && <Button variant="contained" color="secondary" startIcon={<Upload />} component="label" >
      Submit File
     <button type="button" style={{ display: 'none' }} onClick={handleFileUpload} />
    </Button>}

    {uploadProgress !== null && (
      <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress color="success" variant="determinate" value={uploadProgress} />
      <Typography variant="body2" color="textSecondary">Uploading: {`${Math.round(uploadProgress)}%`}</Typography>
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
  </>
  );
};

export default PackageUploadButton;
