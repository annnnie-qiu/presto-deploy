import React, { useEffect, useRef } from 'react';
import Draggable from "react-draggable";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import Handlebars from 'handlebars';

function PresentationCode({
  data,
  showCodeModal,
  setCodeBlockSize,
  setCodeContent,
  setCodeFontSize,
  setSelectedElementId,
}) {
  const codeRef = useRef(null);

  // escape HTML using Handlebars
  const escapeHtml = (unsafeHtml) => {
    return Handlebars.Utils.escapeExpression(unsafeHtml);
  };

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted');
      codeRef.current.classList.remove(...Array.from(codeRef.current.classList).filter(cls => cls.startsWith('hljs')));

      // Set the escaped content to the code element
      codeRef.current.innerHTML = escapeHtml(data.codeContent);
      
      // Highlight the element
      hljs.highlightElement(codeRef.current);
    }
  }, [data.codeContent]);

  return (
    <Draggable>
      <div
        style={{
          width: `${data?.codeBlockSize?.width}%`,
          height: `${data?.codeBlockSize?.length}%`,
          fontSize: `${data?.codeFontSize}em`,
          overflow: "hidden",
          margin: "0px",
          padding: "0px",
          backgroundColor: "transparent",
        }}
        className="border border-gray-300"
        onDoubleClick={() => {
          setCodeBlockSize(data.codeBlockSize);
          setCodeContent(data.codeContent);
          setCodeFontSize(data.codeFontSize);
          setSelectedElementId(data.id);
          showCodeModal();
        }}
      >
        <pre
          style={{
            margin: "0",
            padding: "0",
            textAlign: "left",
            overflow: "auto",
            height: "100%",
            width: "100%",
          }}
        >
          <code
            ref={codeRef}
            style={{
              margin: '0',
              padding: '0',
              textAlign: 'left',
              display: 'block',
            }}
          ></code>
        </pre>
      </div>
    </Draggable>
  );
}

export default PresentationCode;
