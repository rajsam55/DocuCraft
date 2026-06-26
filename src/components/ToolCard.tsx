import { ToolInfo, ToolId } from "../types";
import { 
  FileStack, 
  Scissors, 
  FileArchive, 
  Image, 
  FileImage, 
  FileDown, 
  FileEdit, 
  RefreshCw, 
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface ToolCardProps {
  tool: ToolInfo;
  onSelect: (id: ToolId) => void;
  key?: any;
}

export default function ToolCard({ tool, onSelect }: ToolCardProps) {
  // Map icon strings to actual Lucide component instances safely
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileStack":
        return <FileStack className="h-6 w-6 text-indigo-600" />;
      case "Scissors":
        return <Scissors className="h-6 w-6 text-indigo-600" />;
      case "FileArchive":
        return <FileArchive className="h-6 w-6 text-indigo-600" />;
      case "Image":
        return <Image className="h-6 w-6 text-indigo-600" />;
      case "FileImage":
        return <FileImage className="h-6 w-6 text-indigo-600" />;
      case "FileDown":
        return <FileDown className="h-6 w-6 text-indigo-600" />;
      case "FileEdit":
        return <FileEdit className="h-6 w-6 text-indigo-600" />;
      case "RefreshCw":
        return <RefreshCw className="h-6 w-6 text-indigo-600" />;
      default:
        return <FileStack className="h-6 w-6 text-indigo-600" />;
    }
  };

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onSelect(tool.id)}
      className="relative flex flex-col items-start p-6 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/40 text-left transition duration-300 group cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {tool.popular && (
        <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
          Popular
        </span>
      )}

      {/* Icon frame */}
      <div className="h-12 w-12 rounded-xl bg-indigo-50/60 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
        <div className="group-hover:text-white transition-colors duration-300">
          {getIcon(tool.iconName)}
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-800 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors duration-200">
        {tool.name}
      </h3>
      
      <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-grow">
        {tool.description}
      </p>

      <div className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
        <span>Open Tool</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
}
