// CampaignList.js

import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CampaignList = ({ campaigns, onEdit, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const handleDelete = () => {
    onDelete(selectedCampaignId);
    setShowConfirmModal(false);
  };

  const handleOpenModal = (id) => {
    setSelectedCampaignId(id);
    setShowConfirmModal(true);
  };

  const getNextScheduledActivation = (schedule) => {
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Find the next valid scheduled activation
    for (let scheduleItem of schedule) {
      const targetDay = daysOfWeek.indexOf(scheduleItem.weekday);
      if (targetDay === -1) continue;
  
      // Calculate the next activation date based on the weekday and time
      const nextActivation = new Date(currentDate);
      nextActivation.setDate(currentDate.getDate() + ((targetDay - currentDate.getDay() + 7) % 7));
      nextActivation.setHours(scheduleItem.startTime.split(':')[0], scheduleItem.startTime.split(':')[1]);
  
      if (nextActivation > currentDate) {
        return nextActivation;
      }
    }
    return null;
  };
  
  return (
    <div className="my-4">
      <h2>Campaigns</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Campaign Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Next Scheduled Activation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.campaignType}</td>
              <td>{new Date(campaign.startDate).toLocaleDateString()}</td>
              <td>{new Date(campaign.endDate).toLocaleDateString()}</td>
              <td>
                {getNextScheduledActivation(campaign.schedule)
                  ? new Date(getNextScheduledActivation(campaign.schedule)).toLocaleString()
                  : 'No upcoming activation'}
              </td>
              <td>
                <Button variant="warning" onClick={() => onEdit(campaign)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleOpenModal(campaign._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this campaign? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm Deletion
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

CampaignList.propTypes = {
  campaigns: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CampaignList;
