import React from 'react';
import Draggable from "react-draggable";
import { Prism as SynataxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

function PresentationCode({
  data,
  showCodeModal,
  setCodeBlockSize,
  setCodeContent,
  setCodeFontSize,
  setCodeLanguage,
  setSelectedElementId,
}) {
  return (
    <Draggable>
      <div
        style={{
          width: `${data?.codeBlockSize?.width}px`,
          height: `${data?.codeBlockSize?.length}px`,
          fontSize: `${data?.codeFontSize}em`,
        }}
        className="border border-gray-300"
        onDoubleClick={() => {
          setCodeBlockSize(data.codeBlockSize);
          setCodeContent(data.codeContent);
          setCodeFontSize(data.codeFontSize);
          setCodeLanguage(data.codeLanguage);
          setSelectedElementId(data.id);
          showCodeModal();
        }}
      >
        {data ? (
          <SynataxHighlighter
            language={data.codeLanguage?.toLowerCase()}
            style={tomorrow}
            customStyle={{
              backgroundColor: 'transparent',
              margin: 0,
              padding: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {data.codeContent}
          </SynataxHighlighter>
        ) : null}
      </div>
    </Draggable>
  )
}

export default PresentationCode