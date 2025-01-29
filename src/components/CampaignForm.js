import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';
import { X } from 'react-bootstrap-icons';  // Importing X icon

const CampaignForm = ({ campaign, onSave }) => {
  const [formData, setFormData] = useState({
    campaignType: '',
    startDate: new Date(),
    endDate: '',
    schedule: [{ weekday: '', startTime: '', endTime: '' }],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (campaign) setFormData({ ...campaign });
  }, [campaign]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStartDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      startDate: date,
    }));
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [name]: value };
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleAddSchedule = () => {
    setFormData((prevData) => ({
      ...prevData,
      schedule: [...prevData.schedule, { weekday: '', startTime: '', endTime: '' }]
    }));
  };

  const handleRemoveSchedule = (index) => {
    const updatedSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.campaignType) formErrors.campaignType = "Campaign type is required";
    if (!formData.startDate || !formData.endDate) formErrors.dates = "Start and End dates are required";
    formData.schedule.forEach((schedule, index) => {
      if (!schedule.weekday) formErrors[`schedule[${index}].weekday`] = "Weekday is required";
      if (!schedule.startTime || !schedule.endTime) formErrors[`schedule[${index}].time`] = "Start and End times are required";
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group controlId="campaignType">
            <Form.Label>Campaign Type</Form.Label>
            <Form.Control
              as="select"
              name="campaignType"
              value={formData.campaignType}
              onChange={handleInputChange}
              isInvalid={!!errors.campaignType}
            >
              <option value="">Select Campaign Type</option>
              <option value="Cost per Order">Cost per Order</option>
              <option value="Cost per Click">Cost per Click</option>
              <option value="Buy One Get One">Buy One Get One</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">{errors.campaignType}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <DatePicker
              selected={formData.startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy/MM/dd"
              className="form-control"
              minDate={new Date()} // Cannot select a date before today
              isInvalid={!!errors.dates}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              dateFormat="yyyy/MM/dd"
              className="form-control"
              minDate={formData.startDate} // Ensures it cannot be earlier than start date
              isInvalid={!!errors.dates}
            />
          </Form.Group>
        </Col>
      </Row>

      {formData.schedule.map((schedule, index) => (
        <Row key={index}>
          <Col md={4}>
            <Form.Group controlId={`schedule[${index}].weekday`}>
              <Form.Label>{`Weekday ${formData.schedule.length > 1 ? index + 1 : ''}`}</Form.Label>
              <Form.Control
                as="select"
                name="weekday"
                value={schedule.weekday}
                onChange={(e) => handleScheduleChange(index, e)}
                isInvalid={!!errors[`schedule[${index}].weekday`]}
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors[`schedule[${index}].weekday`]}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId={`schedule[${index}].startTime`}>
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={schedule.startTime}
                onChange={(e) => handleScheduleChange(index, e)}
                isInvalid={!!errors[`schedule[${index}].time`]}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId={`schedule[${index}].endTime`}>
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={schedule.endTime}
                onChange={(e) => handleScheduleChange(index, e)}
                isInvalid={!!errors[`schedule[${index}].time`]}
              />
            </Form.Group>
          </Col>

          {formData.schedule.length > 1 && (
            <Col md={2} className="d-flex justify-content-center align-items-center">
              <X
                onClick={() => handleRemoveSchedule(index)}
                style={{ cursor: 'pointer', color: 'red' }}
                size={40} // Set the size of the icon
              />
            </Col>
          )}
        </Row>
      ))}

      <Button variant="secondary" className="mt-2" onClick={handleAddSchedule}>Add Schedule</Button>

      <div className="mt-3">
        <Button variant="primary" type="submit">Save Campaign</Button>
      </div>
    </Form>
  );
};

CampaignForm.propTypes = {
  campaign: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default CampaignForm;
