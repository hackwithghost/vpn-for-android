import { motion } from 'framer-motion';
import { Activity, Clock, Globe2, ShieldCheck, ArrowDown, ArrowUp } from 'lucide-react';
import type { VpnStatus } from '@/hooks/use-vpn-simulation';

interface StatsPanelProps {
  status: VpnStatus;
  ipAddress: string;
  connectionTime: number;
  speeds: { download: number; upload: number };
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export function StatsPanel({ status, ipAddress, connectionTime, speeds }: StatsPanelProps) {
  const isConnected = status === 'connected';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* IP Address Card */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Globe2 className="w-5 h-5 text-muted-foreground mb-2" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Virtual IP</span>
        <span className={`font-mono font-medium ${isConnected ? 'text-primary' : 'text-muted-foreground'} transition-colors duration-500`}>
          {ipAddress}
        </span>
      </motion.div>

      {/* Connection Time Card */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Clock className="w-5 h-5 text-muted-foreground mb-2" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Duration</span>
        <span className={`font-mono font-medium ${isConnected ? 'text-primary text-glow' : 'text-muted-foreground'} transition-colors duration-500`}>
          {formatTime(connectionTime)}
        </span>
      </motion.div>

      {/* Speeds Card (Spans full width) */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-4 col-span-2 relative overflow-hidden">
        {isConnected && (
          <motion.div 
            className="absolute inset-0 bg-green-500/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <Activity className={`w-5 h-5 ${isConnected ? 'text-green-400' : 'text-muted-foreground'}`} />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Network</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                <ArrowDown className="w-3 h-3 text-green-400" />
                <span>Download</span>
              </div>
              <span className={`font-mono text-lg ${isConnected ? 'text-foreground' : 'text-muted-foreground'}`}>
                {speeds.download.toFixed(1)} <span className="text-xs opacity-50">Mbps</span>
              </span>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                <ArrowUp className="w-3 h-3 text-blue-400" />
                <span>Upload</span>
              </div>
              <span className={`font-mono text-lg ${isConnected ? 'text-foreground' : 'text-muted-foreground'}`}>
                {speeds.upload.toFixed(1)} <span className="text-xs opacity-50">Mbps</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Status */}
      <motion.div variants={itemVariants} className="col-span-2 flex items-center justify-center space-x-2 mt-2">
        <ShieldCheck className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-muted-foreground'}`} />
        <span className="text-xs font-medium text-muted-foreground">
          {isConnected ? 'Connection is encrypted and secure' : 'Connection is not protected'}
        </span>
      </motion.div>
    </motion.div>
  );
}
