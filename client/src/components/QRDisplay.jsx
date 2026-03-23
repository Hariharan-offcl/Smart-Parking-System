import { FiDownload, FiPrinter } from 'react-icons/fi';

const QRDisplay = ({ booking }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = booking.qrCode;
    link.download = `parking-qr-${booking._id}.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Parking Pass - ${booking.slot?.slotNumber}</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;">
          <h2>SmartPark - Parking Pass</h2>
          <img src="${booking.qrCode}" width="250" />
          <p><strong>Slot:</strong> ${booking.slot?.slotNumber}</p>
          <p><strong>Vehicle:</strong> ${booking.vehicleNumber}</p>
          <p><strong>Zone:</strong> ${booking.zone?.name}</p>
          <p><strong>Time:</strong> ${new Date(booking.startTime).toLocaleString()} — ${new Date(booking.endTime).toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!booking.qrCode) return null;

  return (
    <div className="qr-container">
      <img src={booking.qrCode} alt="QR Code" width="200" height="200" />
      <p className="booking-detail"><strong>Slot:</strong> {booking.slot?.slotNumber}</p>
      <p className="booking-detail"><strong>Vehicle:</strong> {booking.vehicleNumber}</p>
      <p className="booking-detail"><strong>Zone:</strong> {booking.zone?.name}</p>
      <p className="booking-detail">
        <strong>Time:</strong> {new Date(booking.startTime).toLocaleString()} — {new Date(booking.endTime).toLocaleString()}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
          <FiDownload size={14} /> Download
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
          <FiPrinter size={14} /> Print
        </button>
      </div>
    </div>
  );
};

export default QRDisplay;
