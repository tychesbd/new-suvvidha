import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getContentByType } from '../../features/content/contentSlice';
import { getServices } from '../../features/services/serviceSlice';
import { getCategories } from '../../features/categories/categorySlice';
import BookingModal from '../../components/modals/BookingModal';
import '../../components/neumorphic/HomePage.css';
import '../../components/neumorphic/ServiceCard.css';

// Fallback content in case API fails
const fallbackHero = {
  title: 'Welcome to Suvvidha',
  subtitle: 'Your one-stop solution for all your service needs',
  buttonText: 'Explore Services',
  image: 'https://source.unsplash.com/random/1200x600/?service',
};

const fallbackWhyUs = {
  title: 'Why Choose Us?',
  subtitle: 'We provide the best service experience',
  description: 'Our team of professionals is dedicated to providing you with the best service experience.',
  image: 'https://source.unsplash.com/random/1200x600/?team',
};

const fallbackAds = {
  title: 'Special Offer',
  subtitle: 'Get 20% off on your first booking',
  buttonText: 'Book Now',
  image: 'https://source.unsplash.com/random/1200x600/?offer',
};

const whyUsFeatures = [
  {
    title: 'Quality Service',
    description: 'We provide top-notch services with guaranteed customer satisfaction.',
  },
  {
    title: 'Expert Professionals',
    description: 'Our team consists of skilled and experienced professionals.',
  },
  {
    title: '24/7 Support',
    description: 'We offer round-the-clock customer support for all your queries.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { currentContent: heroContent, isLoading: heroLoading } = useSelector((state) => state.content);
  const { services, isLoading: servicesLoading } = useSelector((state) => state.services);
  const { categories } = useSelector((state) => state.categories);
  
  const [whyUsContent, setWhyUsContent] = useState(null);
  const [adsContent, setAdsContent] = useState(null);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // State for booking modal
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServicesByCategory, setFilteredServicesByCategory] = useState({});
  const [allServices, setAllServices] = useState([]);

  // Fetch hero content
  useEffect(() => {
    dispatch(getContentByType('hero'));
  }, [dispatch]);

  // Fetch services and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getServices()).unwrap();
      } catch (error) {
        console.error('Error fetching services:', error);
        // Continue with other requests even if this one fails
      }
      
      try {
        await dispatch(getCategories()).unwrap();
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Continue with other requests even if this one fails
      }
    };
    
    fetchData();
    
    // Fetch why us and ads content
    const fetchWhyUsContent = async () => {
      try {
        // Use axios instead of fetch for consistent handling
        const response = await axios.get('/api/content/whyUs', {
          headers: {
            'Accept': 'application/json'
          }
        });
        setWhyUsContent(response.data);
      } catch (error) {
        if (error.response && error.response.headers && 
            error.response.headers['content-type'] && 
            error.response.headers['content-type'].includes('text/html')) {
          console.error('Invalid content type received: text/html; charset=UTF-8');
        } else {
          console.error('Error fetching Why Us content:', error.message || error);
        }
        // Always use fallback content on error
        setWhyUsContent(fallbackWhyUs);
      }
    };
    
    const fetchAdsContent = async () => {
      try {
        // Use axios instead of fetch for consistent handling
        const response = await axios.get('/api/content/ads', {
          headers: {
            'Accept': 'application/json'
          }
        });
        setAdsContent(response.data);
      } catch (error) {
        if (error.response && error.response.headers && 
            error.response.headers['content-type'] && 
            error.response.headers['content-type'].includes('text/html')) {
          console.error('Invalid content type received: text/html; charset=UTF-8');
        } else {
          console.error('Error fetching Ads content:', error.message || error);
        }
        setAdsContent(fallbackAds);
      }
    };
    
    fetchWhyUsContent();
    fetchAdsContent();
  }, [dispatch]);

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
      setFilteredServicesByCategory(servicesByCat);
      setAllServices(allServicesList);
      setIsLoading(false);
    } else if (!servicesLoading && !heroLoading) {
      setIsLoading(false);
    }
  }, [services, categories, servicesLoading, heroLoading]);

  // Filter services based on search query and selected category
  useEffect(() => {
    if (services.length === 0) return;

    const filterServices = () => {
      const query = searchQuery.toLowerCase().trim();
      
      if (selectedCategory === 'all' && !query) {
        // If no filter is applied, show all services by category
        setFilteredServicesByCategory(servicesByCategory);
        return;
      }
      
      if (selectedCategory !== 'all' && !query) {
        // If only category filter is applied
        const filtered = {};
        filtered[selectedCategory] = servicesByCategory[selectedCategory] || [];
        setFilteredServicesByCategory(filtered);
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
      
      setFilteredServicesByCategory(filtered);
    };
    
    filterServices();
  }, [searchQuery, selectedCategory, servicesByCategory, services]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Use content from API or fallback
  const hero = heroContent || fallbackHero;
  const whyUs = whyUsContent || fallbackWhyUs;
  const ads = adsContent || fallbackAds;

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${hero.image})`
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          {hero.buttonText && (
            <button className="hero-button">{hero.buttonText}</button>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div className="featured-services">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Discover the wide range of services we offer to make your life easier
        </p>

        {/* Search and Filter */}
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
                className="filter-select"
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

        {/* Services Grid */}
        <div className="services-grid">
          {Object.keys(filteredServicesByCategory).map((category) => (
            filteredServicesByCategory[category].map((service) => (
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
                    <p className="service-price">Starting from ₹{service.minPrice}</p>
                  )}
                  <button
                    className="book-now-button"
                    onClick={() => {
                      if (!userInfo) {
                        navigate('/login');
                        return;
                      }
                      setSelectedService(service);
                      setOpenBookingModal(true);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ))}
        </div>

        {/* Why Us Section */}
        <div className="why-us-section">
          <h2 className="section-title">{whyUs.title}</h2>
          <p className="section-subtitle">{whyUs.subtitle}</p>
          <div className="services-grid">
            {whyUsFeatures.map((feature, index) => (
              <div key={index} className="why-us-card">
                <h3 className="why-us-title">{feature.title}</h3>
                <p className="why-us-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ad Banner */}
        <div className="ad-banner">
          <div className="ad-content">
            <h2 className="ad-title">{ads.title}</h2>
            <p className="ad-subtitle">{ads.subtitle}</p>
            {ads.buttonText && (
              <button 
                className="hero-button"
                onClick={() => {
                  if (!userInfo) {
                    navigate('/login');
                    return;
                  }
                  setOpenBookingModal(true);
                }}
              >
                {ads.buttonText}
              </button>
            )}
          </div>
        </div>
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

export default Home;