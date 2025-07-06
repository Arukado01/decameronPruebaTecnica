import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      textAlign: 'center',
      padding: '1rem 0',
      background: '#f5f5f5',
      position: 'fixed',
      bottom: 0,
      width: '100%',
    }}>
      <p style={{ margin: 0 }}>
        Web App creada por{' '}
        <a
          href="mailto:carlosjcortinam@gmail.com"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          Carlos Cortina
        </a>
        , todos los derechos reservados ©{year}
      </p>
    </footer>
  );
};

export default Footer;
