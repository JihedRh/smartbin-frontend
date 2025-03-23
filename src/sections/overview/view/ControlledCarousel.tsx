import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ExampleCarouselImageProps {
  imageSrc: string;
}

function ExampleCarouselImage({ imageSrc }: ExampleCarouselImageProps) {
  return (
    <img
      className="d-block w-100"
      src={imageSrc}  
      alt="carousel"
      style={{
        objectFit: 'cover', 
        width: '100%', 
        height: '100%', 
      }}
    />
  );
}

function ControlledCarousel() {
  const [index, setIndex] = useState<number>(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            height: '400px',
            width: '100%', 
          }}
        >
          {/* Background Image with Overlay */}
          <Box
            component="img"
            src="/assets/background/bin2.jpg"
            alt="Slide Background"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', 
              filter: 'brightness(0.6)',
            }}
          />

          {/* Caption Container */}
          <Carousel.Caption
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#fff',
              zIndex: 2,
            }}
          >
            <h3
              style={{
                fontSize: '3rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                animation: 'fadeIn 2s ease-in-out',
              }}
            >
              About Techolypse
            </h3>
            <p
              style={{
                fontSize: '1.2rem',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                animation: 'fadeIn 2.5s ease-in-out',
              }}
            >
          Techolypse is a leading tech company specializing in innovative solutions !   
          
              </p>

            {/* Call-to-Action Button */}
            <a href="/sttaic_web/index.html" target="_blank" rel="noopener noreferrer">
            <Box
              component="button"
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                backgroundColor: 'primary.main',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Learn More ?
            </Box>
            </a>
          </Carousel.Caption>
        </Box>
      </Carousel.Item>

      <Carousel.Item>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            height: '400px',
            width: '100%', 
          }}
        >
          {/* Background Image with Overlay */}
          <Box
            component="img"
            src="/assets/background/bin3.jpg"
            alt="Slide Background"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', 
              filter: 'brightness(0.6)',
            }}
          />

          {/* Caption Container */}
          <Carousel.Caption
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#fff',
              zIndex: 2,
            }}
          >
            <h3
              style={{
                fontSize: '3rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                animation: 'fadeIn 2s ease-in-out',
              }}
            >
              Our Services
            </h3>
            <p
              style={{
                fontSize: '1.2rem',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                animation: 'fadeIn 2.5s ease-in-out',
              }}
            >
       Our mission is to revolutionize the way businesses interact with technology.
                </p>

            {/* Call-to-Action Button */}
            <Box
              component="button"
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                backgroundColor: 'primary.main',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Learn More ?
            </Box>
          </Carousel.Caption>
        </Box>
      </Carousel.Item>
      
      <Carousel.Item>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            height: '400px',
            width: '100%', 
          }}
        >
          {/* Background Image with Overlay */}
          <Box
            component="img"
            src="/assets/background/bin1.jpg"
            alt="Slide Background"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', 
              filter: 'brightness(0.6)',
            }}
          />

          {/* Caption Container */}
          <Carousel.Caption
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#fff',
              zIndex: 2,
            }}
          >
            <h3
              style={{
                fontSize: '3rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                animation: 'fadeIn 2s ease-in-out',
              }}
            >
             Smart Trash Bin Monitoring !
            </h3>
            <p
              style={{
                fontSize: '1.2rem',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                animation: 'fadeIn 2.5s ease-in-out',
              }}
            >
            Our Smart Trash Bin Monitoring Dashboard provides real-time insights into the status
            </p>

            {/* Call-to-Action Button */}
            <Link to="/OR-bin"> 
            <Box
              component="button"
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                backgroundColor: 'primary.main',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              view ?
            </Box>
            </Link>
          </Carousel.Caption>
        </Box>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
