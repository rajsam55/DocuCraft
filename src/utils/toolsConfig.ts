import { ToolInfo } from "../types";

export const TOOLS_LIST: ToolInfo[] = [
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one single, organized PDF document in your preferred order.",
    category: "pdf",
    iconName: "FileStack",
    popular: true,
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Extract specific page ranges or split every single page into separate PDF documents.",
    category: "pdf",
    iconName: "Scissors",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce file size of your PDF while optimizing for maximum possible visual quality.",
    category: "pdf",
    iconName: "FileArchive",
    popular: true,
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert JPG, PNG, WebP and other image formats into a beautifully formatted PDF document.",
    category: "converter",
    iconName: "Image",
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description: "Extract high-quality images from each page of your PDF document, or convert the entire PDF to images.",
    category: "image",
    iconName: "FileImage",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Microsoft Word .docx files to professional PDFs with original layouts preserved.",
    category: "converter",
    iconName: "FileDown",
    popular: true,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Extract text from your PDF and export it as an editable Microsoft Word .docx file.",
    category: "converter",
    iconName: "FileEdit",
  },
  {
    id: "image-convert",
    name: "Image Converter",
    description: "Convert images to JPG, PNG, or WebP format instantly with high-quality encoding.",
    category: "image",
    iconName: "RefreshCw",
  },
];
