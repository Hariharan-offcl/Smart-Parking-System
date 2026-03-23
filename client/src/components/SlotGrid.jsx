
const SlotGrid = ({ slots, onSlotClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return '🅿️';
      case 'occupied': return '🚗';
      case 'reserved': return '📋';
      default: return '🅿️';
    }
  };

  return (
    <div className="slot-grid">
      {slots.map((slot) => (
        <div
          key={slot._id}
          className={`slot-tile ${slot.status}`}
          onClick={() => slot.status === 'available' && onSlotClick?.(slot)}
          title={`${slot.slotNumber} — ${slot.status}`}
        >
          <span className="slot-icon">{getStatusIcon(slot.status)}</span>
          <span>{slot.slotNumber}</span>
        </div>
      ))}
    </div>
  );
};

export default SlotGrid;
