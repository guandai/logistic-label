import Button from "@mui/material/Button";
import React from "react";

export const DownloadErrorButton: React.FC<{ data: unknown[] }> = ({ data }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={() => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'errorResults.json';
      a.click();
      URL.revokeObjectURL(url);
    }}
  >
    Download Details
  </Button>
);

export default DownloadErrorButton;
