import BusLine from "./LineStorage.js";
import Station from "./StopStorage.js";
import Route from "./route.js";
import Stop from "./stop.js";

const QDB = {
    Bus: {
        Line: BusLine,
        Station,
        Route,
        Stop
    }
}

export default QDB;