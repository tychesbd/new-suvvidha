import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Grid, Paper, Button, Card, CardContent, CardMedia, CardActionArea, Divider, CircularProgress, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import { getContentByType } from '../../features/content/contentSlice';
import { getServices } from '../../features/services/serviceSlice';
import { getCategories } from '../../features/categories/categorySlice';
import BookingModal from '../../components/modals/BookingModal';

// Styled components
const HeroSection = styled(Box)(({ theme, backgroundImage }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(10, 0, 8),
  marginBottom: theme.spacing(6),
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  },
}));

const BookNowButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  '.MuiCardActionArea-root:hover &': {
    opacity: 1,
  },
}));

const WhyUsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const AdBanner = styled(Paper)(({ theme, backgroundImage }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(6),
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
  borderRadius: theme.spacing(1),
  textAlign: 'center',
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(6, 0),
  marginTop: theme.spacing(8),
}));

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Use content from API or fallback
  const hero = heroContent || fallbackHero;
  const whyUs = whyUsContent || fallbackWhyUs;
  const ads = adsContent || fallbackAds;

  return (
    <Box>
      {/* Hero Section - Admin Editable */}
      <HeroSection backgroundImage={hero.image}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            {hero.title}
          </Typography>
          <Typography variant="h5" paragraph>
            {hero.subtitle}
          </Typography>
          {hero.buttonText && (
            <Button variant="contained" color="secondary" size="large">
              {hero.buttonText}
            </Button>
          )}
        </Container>
      </HeroSection>

      {/* Services Section - Card View with Categories */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Our Services
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Discover the wide range of services we offer to make your life easier
        </Typography>
        
        {/* Search and Filter Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by service name or category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="home-category-filter-label">Filter by Category</InputLabel>
                <Select
                  labelId="home-category-filter-label"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Filter by Category"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories && categories.map((category) => (
                    <MenuItem key={category._id || category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {Object.keys(filteredServicesByCategory).length > 0 ? (
          Object.keys(filteredServicesByCategory).map((category, index) => (
            filteredServicesByCategory[category].length > 0 && (
              <Box key={index} sx={{ mb: 8 }}>
                <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 3 }}>
                  {category}
                </Typography>
                <Grid container spacing={4}>
                  {filteredServicesByCategory[category].map((service) => (
                  <Grid item key={service._id || service.id} xs={12} sm={6} md={4}>
                    <ServiceCard elevation={3}>
                      <CardActionArea sx={{ height: '100%', position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={service.image}
                          alt={service.name}
                        />
                        <CardContent sx={{ flexGrow: 1, pb: 6 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {service.description}
                          </Typography>
                          {service.minPrice && (
                            <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                              Starting from ₹{service.minPrice}
                            </Typography>
                          )}
                        </CardContent>
                        <BookNowButton 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Check if user is logged in
                            if (!userInfo) {
                              // Redirect to login page if not authenticated
                              navigate('/login');
                              return;
                            }
                            // Proceed with booking if authenticated
                            setSelectedService(service);
                            setOpenBookingModal(true);
                          }}
                        >
                          Book Now
                        </BookNowButton>
                      </CardActionArea>
                    </ServiceCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
            )
          ))
        ) : searchQuery ? (
          // No results found for search
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h5" color="text.secondary">
              No services found matching "{searchQuery}"
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Search
            </Button>
          </Box>
        ) : (
          // Display all services if no categories are available
          <Grid container spacing={4}>
            {allServices.map((service) => (
              <Grid item key={service.id || service._id} xs={12} sm={6} md={4}>
                <ServiceCard elevation={3}>
                  <CardActionArea sx={{ height: '100%', position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={service.image}
                      alt={service.name}
                    />
                    <CardContent sx={{ flexGrow: 1, pb: 6 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {service.description}
                      </Typography>
                      {service.minPrice && (
                        <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                          Starting from ₹{service.minPrice}
                        </Typography>
                      )}
                    </CardContent>
                    <BookNowButton 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Check if user is logged in
                        if (!userInfo) {
                          // Redirect to login page if not authenticated
                          navigate('/login');
                          return;
                        }
                        // Proceed with booking if authenticated
                        setSelectedService(service);
                        setOpenBookingModal(true);
                      }}
                    >
                      Book Now
                    </BookNowButton>
                  </CardActionArea>
                </ServiceCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Why Us Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom align="center">
          {whyUs.title}
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          {whyUs.subtitle}
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {whyUsFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <WhyUsCard elevation={2}>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </WhyUsCard>
            </Grid>
          ))}
        </Grid>

        {/* Ads Banner */}
        <AdBanner elevation={4} backgroundImage={ads.image}>
          <Typography variant="h4" gutterBottom>
            {ads.title}
          </Typography>
          <Typography variant="subtitle1" paragraph>
            {ads.subtitle}
          </Typography>
          {ads.buttonText && (
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={() => {
                // Check if user is logged in before booking
                if (!userInfo) {
                  navigate('/login');
                  return;
                }
                // Open booking modal if authenticated
                setOpenBookingModal(true);
              }}
            >
              {ads.buttonText}
            </Button>
          )}
        </AdBanner>
      </Container>

      {/* Footer */}
      <Footer sx={{ backgroundColor: '#ad6fa9', color: 'white', py: 4 }}>
  <Container maxWidth="lg">
    <Grid container spacing={4}>
      {/* About Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          About Suvvidha
        </Typography>
        <Typography variant="body2">
          Suvvidha is your one-stop solution for all your service needs. We provide high-quality services at affordable prices.
        </Typography>
      </Grid>

      {/* Quick Links Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Quick Links
        </Typography>
        <Typography variant="body2" paragraph>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        </Typography>
        <Typography variant="body2" paragraph>
          <Link to="/services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</Link>
        </Typography>
        <Typography variant="body2" paragraph>
          <Link to="/about us" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
        </Typography>
      </Grid>

      {/* Contact Us Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body2" paragraph>Email: info@suvvidha.com</Typography>
        <Typography variant="body2" paragraph>Phone: +91 xxxxxxxxxx</Typography>
        <Typography variant="body2" paragraph>Address: Patna, Bihar, India</Typography>
      </Grid>
    </Grid>

    {/* Divider */}
    <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />

    {/* Footer Bottom */}
    <Typography variant="body2" align="center" sx={{ pt: 2 }}>
      © {new Date().getFullYear()} Suvvidha & Shiv Bijay Deep. All rights reserved.
    </Typography>
  </Container>
</Footer>
      
      {/* Booking Modal */}
      <BookingModal 
        open={openBookingModal} 
        onClose={() => setOpenBookingModal(false)} 
        service={selectedService}
      />
    </Box>
  );
};

export default Home;