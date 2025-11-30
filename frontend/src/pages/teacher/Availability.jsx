import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Availability.css';

const Availability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
  ];

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/availability/${user.id}`);
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const handleSlotToggle = (slot) => {
    setSelectedSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: user.id,
          teacherName: user.name,
          date: selectedDate,
          timeSlots: selectedSlots
        })
      });
      loadAvailability();
      setSelectedDate('');
      setSelectedSlots([]);
    } catch (error) {
      console.error('Error setting availability:', error);
    }
  };

  const deleteAvailability = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/availability/${id}`, { method: 'DELETE' });
      loadAvailability();
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  return (
    <div className="availability-page">
      <div className="container">
        <h1><i className="fas fa-clock"></i> Set Your Availability</h1>

        <div className="availability-form-card">
          <h2>Add Available Time Slots</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Time Slots</label>
              <div className="time-slots-grid">
                {timeSlots.map(slot => (
                  <label key={slot} className="slot-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSlots.includes(slot)}
                      onChange={() => handleSlotToggle(slot)}
                    />
                    <span>{slot}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={selectedSlots.length === 0}>
              Save Availability
            </button>
          </form>
        </div>

        <div className="availability-list">
          <h2>Your Availability Schedule</h2>
          {availability.length === 0 ? (
            <p className="empty-state">No availability set yet</p>
          ) : (
            <div className="availability-grid">
              {availability.map(avail => (
                <div key={avail._id} className="availability-card">
                  <div className="availability-header">
                    <h3><i className="fas fa-calendar"></i> {new Date(avail.date).toLocaleDateString()}</h3>
                    <button className="btn-icon" onClick={() => deleteAvailability(avail._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="slots-list">
                    {avail.timeSlots.map(slot => (
                      <span key={slot} className="slot-badge">{slot}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Availability;
