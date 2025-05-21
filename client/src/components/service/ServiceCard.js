import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import '../../components/neumorphic/ServiceCard.css';

const ServiceCard = ({ service, onBookNow }) => {
  return (
    <div className="service-card">
      <div className="service-image">
        <img 
          src={service.image} 
          alt={service.title || service.name}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
      </div>
      <div className="service-content">
        <Typography className="service-title" variant="h6">
          {service.title || service.name}
        </Typography>
        <Typography className="service-description">
          {service.description}
        </Typography>
        {service.minPrice && (
          <Typography className="service-price">
            Starting from ₹{service.minPrice}
          </Typography>
        )}
        <button 
          className="book-now-button"
          onClick={(e) => {
            e.stopPropagation();
            onBookNow(service);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
