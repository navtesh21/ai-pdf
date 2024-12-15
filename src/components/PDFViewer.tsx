import React from "react";

function PDFViewer({ pdfUrl }: { pdfUrl: string }) {
  console.log(pdfUrl);
  return (
    <div className="w-full h-full">
      <object className="pdf w-full h-full" type="application/pdf" data={pdfUrl}></object>
    </div>
  );
}

export default PDFViewer;
