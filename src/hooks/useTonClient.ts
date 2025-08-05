import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";
import { useEffect, useState } from "react";

export function useTonClient() {
  const [client, setClient] = useState<TonClient | null>(null);

  useEffect(() => {
    async function init() {
      const endpoint = await getHttpEndpoint();
      const client = new TonClient({
        endpoint,
      });

      setClient(client);
    }
    console.log('client1')
    init();
  }, []);
  console.log('client2', client)
  return client;
}