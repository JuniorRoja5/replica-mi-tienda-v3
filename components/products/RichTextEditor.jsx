
import 'react-quill/dist/quill.snow.css';
import React, { useState, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadFile } from "@/api/integrations";
import VideoEmbedModal from './VideoEmbedModal';

// 1. OBTENER QUILL Y DEFINIR BLOTS PERSONALIZADOS (LÓGICA RECONSTRUIDA)
const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import('blots/block/embed');

// Blot personalizado para IFRAMEs (YouTube, Vimeo) con un div contenedor para estilos
class IframeVideoBlot extends BlockEmbed {
  static create(url) {
    const node = super.create(); // Creates a div because tagName is 'div'
    node.setAttribute('class', 'video-wrapper');

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    // Attributes like width/height/style are now controlled by CSS on the wrapper and iframe inside.
    node.appendChild(iframe);
    return node;
  }
  static value(node) {
    const iframe = node.querySelector('iframe');
    return iframe ? iframe.getAttribute('src') : null;
  }
}
IframeVideoBlot.blotName = 'iframe_video';
IframeVideoBlot.tagName = 'div'; // The blot itself is now the wrapper div
Quill.register(IframeVideoBlot);

// Blot personalizado para videos subidos (<video>) con un div contenedor para estilos
class Html5VideoBlot extends BlockEmbed {
  static create(url) {
    const node = super.create(); // Creates a div because tagName is 'div'
    node.setAttribute('class', 'video-wrapper');

    const video = document.createElement('video');
    video.setAttribute('src', url);
    video.setAttribute('controls', 'true');
    // Attributes like width/height/style are now controlled by CSS on the wrapper and video inside.
    node.appendChild(video);
    return node;
  }
  static value(node) {
    const video = node.querySelector('video');
    return video ? video.getAttribute('src') : null;
  }
}
Html5VideoBlot.blotName = 'html5_video';
Html5VideoBlot.tagName = 'div'; // The blot itself is now the wrapper div
Quill.register(Html5VideoBlot);


const RichTextEditor = forwardRef(({ value, onChange, placeholder }, ref) => {
  const quillRef = useRef(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useImperativeHandle(ref, () => ({
    insertTextAtCursor: (text) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true) || { index: editor.getLength() };
        editor.insertText(range.index, text, Quill.sources.USER);
        editor.setSelection(range.index + text.length, Quill.sources.SILENT);
      }
    },
    insertHTMLAtCursor: (html) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true) || { index: editor.getLength() };
        editor.clipboard.dangerouslyPasteHTML(range.index, html, Quill.sources.USER);
        editor.setSelection(range.index + 1, Quill.sources.SILENT);
      }
    }
  }));

  const handleVideoInsert = () => {
    setShowVideoModal(true);
  };
  
  const convertToEmbedUrl = (url) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;

    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    
    return url;
  };

  // 2. HANDLER PARA INCRUSTAR URL (YOUTUBE/VIMEO) USANDO EL BLOT
  const handleEmbed = (url) => {
    if (url && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true) || { index: editor.getLength() };
      const embedUrl = convertToEmbedUrl(url);
      editor.insertEmbed(range.index, 'iframe_video', embedUrl, Quill.sources.USER);
      editor.setSelection(range.index + 1, Quill.sources.SILENT);
    }
    setShowVideoModal(false);
  };

  // 3. HANDLER PARA SUBIR VIDEO USANDO EL BLOT
  const handleVideoUpload = async (file) => {
    if (file && quillRef.current) {
      try {
        const { file_url } = await UploadFile({ file });
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true) || { index: editor.getLength() };
        editor.insertEmbed(range.index, 'html5_video', file_url, Quill.sources.USER);
        editor.setSelection(range.index + 1, Quill.sources.SILENT);
        return true;
      } catch (error) {
        console.error("Error uploading video:", error);
        return false;
      }
    }
    return false;
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        video: handleVideoInsert,
      },
    },
  }), []);

  return (
    <>
      <div className="bg-white rounded-lg quill-container">
        <style jsx>{`
          .quill-container .ql-editor {
            min-height: 150px;
            font-size: 14px;
            line-height: 1.6;
            padding: 12px 15px;
            border: none;
            outline: none;
          }
          
          .quill-container .ql-toolbar {
            border: none;
            border-bottom: 1px solid #e2e8f0;
            padding: 8px 12px;
          }
          
          .quill-container .ql-container {
            border: none;
            font-family: inherit;
          }
          
          .quill-container .ql-editor.ql-blank::before {
            color: #94a3b8;
            font-style: normal;
          }

          /* Estilos para variables de email */
          .quill-container .ql-editor .email-variable {
            background-color: #3b82f6;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin: 0 2px;
            cursor: pointer;
            position: relative;
            user-select: none; /* Prevent selection into the variable text itself */
          }
          
          .quill-container .ql-editor .email-variable:hover {
            background-color: #2563eb;
          }
          
          .quill-container .ql-editor .email-variable::after {
            content: "×";
            font-size: 14px;
            font-weight: bold;
            margin-left: 4px;
            opacity: 0.7;
          }
          
          .quill-container .ql-editor .email-variable:hover::after {
            opacity: 1;
          }

          /* Estilos para videos embebidos */
          .quill-container :global(.ql-editor .video-wrapper) {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            margin: 15px 0;
            border-radius: 8px;
            overflow: hidden;
            background: #000;
          }
          
          .quill-container :global(.ql-editor .video-wrapper iframe),
          .quill-container :global(.ql-editor .video-wrapper video) {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
          
          .quill-container :global(.ql-editor .video-wrapper video) {
            object-fit: cover;
          }
          
          .quill-container :global(.ql-editor .video-placeholder) {
            background: #f1f5f9;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            color: #64748b;
            margin: 15px 0;
          }
          
          .quill-container :global(.ql-editor .video-placeholder):hover {
            background: #e2e8f0;
            border-color: #94a3b8;
          }
        `}</style>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
        />
      </div>
      
      <VideoEmbedModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        onEmbed={handleEmbed}
        onUpload={handleVideoUpload}
      />
    </>
  );
});

export default RichTextEditor;
