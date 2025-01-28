import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import CampaignForm from './components/CampaignForm';
import CampaignList from './components/CampaignList';

const App = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Fetch the campaigns from the backend when the component mounts
    axios.get('http://localhost:5000/api/campaigns')
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error('Error fetching campaigns:', error));
  }, []);

  const handleSave = (campaign) => {
    if (campaign?._id) {
      // If editing an existing campaign
      axios.put(`http://localhost:5000/api/campaigns/${campaign._id}`, campaign)
        .then(() => {
          setCampaigns(campaigns.map(c => (c._id === campaign._id ? campaign : c)));
          setShowModal(false); // Close the modal after saving
        });
    } else {
      // If creating a new campaign
      axios.post('http://localhost:5000/api/campaigns', campaign)
        .then((response) => 
        {
          setCampaigns([...campaigns, response.data])
          setShowModal(false)
        }
        );
    }
  };

  const handleEdit = (campaign) => {
    // Set the selected campaign for editing and open the modal
    setEditingCampaign(campaign);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    // Delete the campaign by ID
    axios.delete(`http://localhost:5000/api/campaigns/${id}`)
      .then(() => setCampaigns(campaigns.filter(campaign => campaign._id !== id)));
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal without saving
    setEditingCampaign(null); // Reset the editing campaign
  };

  return (
    <Container fluid>
      <Row>
        {/* Button and Campaign List inside the same container */}
        <Col md={12}>
          <Row>
            {/* Button to open the modal for adding a new campaign */}
            <Col md={12} className="d-flex justify-content-end p-0">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Add Campaign
              </Button>
            </Col>

            {/* Campaign List */}
            <Col md={12} className="p-0">
              <CampaignList 
                campaigns={campaigns} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Modal for Editing or Creating Campaign */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCampaign ? 'Edit Campaign' : 'Create Campaign'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CampaignForm 
            campaign={editingCampaign} 
            onSave={handleSave} 
          />
        </Modal.Body>
       
      </Modal>
    </Container>
  );
};

export default App;
