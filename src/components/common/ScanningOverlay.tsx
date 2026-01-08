

export function ScanningOverlay({ isScanning }: { isScanning: boolean }) {
    if (!isScanning) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
            {/* Scanning Beam */}
            <div className="w-full h-64 bg-gradient-to-b from-transparent via-gold-500/20 to-transparent absolute -top-64 animate-scan-fast" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />

            {/* Corner Brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-500" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold-500" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold-500" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold-500" />

            {/* Status Text */}
            <div className="absolute bottom-12 left-0 right-0 text-center">
                <span className="bg-navy-900/80 text-gold-400 font-mono text-xs px-3 py-1 rounded border border-gold-500/30 animate-pulse">
                    EXTRACTING DATA...
                </span>
            </div>
        </div>
    );
}
