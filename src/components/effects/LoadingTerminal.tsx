import { motion } from 'framer-motion';

interface LoadingTerminalProps {
  message?: string;
}

export function LoadingTerminal({ message = 'LOADING...' }: LoadingTerminalProps) {
  return (
    <div className="text-cyber-green">
      <motion.div 
        className="font-terminal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        {message}
        <span className="animate-blink">_</span>
      </motion.div>
    </div>
  );
}