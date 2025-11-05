
import React from "react";
// import ReactDOM from "react-dom";
import QRCode from "react-qr-code";

const QR = ({value}) => {
    return (
        <div style={{ height: "auto", margin: "0 auto",  width: "100%" }}>
            <QRCode
                size={500}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={value}
                viewBox={`0 0 256 256`}
            />
        </div>
    );
};

export default QR;