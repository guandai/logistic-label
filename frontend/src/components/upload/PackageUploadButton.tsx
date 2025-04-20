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

// // Extend the Window interface to include the 'socket' property
// declare global {
//   interface Window {
//     socket: Socket;
//   }
// }

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

// need to set to false at beginning
const socket = io(`${SOCKET_IO_HOST}`, { path: '/api/socket.io', autoConnect: false });

export const PackageUploadButton: React.FC<Prop> = (prop: Prop) => {
  const { closeButton, runStatus, setRunStatus, setMessage, headerMapping, uploadFile, validateForm, csvLength } = prop;
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [generateProgress, setGenerateProgress] = useState<number | null>(null);
  const [insertProgress, setInsertProgress] = useState<number | null>(null);
  const [errorResults, setErrorResults] = useState<object | undefined>(undefined);

  const setUploadError = (text: string) => setMessage({ text, level: 'error' });
  const setUploadInfo = (text: string) => setMessage({ text, level: 'info' });
  const setUploadSuccess = (text: string) => setMessage({ text, level: 'success' });

  useEffect(() => {
    // socket.on('connect', () => {
    //   const socketId = socket.id;
    //   socket.emit('register', { socketId });
    // });

    socket.on('insert', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setInsertProgress(progressPercentage);
    });

    socket.on('generate', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setGenerateProgress(progressPercentage);
    });

    if (runStatus === RunStatus.ready && !socket.connected) {
      console.log(`connecting to socket...`);
      socket.connect();
    }

    if (runStatus === RunStatus.done) {
      console.log(`disconnect, uploadProgress:`);
      socket.disconnect();
    }

    return () => {
      socket.off('generate');
      socket.off('insert');
    };
  }, [runStatus]);


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

  const downloadErrorButton = (data: object) => (
    <Button 
      variant="contained" color="primary" onClick={() => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'errorResults.json';
        a.click();
        URL.revokeObjectURL(url);
      }}>
      Download Details
    </Button>
  );

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
      
      setErrorResults(response.errors);
    } catch (error: any) {
      const err = error?.constructor.name === 'AxiosError' ? error?.response?.data?.message : error?.message;
      setUploadError(err || 'Failed to import packages.');
      setRunStatus(RunStatus.done);
    } finally {
      console.log(`disconnect, uploadProgress: ${uploadProgress}`);
      socket.disconnect();
    }
  };
  

  // Calculate the buffer value based on some logic or placeholder value
  const valueBuffer = insertProgress !== null ? Math.min(insertProgress + 20, 100) : 0;
  const progress = uploadProgress ? Math.round(uploadProgress) : 0;
  return (
    <>
      
      {runStatus === RunStatus.ready && <Button variant="contained" color="secondary" startIcon={<Upload />} component="label" >
        Submit File
        <button type="button" style={{ display: 'none' }} onClick={handleFileUpload} />
      </Button>}

      {uploadProgress !==null && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress color="success" variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary">
            {progress === 100 ? 'Done' : 'Uploading'}: {`${Math.round(progress)}%`}
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
        // make a download button , include the json file, the content is errorResults
        <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Box sx={{flexGrow: 1}} >
            {errorResults ? downloadErrorButton(errorResults) : null}
          </Box>
          <Box sx={{flexGrow: 1}} >
            {closeButton}
          </Box>
        </Box>
      )}
    </>
  );
};

export default PackageUploadButton;
