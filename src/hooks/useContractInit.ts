import { Counter } from '../wrapper/counter'
import { Address } from '@ton/core'
import type { OpenedContract } from '@ton/core'
import { useTonClient } from './useTonClient'
import { useEffect, useState } from 'react'


export function useContractinit() {
  const [counterContract, setCounterContract] = useState<OpenedContract<Counter> | null>(null)
  const client = useTonClient()
  useEffect(() => {
    const contract = new Counter(Address.parse('EQAg3pn6KPnCIHjiGuGLUPtTbP6Izt-fPO70rkQoLCbeXqny'))
    if (!client) return
    const counterContract = client.open(contract)
    setCounterContract(counterContract)
  }, [client])
  return counterContract
}