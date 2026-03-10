import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Signal } from 'lucide-react';
import type { VpnServer, VpnStatus } from '@/hooks/use-vpn-simulation';

interface ServerSelectorProps {
  servers: VpnServer[];
  activeServer: VpnServer;
  onSelect: (server: VpnServer) => void;
  status: VpnStatus;
}

export function ServerSelector({ servers, activeServer, onSelect, status }: ServerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';
  const isDisabled = isConnecting || isConnected;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto z-50" ref={dropdownRef}>
      <div className="text-center mb-2">
        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Current Location</span>
      </div>
      
      <button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`w-full flex items-center justify-between glass-panel px-6 py-4 rounded-2xl transition-all duration-300 ${
          isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white/[0.04] cursor-pointer'
        } ${isOpen ? 'ring-2 ring-primary/30 border-primary/50' : ''}`}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-xl">
            {activeServer.flag}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-display font-semibold text-foreground text-lg">{activeServer.name}</span>
            <div className="flex items-center space-x-2">
              <Signal className={`w-3 h-3 ${activeServer.ping < 50 ? 'text-green-500' : 'text-amber-500'}`} />
              <span className="text-xs text-muted-foreground">Ping: {activeServer.ping}ms</span>
            </div>
          </div>
        </div>
        
        {!isDisabled && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && !isDisabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 w-full glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl py-2"
          >
            <div className="max-h-64 overflow-y-auto hide-scrollbar px-2">
              {servers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => {
                    onSelect(server);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-colors ${
                    activeServer.id === server.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{server.flag}</span>
                    <span className={`font-medium ${activeServer.id === server.id ? 'text-primary' : 'text-foreground'}`}>
                      {server.name}
                    </span>
                  </div>
                  {activeServer.id === server.id && (
                    <MapPin className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
