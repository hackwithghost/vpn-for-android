import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import type { VpnStatus } from '@/hooks/use-vpn-simulation';

interface ConnectButtonProps {
  status: VpnStatus;
  onClick: () => void;
}

export function ConnectButton({ status, onClick }: ConnectButtonProps) {
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';
  const isDisconnected = status === 'disconnected';

  // Determine colors based on state using HSL variables defined in CSS
  const getColors = () => {
    if (isConnected) return { main: 'hsl(var(--status-connected))', glow: 'hsla(142, 71%, 45%, 0.4)' };
    if (isConnecting) return { main: 'hsl(var(--status-connecting))', glow: 'hsla(38, 92%, 50%, 0.4)' };
    return { main: 'hsl(var(--status-disconnected))', glow: 'hsla(348, 83%, 47%, 0.2)' };
  };

  const colors = getColors();

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto my-12">
      {/* Background pulsing rings for 'connecting' and 'connected' states */}
      {(isConnecting || isConnected) && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full opacity-20"
            style={{ border: `2px solid ${colors.main}` }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: isConnecting ? 1.5 : 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full opacity-20"
            style={{ border: `2px solid ${colors.main}` }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: isConnecting ? 1.5 : 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: isConnecting ? 0.75 : 1.5,
            }}
          />
        </>
      )}

      {/* Main Button */}
      <motion.button
        onClick={onClick}
        className="relative z-10 flex flex-col items-center justify-center w-48 h-48 rounded-full focus:outline-none"
        style={{
          background: `radial-gradient(circle at center, ${colors.main} 0%, hsl(var(--card)) 100%)`,
          boxShadow: `0 0 40px ${colors.glow}, inset 0 0 20px rgba(0,0,0,0.5)`,
          border: `1px solid ${colors.main}`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isConnecting 
            ? [`0 0 20px ${colors.glow}`, `0 0 60px ${colors.glow}`, `0 0 20px ${colors.glow}`]
            : `0 0 40px ${colors.glow}`,
        }}
        transition={{
          boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Inner dark circle */}
        <div className="absolute inset-2 bg-background/90 rounded-full flex flex-col items-center justify-center backdrop-blur-sm shadow-inner">
          <motion.div
            animate={{ 
              rotate: isConnecting ? 360 : 0,
              color: colors.main
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              color: { duration: 0.3 }
            }}
          >
            <Power className="w-12 h-12 mb-2" strokeWidth={isConnecting ? 2.5 : 3} />
          </motion.div>
          
          <motion.span 
            className="font-display font-bold text-lg tracking-wider uppercase"
            style={{ color: colors.main }}
            animate={{ opacity: isConnecting ? [0.5, 1, 0.5] : 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {isDisconnected && "Connect"}
            {isConnecting && "Connecting"}
            {isConnected && "Connected"}
          </motion.span>
        </div>
      </motion.button>
    </div>
  );
}
