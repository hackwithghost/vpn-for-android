import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useVpnSimulation } from '@/hooks/use-vpn-simulation';
import { ConnectButton } from '@/components/ConnectButton';
import { ServerSelector } from '@/components/ServerSelector';
import { StatsPanel } from '@/components/StatsPanel';

export default function Dashboard() {
  const {
    status,
    activeServer,
    setActiveServer,
    ipAddress,
    connectionTime,
    speeds,
    toggleConnection,
    servers,
  } = useVpnSimulation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 flex items-center space-x-3 z-10"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-display font-bold text-xl tracking-tight">NexusVPN</h1>
      </motion.div>

      {/* Main Content Container */}
      <main className="w-full max-w-lg mx-auto flex flex-col items-center relative z-10 mt-12">
        
        {/* Connection Status Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-display font-bold mb-2">
            {status === 'disconnected' && <span className="text-foreground">Ready to Connect</span>}
            {status === 'connecting' && <span className="text-amber-500 animate-pulse">Establishing Tunnel...</span>}
            {status === 'connected' && <span className="text-green-500 text-glow">Protected</span>}
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {status === 'disconnected' ? 'Hide your IP and secure your network connection.' : `Routing traffic through ${activeServer.name}.`}
          </p>
        </motion.div>

        {/* Server Selection */}
        <div className="w-full mb-4">
          <ServerSelector 
            servers={servers}
            activeServer={activeServer}
            onSelect={setActiveServer}
            status={status}
          />
        </div>

        {/* The Big Button */}
        <ConnectButton status={status} onClick={toggleConnection} />

        {/* Statistics & Info */}
        <div className="w-full h-48"> {/* Fixed height to prevent layout shift */}
          <StatsPanel 
            status={status}
            ipAddress={ipAddress}
            connectionTime={connectionTime}
            speeds={speeds}
          />
        </div>
      </main>

      {/* Demo Disclaimer Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center z-10"
      >
        <div className="glass-panel px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5">
          <span className="text-xs font-medium text-amber-500/80 uppercase tracking-widest flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse" />
            Demo UI only – not a real VPN
          </span>
        </div>
      </motion.div>
    </div>
  );
}
