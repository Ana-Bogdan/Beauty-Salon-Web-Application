import { useConnectionStatus } from "../hooks/useConnectionStatus";
import "./StatusBar.css";

export default function StatusBar() {
    const { online, serverUp } = useConnectionStatus();

    let message = "";
    let style = "status-bar connected";

    if (!online) {
        message = "You're offline ⛔";
        style = "status-bar offline";
    } else if (!serverUp) {
        message = "Server is unreachable 🔌";
        style = "status-bar server-down";
    } else {
        message = "Connected ✅";
    }

    return <div className={style}>{message}</div>;
}
