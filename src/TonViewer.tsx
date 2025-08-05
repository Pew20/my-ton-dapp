import { useTonClient } from "./hooks/useTonClient";
import { Address } from "@ton/ton";
import { useState, useCallback } from "react";

interface ContractState {
  balance: bigint;
  state: "active" | "uninitialized" | "frozen";
  code: any;
  data: any;
  lastTransaction: any;
  blockId: any;
  timestampt: number;
}

interface ViewerState {
  data: ContractState | null;
  loading: boolean;
  error: string | null;
}

export default function TonViewer() {
  const [address, setAddress] = useState("");
  const [viewerState, setViewerState] = useState<ViewerState>({
    data: null,
    loading: false,
    error: null,
  });
  const client = useTonClient();

  const getBalance = useCallback(async () => {
    if (!address.trim()) {
      setViewerState((prev) => ({ ...prev, error: "请输入有效的地址" }));
      return;
    }

    if (!client) {
      setViewerState((prev) => ({ ...prev, error: "TON客户端未初始化" }));
      return;
    }

    setViewerState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const parsedAddress = Address.parse(address);
      const contractState = await client.getContractState(parsedAddress);

      setViewerState({
        data: contractState,
        loading: false,
        error: null,
      });
    } catch (error) {
      setViewerState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "获取余额失败",
      });
    }
  }, [address, client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getBalance();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="输入TON地址"
          disabled={viewerState.loading}
        />
        <button type="submit" disabled={viewerState.loading || !client}>
          {viewerState.loading ? "搜索中..." : "搜索"}
        </button>
      </form>

      {viewerState.error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          错误: {viewerState.error}
        </div>
      )}

      {viewerState.data && (
        <div style={{ marginTop: "10px" }}>
          <strong>余额:</strong>{" "}
          {(Number(viewerState.data.balance) / 1e9).toFixed(4)} TON
          <br />
          <strong>状态:</strong> {viewerState.data.state}
        </div>
      )}
    </div>
  );
}
