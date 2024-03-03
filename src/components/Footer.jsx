import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './style.css';

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={6}>
            <h4>Contact Information</h4>
            <p>123 Main Street, Cityville, Country</p>
            <p>Email: info@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </Col>
          <Col md={6}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="footer-bottom">
        <Container>
          <p>&copy; 2024 EVL44. All Rights Reserved.</p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
