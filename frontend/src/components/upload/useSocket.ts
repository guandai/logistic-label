import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { RunStatus } from './PackageUploadButton';
import { SOCKET_IO_HOST } from '../../env_var';

const socket = io(SOCKET_IO_HOST, { path: '/api/socket.io', autoConnect: false });

export const useSocket = (
  runStatus: RunStatus,
  setInsertProgress: React.Dispatch<React.SetStateAction<number | null>>,
  setGenerateProgress: React.Dispatch<React.SetStateAction<number | null>>
) => {
  

  const getProgress = (
    name: string, 
    hook: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    socket.on(name, (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      hook(progressPercentage);
    })
  };

  useEffect(() => {
    getProgress('insert', setInsertProgress);
    getProgress('generate', setGenerateProgress);

    if (runStatus === RunStatus.ready && !socket.connected) {
      console.log('Connecting to socket...');
      socket.connect();
    }

    if (runStatus === RunStatus.done) {
      socket.off('generate');
      socket.off('insert');
      socket.disconnect();
    }

    return () => {
      socket.off('generate');
      socket.off('insert');
    };
  }, [runStatus, setInsertProgress, setGenerateProgress]);

  return socket;
};

export default useSocket;
