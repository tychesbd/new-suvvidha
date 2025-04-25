import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Grid, Paper, Button, Card, CardContent, CardMedia, CardActionArea, Divider, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
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
  const dispatch = useDispatch();
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

  // Fetch hero content
  useEffect(() => {
    dispatch(getContentByType('hero'));
  }, [dispatch]);

  // Fetch services and categories
  useEffect(() => {
    dispatch(getServices());
    dispatch(getCategories());
    
    // Fetch why us and ads content
    const fetchWhyUsContent = async () => {
      try {
        const response = await fetch('/api/content/whyUs');
        const data = await response.json();
        setWhyUsContent(data);
      } catch (error) {
        console.error('Error fetching Why Us content:', error);
        setWhyUsContent(fallbackWhyUs);
      }
    };
    
    const fetchAdsContent = async () => {
      try {
        const response = await fetch('/api/content/ads');
        const data = await response.json();
        setAdsContent(data);
      } catch (error) {
        console.error('Error fetching Ads content:', error);
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
      
      // Initialize categories
      categories.forEach(category => {
        servicesByCat[category.name] = [];
      });
      
      // Group services by category
      services.forEach(service => {
        if (servicesByCat[service.category]) {
          servicesByCat[service.category].push(service);
        } else {
          // If category doesn't exist yet
          servicesByCat[service.category] = [service];
        }
      });
      
      setServicesByCategory(servicesByCat);
      setIsLoading(false);
    } else if (!servicesLoading && !heroLoading) {
      setIsLoading(false);
    }
  }, [services, categories, servicesLoading, heroLoading]);

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
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Discover the wide range of services we offer to make your life easier
        </Typography>

        {Object.keys(servicesByCategory).map((category, index) => (
          servicesByCategory[category].length > 0 && (
            <Box key={index} sx={{ mb: 8 }}>
              <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 3 }}>
                {category}
              </Typography>
              <Grid container spacing={4}>
                {servicesByCategory[category].map((service) => (
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
        ))}
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
            <Button variant="contained" color="secondary" size="large">
              {ads.buttonText}
            </Button>
          )}
        </AdBanner>
      </Container>

      {/* Footer */}
      <Footer>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About Suvvidha
              </Typography>
              <Typography variant="body2">
                Suvvidha is your one-stop solution for all your service needs. We provide high-quality services at affordable prices.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2" paragraph>Home</Typography>
              <Typography variant="body2" paragraph>Services</Typography>
              <Typography variant="body2" paragraph>About Us</Typography>
              <Typography variant="body2" paragraph>Contact</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" paragraph>Email: info@suvvidha.com</Typography>
              <Typography variant="body2" paragraph>Phone: +91 1234567890</Typography>
              <Typography variant="body2" paragraph>Address: 123, Main Street, City, Country</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" align="center" sx={{ pt: 2 }}>
            © {new Date().getFullYear()} Suvvidha. All rights reserved.
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