import React from 'react';
import { Typography, Container, Box, Grid, Avatar, Card, CardContent, Divider } from '@mui/material';

const team = [
  {
    name: 'John Doe',
    position: 'CEO & Founder',
    bio: 'With over 15 years of experience in the service industry, John founded Suvvidha with a vision to transform how services are delivered.',
    avatar: 'https://source.unsplash.com/random/300x300/?man,portrait,1',
  },
  {
    name: 'Jane Smith',
    position: 'Operations Director',
    bio: 'Jane oversees all service operations, ensuring that every customer receives the highest quality of service.',
    avatar: 'https://source.unsplash.com/random/300x300/?woman,portrait,1',
  },
  {
    name: 'David Wilson',
    position: 'Customer Relations Manager',
    bio: 'David is dedicated to maintaining excellent customer relationships and ensuring customer satisfaction.',
    avatar: 'https://source.unsplash.com/random/300x300/?man,portrait,2',
  },
  {
    name: 'Sarah Johnson',
    position: 'Technology Head',
    bio: 'Sarah leads our technology initiatives, constantly innovating to improve our service delivery platform.',
    avatar: 'https://source.unsplash.com/random/300x300/?woman,portrait,2',
  },
];

const AboutUs = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          About Suvvidha
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Your Trusted Partner for Quality Services
        </Typography>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Our Story
        </Typography>
        <Typography variant="body1" paragraph>
          Founded in 2020, Suvvidha was born out of a simple idea: to make quality services accessible to everyone. 
          We noticed a gap in the market where finding reliable service providers was a challenge for many households.
        </Typography>
        <Typography variant="body1" paragraph>
          Starting with just a handful of services and providers, we've grown to become a comprehensive platform 
          connecting thousands of customers with skilled professionals across multiple service categories.
        </Typography>
        <Typography variant="body1" paragraph>
          Our journey has been driven by our commitment to excellence, reliability, and customer satisfaction. 
          Today, we're proud to be one of the leading service platforms in the region.
        </Typography>
      </Box>

      <Divider sx={{ my: 6 }} />

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          At Suvvidha, our mission is to revolutionize the service industry by creating a seamless connection between 
          customers and service providers. We aim to deliver convenience, quality, and reliability in every service interaction.
        </Typography>
        <Typography variant="body1" paragraph>
          We believe in empowering service professionals by providing them with a platform to showcase their skills and 
          grow their business, while simultaneously offering customers access to a wide range of verified and skilled professionals.
        </Typography>
      </Box>

      <Divider sx={{ my: 6 }} />

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Meet Our Team
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
          The dedicated professionals behind Suvvidha
        </Typography>

        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                }}
                elevation={2}
              >
                <Avatar 
                  src={member.avatar} 
                  alt={member.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {member.position}
                  </Typography>
                  <Typography variant="body2">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Our Values
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            { title: 'Quality', description: 'We are committed to delivering the highest quality services.' },
            { title: 'Integrity', description: 'We operate with honesty, transparency, and ethical standards.' },
            { title: 'Customer Focus', description: 'Our customers are at the heart of everything we do.' },
            { title: 'Innovation', description: 'We continuously evolve to improve our service offerings.' },
          ].map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {value.title}
                </Typography>
                <Typography variant="body2">
                  {value.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutUs;