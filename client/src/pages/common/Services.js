import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getServices } from '../../features/services/serviceSlice';
import { getCategories } from '../../features/categories/categorySlice';
import BookingModal from '../../components/modals/BookingModal';
import '../../components/neumorphic/ServiceCard.css';
import '../../components/neumorphic/HomeServices.css';

// Fallback services in case API fails
const fallbackServices = [
  {
    id: 1,
    name: 'Home Cleaning',
    description: 'Professional home cleaning services for a spotless living space.',
    category: 'Cleaning',
    image: 'https://source.unsplash.com/random/300x200/?cleaning',
    minPrice: 499
  },
  {
    id: 2,
    name: 'Plumbing',
    description: 'Expert plumbing services for all your repair and installation needs.',
    category: 'Plumbing',
    image: 'https://source.unsplash.com/random/300x200/?plumbing',
    minPrice: 299
  },
  {
    id: 3,
    name: 'Electrical Work',
    description: 'Reliable electrical services for your home and office.',
    category: 'Electrical',
    image: 'https://source.unsplash.com/random/300x200/?electrical',
    minPrice: 399
  }
];

const Services = () => {
  const dispatch = useDispatch();
  const { services: apiServices, isLoading: servicesLoading, isError } = useSelector((state) => state.services);
  const { categories } = useSelector((state) => state.categories);
  const [services, setServices] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [allServices, setAllServices] = useState([]); // Added missing state
  
  // State for booking modal
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState({});

  // Fetch services and categories
  useEffect(() => {
    dispatch(getServices());
    dispatch(getCategories());
  }, [dispatch]);

  // Set services from API or fallback
  useEffect(() => {
    if (apiServices && apiServices.length > 0) {
      setServices(apiServices);
    } else if (isError) {
      setServices(fallbackServices);
    }
  }, [apiServices, isError]);

  // Organize services by category
  useEffect(() => {
    if (services && services.length > 0 && categories && categories.length > 0) {
      const servicesByCat = {};
      let allServicesList = [];
      
      // Initialize categories
      categories.forEach(category => {
        servicesByCat[category.name] = [];
      });
      
      // Group services by category
      services.forEach(service => {
        allServicesList.push(service);
        if (servicesByCat[service.category]) {
          servicesByCat[service.category].push(service);
        } else {
          // If category doesn't exist yet
          servicesByCat[service.category] = [service];
        }
      });
      
      setServicesByCategory(servicesByCat);
      setFilteredServices(servicesByCat);
      setAllServices(allServicesList);
      setIsLoading(false);
    } else if (!servicesLoading && services.length > 0) {
      // If we have services but no categories, just show all services
      setAllServices(services);
      setIsLoading(false);
    }
  }, [services, categories, servicesLoading]);

  // Filter services based on search query and selected category
  useEffect(() => {
    if (services.length === 0) return;

    const filterServices = () => {
      const query = searchQuery.toLowerCase().trim();
      
      if (selectedCategory === 'all' && !query) {
        // If no filter is applied, show all services by category
        setFilteredServices(servicesByCategory);
        return;
      }
      
      if (selectedCategory !== 'all' && !query) {
        // If only category filter is applied
        const filtered = {};
        filtered[selectedCategory] = servicesByCategory[selectedCategory] || [];
        setFilteredServices(filtered);
        return;
      }
      
      // Filter by search query (and category if selected)
      const filtered = {};
      
      if (selectedCategory === 'all') {
        // Search across all categories
        Object.keys(servicesByCategory).forEach(category => {
          const matchingServices = servicesByCategory[category].filter(service => {
            const nameMatch = (service.title || service.name || '').toLowerCase().includes(query);
            const descMatch = (service.description || '').toLowerCase().includes(query);
            const categoryMatch = category.toLowerCase().includes(query);
            return nameMatch || descMatch || categoryMatch;
          });
          
          if (matchingServices.length > 0) {
            filtered[category] = matchingServices;
          }
        });
      } else {
        // Search within selected category
        const matchingServices = servicesByCategory[selectedCategory]?.filter(service => {
          const nameMatch = (service.title || service.name || '').toLowerCase().includes(query);
          const descMatch = (service.description || '').toLowerCase().includes(query);
          return nameMatch || descMatch;
        });
        
        if (matchingServices && matchingServices.length > 0) {
          filtered[selectedCategory] = matchingServices;
        }
      }
      
      setFilteredServices(filtered);
    };
    
    filterServices();
  }, [searchQuery, selectedCategory, servicesByCategory, services]);

  if (isLoading) {
    return (
      <div className="services-section loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="services-section">
      <h1 className="section-title">Our Services</h1>
      <p className="section-subtitle">
        Discover the wide range of services we offer to make your life easier
      </p>
      
      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <div className="search-row">
          <div className="search-group">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-group">
            <span className="search-icon">🏷️</span>
            <select
              className="search-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories && categories.map((category) => (
                <option key={category._id || category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Display services by category */}
      {Object.keys(filteredServices).length > 0 ? (
        Object.keys(filteredServices).map((category) => (
          filteredServices[category].length > 0 && (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="services-grid">
                {filteredServices[category].map((service) => (
                  <div key={service.id || service._id} className="service-card">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="service-image"
                    />
                    <div className="service-content">
                      <h3 className="service-title">{service.name}</h3>
                      <p className="service-description">{service.description}</p>
                      {service.minPrice && (
                        <p className="service-price">
                          Starting from ₹{service.minPrice}
                        </p>
                      )}
                      <button
                        className="book-now-button"
                        onClick={() => {
                          setSelectedService(service);
                          setOpenBookingModal(true);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))
      ) : searchQuery ? (
        <div className="no-results">
          <h2>No services found matching "{searchQuery}"</h2>
          <button 
            className="book-now-button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id || service._id} className="service-card">
              <img
                src={service.image}
                alt={service.name}
                className="service-image"
              />
              <div className="service-content">
                <h3 className="service-title">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                {service.minPrice && (
                  <p className="service-price">
                    Starting from ₹{service.minPrice}
                  </p>
                )}
                <button
                  className="book-now-button"
                  onClick={() => {
                    setSelectedService(service);
                    setOpenBookingModal(true);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Service CTA */}
      <div className="custom-service-cta">
        <h2>Need a Custom Service?</h2>
        <p>Contact us to discuss your specific requirements and get a personalized solution.</p>
        <button className="book-now-button">Contact Us</button>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        open={openBookingModal} 
        onClose={() => setOpenBookingModal(false)} 
        service={selectedService}
      />
    </div>
  );
};

export default Services;
