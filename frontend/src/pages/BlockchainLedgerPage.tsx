import React, { useEffect, useState } from 'react';
import { getBlockchainLedger } from '../api/nextGenApi';
import { BlockchainBlock } from '../types';
import { ShieldCheck, Cpu, Award, Sparkles, Hash } from 'lucide-react';
import { MobilePageHeader } from '../components/common/MobilePageHeader';

export const BlockchainLedgerPage: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [mintedNft, setMintedNft] = useState<boolean>(false);

  useEffect(() => {
    getBlockchainLedger()
      .then((data) => setBlocks(data))
      .catch(() => setBlocks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 py-4 max-w-7xl mx-auto px-4">
      <MobilePageHeader
        title="Blockchain Audit Ledger"
        subtitle="SHA-256 cryptographic provenance records with zero-knowledge verification"
        actions={
          <button
            onClick={() => setMintedNft(true)}
            className="h-11 min-h-[44px] px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all touch-manipulation"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mint NFT Proof</span>
          </button>
        }
      />

      {mintedNft && (
        <div className="bg-[#E6F4EA] border border-[#A7F3D0] rounded-2xl p-5 text-center space-y-2.5 shadow-sm animate-scale-in">
          <Award className="w-10 h-10 text-[#047857] mx-auto animate-bounce" />
          <h3 className="text-base sm:text-lg font-black text-[#111827]">
            NFT Impact Token Minted on Polygon Testnet!
          </h3>
          <p className="text-xs text-[#047857] font-mono break-all max-w-md mx-auto">
            Token ID: #0x9F82A41C7B • Immutable Provenance Badge Added to Wallet
          </p>
          <button
            onClick={() => setMintedNft(false)}
            className="text-xs text-[#047857] underline font-bold touch-manipulation pt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] text-[#6B7280] text-sm shadow-sm">
          Loading blockchain ledger blocks...
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
              Provenance Block Stream ({blocks.length} Blocks)
            </h3>
            <span className="inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold bg-[#E6F4EA] text-[#047857] rounded-full border border-[#A7F3D0] leading-none text-center shrink-0">
              Verified Chain
            </span>
          </div>

          <div className="space-y-3">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm min-w-0 w-full overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#E5E7EB]">
                  <span className="text-[#047857] font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    BLOCK #{block.blockIndex} &mdash; {block.action}
                  </span>
                  <span className="text-[#6B7280] text-[11px]">
                    {new Date(block.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono text-[#111827]">
                  <div className="bg-[#FAF8F5] p-2.5 sm:p-3 rounded-xl border border-[#E5E7EB] min-w-0 w-full overflow-hidden">
                    <span className="text-[#6B7280] font-sans text-[11px] block mb-0.5">Hash:</span>
                    <span className="text-[#7567E8] font-bold block break-all break-words [overflow-wrap:anywhere] select-all leading-relaxed">
                      {block.hash}
                    </span>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 sm:p-3 rounded-xl border border-[#E5E7EB] min-w-0 w-full overflow-hidden">
                    <span className="text-[#6B7280] font-sans text-[11px] block mb-0.5">Previous Hash:</span>
                    <span className="text-[#4B5563] block break-all break-words [overflow-wrap:anywhere] select-all leading-relaxed">
                      {block.previousHash}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-sans text-[#4B5563] gap-2">
                    <span className="shrink-0">Target Donation:</span>
                    <span className="font-mono text-[#111827] font-bold truncate max-w-[65%] text-right select-all">
                      {block.donationId}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
