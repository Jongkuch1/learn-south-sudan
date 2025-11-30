import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './BookingCalendar.css';

const BookingCalendar = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    teacherId: '',
    teacherName: '',
    date: '',
    timeSlot: '',
    subject: '',
    notes: ''
  });

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
  ];

  useEffect(() => {
    loadBookings();
    loadTeachers();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${user.id}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.log('Backend not available, using localStorage');
      // Fallback to localStorage
      const allBookings = JSON.parse(localStorage.getItem('ssplp_bookings') || '[]');
      const userBookings = allBookings.filter(b => 
        b.studentId == user.id || b.teacherId == user.id
      );
      setBookings(userBookings);
    }
  };

  const loadTeachers = async () => {
    try {
      // Try backend first
      const response = await fetch('http://localhost:5000/api/availability');
      const availability = await response.json();
      const uniqueTeachers = [];
      const teacherIds = new Set();
      
      availability.forEach(avail => {
        if (!teacherIds.has(avail.teacherId)) {
          teacherIds.add(avail.teacherId);
          uniqueTeachers.push({
            id: avail.teacherId,
            name: avail.teacherName
          });
        }
      });
      
      if (uniqueTeachers.length > 0) {
        setTeachers(uniqueTeachers);
        return;
      }
    } catch (error) {
      console.log('Backend not available, using localStorage');
    }
    
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('ssplp_registered_users') || '[]');
    const teacherList = users.filter(u => u.role === 'teacher');
    setTeachers(teacherList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Form submitted!');
      console.log('Form data:', formData);
      console.log('User:', user);
      
      // Validate required fields
      if (!formData.teacherId || !formData.subject || !formData.date || !formData.timeSlot) {
        alert('Please fill in all required fields');
        return;
      }
      
      const booking = {
        _id: Date.now().toString(),
        ...formData,
        studentId: user.id,
        studentName: user.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      console.log('Booking to create:', booking);

      try {
        const response = await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking)
        });

        if (response.ok) {
          console.log('Booking saved to backend');
          await loadBookings();
          setShowForm(false);
          setFormData({ teacherId: '', teacherName: '', date: '', timeSlot: '', subject: '', notes: '' });
          alert('Meeting booked successfully!');
          return;
        }
      } catch (error) {
        console.log('Backend error:', error);
      }
      
      // Fallback to localStorage
      console.log('Saving to localStorage');
      try {
        let allBookings = JSON.parse(localStorage.getItem('ssplp_bookings') || '[]');
        
        // Keep only last 50 bookings to prevent quota issues
        allBookings = allBookings.slice(-49);
        allBookings.push(booking);
        
        localStorage.setItem('ssplp_bookings', JSON.stringify(allBookings));
        console.log('Saved bookings:', allBookings.length);
      } catch (quotaError) {
        // If still quota error, clear and save only new booking
        console.log('Quota exceeded, clearing old bookings');
        localStorage.setItem('ssplp_bookings', JSON.stringify([booking]));
      }
      
      await loadBookings();
      setShowForm(false);
      setFormData({ teacherId: '', teacherName: '', date: '', timeSlot: '', subject: '', notes: '' });
      alert('Meeting booked successfully!');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Error booking meeting: ' + error.message);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      loadBookings();
    } catch (error) {
      console.log('Backend not available, using localStorage');
      // Fallback to localStorage
      const allBookings = JSON.parse(localStorage.getItem('ssplp_bookings') || '[]');
      const updatedBookings = allBookings.map(b => 
        b._id === id ? { ...b, status: 'cancelled' } : b
      );
      localStorage.setItem('ssplp_bookings', JSON.stringify(updatedBookings));
      loadBookings();
    }
  };

  const confirmBooking = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' })
      });
      loadBookings();
    } catch (error) {
      console.log('Backend not available, using localStorage');
      // Fallback to localStorage
      const allBookings = JSON.parse(localStorage.getItem('ssplp_bookings') || '[]');
      const updatedBookings = allBookings.map(b => 
        b._id === id ? { ...b, status: 'confirmed' } : b
      );
      localStorage.setItem('ssplp_bookings', JSON.stringify(updatedBookings));
      loadBookings();
      alert('Meeting confirmed!');
    }
  };

  return (
    <div className="booking-calendar">
      <div className="container">
        <div className="page-header">
          <h1><i className="fas fa-calendar-alt"></i> Meeting Calendar</h1>
          {user.role === 'student' && (
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <i className="fas fa-plus"></i> Book Meeting
            </button>
          )}
        </div>

        {showForm && (
          <div className="booking-form-card">
            <h2>Book a Meeting</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Teacher</label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => {
                      const teacherId = e.target.value;
                      const teacher = teachers.find(t => String(t.id) === String(teacherId));
                      console.log('Selected teacher:', teacher);
                      setFormData({ 
                        ...formData, 
                        teacherId: teacherId, 
                        teacherName: teacher?.name || '' 
                      });
                    }}
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Book Meeting</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bookings-list">
          <h2>Your Meetings</h2>
          {bookings.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <i className="fas fa-calendar-times" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>No meetings scheduled</h3>
              <p style={{ color: '#999', marginBottom: '1.5rem' }}>Book your first meeting with a teacher</p>
              
              {user.role === 'student' && (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowForm(true)}
                    style={{ marginBottom: '1rem', padding: '1rem 2rem', fontSize: '1.1rem' }}
                  >
                    <i className="fas fa-plus-circle"></i> Book Your First Meeting
                  </button>
                  <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginTop: '1.5rem' }}>
                    <h4 style={{ color: '#87CEEB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-lightbulb"></i> Booking Steps
                    </h4>
                    <ol style={{ paddingLeft: '1.5rem', color: '#555', lineHeight: '1.8' }}>
                      <li>Click "Book Your First Meeting" button above</li>
                      <li>Select a teacher you want to meet with</li>
                      <li>Enter the subject you need help with</li>
                      <li>Pick a convenient date and time slot</li>
                      <li>Add notes explaining your questions (optional)</li>
                      <li>Submit and wait for teacher confirmation</li>
                    </ol>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196F3' }}>
                      <p style={{ margin: 0, color: '#1976d2', fontSize: '0.9rem' }}>
                        <i className="fas fa-info-circle"></i> <strong>Tip:</strong> Teachers typically respond within 24 hours. You'll receive a notification when your meeting is confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {user.role === 'teacher' && (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', textAlign: 'left' }}>
                    <h4 style={{ color: '#87CEEB', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-info-circle"></i> For Teachers
                    </h4>
                    <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '1rem' }}>
                      Students will book meetings with you through this calendar. When a student books a meeting:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', color: '#555', lineHeight: '1.8' }}>
                      <li>You'll see the booking request here</li>
                      <li>Review the details (subject, date, time)</li>
                      <li>Click "Confirm" to accept the meeting</li>
                      <li>Or "Cancel" if the time doesn't work</li>
                    </ul>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #FF9800' }}>
                      <p style={{ margin: 0, color: '#f57c00', fontSize: '0.9rem' }}>
                        <i className="fas fa-lightbulb"></i> <strong>Tip:</strong> Set your availability in the Availability page to let students know when you're free.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map(booking => (
                <div key={booking._id} className={`booking-card ${booking.status}`}>
                  <div className="booking-header">
                    <h3>{user.role === 'student' ? booking.teacherName : booking.studentName}</h3>
                    <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                  </div>
                  <div className="booking-details">
                    <p><i className="fas fa-book"></i> {booking.subject}</p>
                    <p><i className="fas fa-calendar"></i> {new Date(booking.date).toLocaleDateString()}</p>
                    <p><i className="fas fa-clock"></i> {booking.timeSlot}</p>
                    {booking.notes && <p><i className="fas fa-sticky-note"></i> {booking.notes}</p>}
                  </div>
                  <div className="booking-actions">
                    {user.role === 'teacher' && booking.status === 'pending' && (
                      <button className="btn btn-sm btn-primary" onClick={() => confirmBooking(booking._id)}>
                        Confirm
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button className="btn btn-sm btn-danger" onClick={() => cancelBooking(booking._id)}>
                        Cancel
                      </button>
                    )}
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

export default BookingCalendar;
