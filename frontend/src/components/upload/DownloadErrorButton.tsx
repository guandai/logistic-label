import Button from "@mui/material/Button";
import React from "react";

export const DownloadErrorButton: React.FC<{ dataStr: string, text: String }> = ({ dataStr, text }) => (
  <Button
    variant="contained"
    color="primary"
    sx={{ mr:2 }}
    onClick={() => {
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'errorResults.json';
      a.click();
      URL.revokeObjectURL(url);
    }}
  >
    {text || 'Download Detail'}
  </Button>
);

export default DownloadErrorButton;
