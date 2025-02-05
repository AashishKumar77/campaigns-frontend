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

  const getNextScheduledActivation = (campaign) => {
    console.log(campaign, "== campaign");
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (new Date(campaign.endDate) > currentDate) {
        let closestDate = null;

        campaign.schedule.forEach((key) => {
            const targetDay = daysOfWeek.indexOf(key.weekday);
            const nextActivation = new Date(currentDate);

            let daysUntilNext = (targetDay - currentDate.getDay() + 7) % 7;
            if (daysUntilNext === 0) {
                // If it's the same day, check if the activation time has already passed
                const [startHour, startMinute] = key.startTime.split(':').map(Number);
                const currentHours = currentDate.getHours();
                const currentMinutes = currentDate.getMinutes();

                if (startHour < currentHours || (startHour === currentHours && startMinute <= currentMinutes)) {
                    daysUntilNext = 7; // Move to next week's same day
                }
            }

            nextActivation.setDate(currentDate.getDate() + daysUntilNext);
            nextActivation.setHours(...key.startTime.split(':').map(Number), 0, 0);

            if (!closestDate || nextActivation < closestDate) {
                closestDate = nextActivation;
            }
        });

        return closestDate ? closestDate.toLocaleString() : 'No upcoming activation';
    }

    return 'No upcoming activation';
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
                {getNextScheduledActivation(campaign) 
                  // ? new Date(getNextScheduledActivation(campaign)).toLocaleString()
                  // : 'No upcoming activation'
                  }
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
