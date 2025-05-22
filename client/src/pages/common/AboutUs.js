import React from 'react';
import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  Divider,
  theme,
  colors
} from '../../components/neumorphic';
import { LinkedIn, Twitter, Email } from '@mui/icons-material';

const leadership = [
  {
    name: 'Mohit Kumar Singh',
    position: 'CEO & Co-Founder',
    bio: 'With over 5 years of experience in the service industry, Mohit founded Suvvidha with a vision to transform how services are delivered.',
    avatar: '/images/team/mohit.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/mohit-kumar-singh',
      twitter: 'https://twitter.com/mohitksingh',
      email: 'mohit@suvvidha.com'
    }
  },
  {
    name: 'Shiv Bijay Deep',
    position: 'CTO & Co-Founder',
    bio: 'Leading the technological innovation at Suvvidha, Shiv brings extensive experience in building scalable platforms that transform user experiences.',
    avatar: '/images/team/shiv.jpg',
    socialLinks: {
      linkedin: 'www.linkedin.com/in/shivbijaydeep',
      twitter: 'https://twitter.com/shivbijaydeep2',
      email: 'shiv@suvvidha.com'
    }
  }
];

const AboutUs = () => {
  return (
    <Container>
      {/* Hero Section */}
      <Box style={{ padding: '2rem' }}>
        <Card
          variant="flat"
          style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: colors.background
          }}
        >
          <Typography 
            variant="h2" 
            style={{ 
              color: colors.text.primary,
              marginBottom: '1rem',
              fontWeight: 600
            }}
          >
            About Suvvidha
          </Typography>
          <Typography 
            variant="h5" 
            style={{ 
              color: colors.text.secondary,
              marginBottom: '2rem'
            }}
          >
            Your Trusted Partner for Quality Services
          </Typography>
        </Card>
      </Box>

      {/* Story Section */}
      <Box style={{ margin: '3rem 0' }}>
        <Card 
          variant="convex" 
          style={{ 
            padding: '2.5rem',
            backgroundColor: colors.background
          }}
        >
          <Typography 
            variant="h3" 
            style={{ 
              color: colors.text.primary,
              marginBottom: '1.5rem',
              fontWeight: 600
            }}
          >
            Our Story
          </Typography>
          <Typography 
            style={{ 
              color: colors.text.secondary,
              marginBottom: '1.5rem',
              fontSize: '1.1rem',
              lineHeight: '1.8'
            }}
          >
            Founded in 2024, Suvvidha was born out of a simple idea: to make quality services accessible to everyone. 
            We noticed a gap in the market where finding reliable service providers was a challenge for many households.
          </Typography>
          <Typography 
            style={{ 
              color: colors.text.secondary,
              marginBottom: '1.5rem',
              fontSize: '1.1rem',
              lineHeight: '1.8'
            }}
          >
            Starting with just a handful of services and providers, we've grown to become a comprehensive platform 
            connecting thousands of customers with skilled professionals across multiple service categories.
          </Typography>
          <Typography 
            style={{ 
              color: colors.text.secondary,
              fontSize: '1.1rem',
              lineHeight: '1.8'
            }}
          >
            Our journey has been driven by our commitment to excellence, reliability, and customer satisfaction. 
            Today, we're proud to be one of the leading service platforms in the region.
          </Typography>
        </Card>
      </Box>

      {/* Mission Section */}
      <Box style={{ margin: '3rem 0' }}>
        <Card 
          variant="pressed" 
          style={{ 
            padding: '2.5rem',
            backgroundColor: colors.background
          }}
        >
          <Typography 
            variant="h3" 
            style={{ 
              color: colors.text.primary,
              marginBottom: '1.5rem',
              fontWeight: 600
            }}
          >
            Our Mission
          </Typography>
          <Typography 
            style={{ 
              color: colors.text.secondary,
              marginBottom: '1.5rem',
              fontSize: '1.1rem',
              lineHeight: '1.8'
            }}
          >
            At Suvvidha, our mission is to revolutionize the service industry by creating a seamless connection between 
            customers and service providers. We aim to deliver convenience, quality, and reliability in every service interaction.
          </Typography>
          <Typography 
            style={{ 
              color: colors.text.secondary,
              fontSize: '1.1rem',
              lineHeight: '1.8'
            }}
          >
            We believe in empowering service professionals by providing them with a platform to showcase their skills and 
            grow their business, while simultaneously offering customers access to a wide range of verified and skilled professionals.
          </Typography>
        </Card>
      </Box>

      {/* Leadership Section */}
      <Box style={{ margin: '3rem 0' }}>
        <Card 
          variant="flat" 
          style={{ 
            padding: '2.5rem',
            backgroundColor: colors.background
          }}
        >
          <Typography 
            variant="h3" 
            style={{ 
              color: colors.text.primary,
              marginBottom: '0.5rem',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            Our Leadership
          </Typography>
          <Typography 
            style={{ 
              color: colors.text.secondary,
              marginBottom: '3rem',
              fontSize: '1.1rem',
              textAlign: 'center'
            }}
          >
            Meet the team driving innovation and excellence at Suvvidha
          </Typography>

          <Grid container spacing={4}>
            {leadership.map((leader, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  variant="convex" 
                  style={{ 
                    height: '100%',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                    backgroundColor: colors.background,
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <div 
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: '50%',
                      marginBottom: '1.5rem',
                      overflow: 'hidden',
                      backgroundColor: colors.background
                    }}
                  >
                    <Card
                      variant="pressed"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        overflow: 'hidden'
                      }}
                    >
                      <img 
                        src={leader.avatar} 
                        alt={leader.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Card>
                  </div>
                  <Typography 
                    style={{ 
                      color: colors.text.primary,
                      marginBottom: '0.5rem',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    {leader.name}
                  </Typography>
                  <Typography 
                    style={{ 
                      color: colors.primary.main,
                      marginBottom: '1rem',
                      fontSize: '1rem',
                      textAlign: 'center'
                    }}
                  >
                    {leader.position}
                  </Typography>
                  <Typography 
                    style={{ 
                      color: colors.text.secondary,
                      marginBottom: '1.5rem',
                      fontSize: '0.95rem',
                      textAlign: 'center',
                      lineHeight: '1.6'
                    }}
                  >
                    {leader.bio}
                  </Typography>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                    <Card
                      variant="pressed"
                      style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(leader.socialLinks.linkedin, '_blank')}
                    >
                      <LinkedIn style={{ color: colors.text.primary }} />
                    </Card>
                    <Card
                      variant="pressed"
                      style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(leader.socialLinks.twitter, '_blank')}
                    >
                      <Twitter style={{ color: colors.text.primary }} />
                    </Card>
                    <Card
                      variant="pressed"
                      style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.location.href = `mailto:${leader.socialLinks.email}`}
                    >
                      <Email style={{ color: colors.text.primary }} />
                    </Card>
                  </div>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>

      {/* Values Section */}
      <Box style={{ margin: '3rem 0' }}>
        <Card 
          variant="convex" 
          style={{ 
            padding: '2.5rem',
            backgroundColor: colors.background
          }}
        >
          <Typography 
            variant="h3" 
            style={{ 
              color: colors.text.primary,
              marginBottom: '2rem',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {[
              { 
                title: 'Quality',
                description: 'We are committed to delivering the highest quality services through rigorous verification and continuous monitoring of our service providers.'
              },
              { 
                title: 'Integrity',
                description: 'We operate with complete transparency and maintain the highest ethical standards in all our dealings with customers and service providers.'
              },
              { 
                title: 'Customer Focus',
                description: 'Our customers are at the heart of everything we do. We continuously strive to exceed their expectations and enhance their experience.'
              },
              { 
                title: 'Innovation',
                description: 'We embrace technology and innovative solutions to improve our service offerings and make the service booking experience more convenient.'
              }
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  variant="pressed" 
                  style={{ 
                    height: '100%',
                    padding: '2rem',
                    backgroundColor: colors.background
                  }}
                >
                  <Typography 
                    style={{ 
                      color: colors.text.primary,
                      marginBottom: '1rem',
                      fontSize: '1.25rem',
                      fontWeight: 600
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Typography 
                    style={{ 
                      color: colors.text.secondary,
                      fontSize: '1rem',
                      lineHeight: '1.6'
                    }}
                  >
                    {value.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default AboutUs;