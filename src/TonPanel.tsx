import { useContractinit } from "./hooks/useContractInit";
import { useTonConnect } from "./hooks/useTonConnect";
import { useEffect, useState } from "react";

export function TonPanel() {
  const { connected, sender } = useTonConnect();
  const counterContract = useContractinit();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counterContract) {
      counterContract
        .getCounter()
        .then((value) => {
          setCounter(value);
        })
        .catch((error) => {
          console.log(error, "error");
          setCounter(-1);
        });
    }
  }, [counterContract]);

  // const { connected } = useTonConnect();
  // console.log(counterContract, "counterContract");
  return (
    <div>
      <div>connected: {connected ? "true" : "false"}</div>
      <div>counter: {counter}</div>
      <button
        onClick={() => {
          counterContract?.sendOp1(sender);
        }}
        disabled={!counterContract}
      >
        {counterContract ? "发送op1" : "连接中"}
      </button>
    </div>
  );
}
