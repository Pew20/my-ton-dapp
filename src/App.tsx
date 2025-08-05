import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
// import TonViewer from "./TonViewer";
import { TonPanel } from "./TonPanel";

function App() {
  return (
    <>
      <TonConnectButton className="tonconnect-button-fix" />
      {/* <TonViewer /> */}
      <TonPanel />
    </>
  );
}

export default App;
