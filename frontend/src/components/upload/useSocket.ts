import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { RunStatus } from './PackageUploadButton';
import { SOCKET_IO_HOST } from '../../env_var';

const socket = io(SOCKET_IO_HOST, { path: '/api/socket.io', autoConnect: false });

export type ProgressData = {
  processed: number;
  total: number
};

export const useSocket = (
  runStatus: RunStatus,
  setInsertProgress: React.Dispatch<React.SetStateAction<number | null>>,
  setGenerateProgress: React.Dispatch<React.SetStateAction<number | null>>
) => {
  const getProgress = (
    name: string, 
    hook: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    socket.on(name, ({ processed, total }: ProgressData) => {
      const progressPercentage = Math.round((processed / total) * 100);
      hook(progressPercentage);
    })
  };

  const stopSocket = () => {
    socket.off('generate');
    socket.off('insert');
    socket.disconnect();
    socket.removeAllListeners();
  }
  useEffect(() => {
    getProgress('insert', setInsertProgress);
    getProgress('generate', setGenerateProgress);

    if (runStatus === RunStatus.ready && !socket.connected) {
      console.log('Connecting to socket...');
      socket.connect();
    }

    if (runStatus === RunStatus.done) {
      console.log(`dis`);
      stopSocket();
    }

  }, [runStatus, setInsertProgress, setGenerateProgress]);

  return socket;
};

export default useSocket;
