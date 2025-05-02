import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea, 
  Box, 
  CircularProgress, 
  Divider, 
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getServices } from '../../features/services/serviceSlice';
import { getCategories } from '../../features/categories/categorySlice';
import BookingModal from '../../components/modals/BookingModal';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

// Styled components for service cards with hover effect
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

// Fallback services in case API fails
const fallbackServices = [
  {
    id: 1,
    title: 'Home Cleaning',
    description: 'Professional home cleaning services for a spotless living space.',
    image: 'https://source.unsplash.com/random/300x200/?cleaning',
  },
  {
    id: 2,
    title: 'Plumbing',
    description: 'Expert plumbing services for all your repair and installation needs.',
    image: 'https://source.unsplash.com/random/300x200/?plumbing',
  },
  {
    id: 3,
    title: 'Electrical Work',
    description: 'Reliable electrical services for your home and office.',
    image: 'https://source.unsplash.com/random/300x200/?electrical',
  },
  {
    id: 4,
    title: 'Painting',
    description: 'Transform your space with our professional painting services.',
    image: 'https://source.unsplash.com/random/300x200/?painting',
  },
  {
    id: 5,
    title: 'Carpentry',
    description: 'Custom carpentry solutions for your furniture and woodwork needs.',
    image: 'https://source.unsplash.com/random/300x200/?carpentry',
  },
  {
    id: 6,
    title: 'Gardening',
    description: 'Professional gardening services to keep your outdoor space beautiful.',
    image: 'https://source.unsplash.com/random/300x200/?gardening',
  },
];

const Services = () => {
  const dispatch = useDispatch();
  const { services: apiServices, isLoading: servicesLoading, isError } = useSelector((state) => state.services);
  const { categories } = useSelector((state) => state.categories);
  const [services, setServices] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // State for booking modal
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState({});
  const [allServices, setAllServices] = useState([]);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
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
                <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                <Select
                  labelId="category-filter-label"
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
      </Box>

      {/* Display services by category */}
      {Object.keys(filteredServices).length > 0 ? (
        Object.keys(filteredServices).map((category, index) => (
          filteredServices[category].length > 0 && (
            <Box key={category} sx={{ mb: 6 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
                {category}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={4}>
                {filteredServices[category].map((service) => (
                  <Grid item key={service.id || service._id} xs={12} sm={6} md={4}>
                    <ServiceCard elevation={3}>
                      <CardActionArea sx={{ height: '100%', position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={service.image}
                          alt={service.title || service.name}
                        />
                        <CardContent sx={{ flexGrow: 1, pb: 6 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {service.title || service.name}
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
          {services.map((service) => (
            <Grid item key={service.id || service._id} xs={12} sm={6} md={4}>
              <ServiceCard elevation={3}>
                <CardActionArea sx={{ height: '100%', position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={service.image}
                    alt={service.title || service.name}
                  />
                  <CardContent sx={{ flexGrow: 1, pb: 6 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {service.title || service.name}
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

      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Need a Custom Service?
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Contact us to discuss your specific requirements and get a personalized solution.
        </Typography>
      </Box>
      
      {/* Booking Modal */}
      <BookingModal 
        open={openBookingModal} 
        onClose={() => setOpenBookingModal(false)} 
        service={selectedService}
      />
    </Container>
  );
};

export default Services;
