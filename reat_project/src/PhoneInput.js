
// PhoneInput.js
import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputComponent = ({ value, onChange }) => {
    return (
      <PhoneInput
        country={'ng'} // Default country (Nigeria)
        value={value}
        onChange={onChange}
        enableSearch={true}
        disableCountryCode={false}
        onlyCountries={[
          'ng', // Nigeria
          'za', // South Africa
          'ke', // Kenya
          'gh', // Ghana
          'eg', // Egypt
          'dz', // Algeria
          'tz', // Tanzania
          'ug', // Uganda
          'ma', // Morocco
          'et', // Ethiopia
          'ao', // Angola
          'cm', // Cameroon
          'ci', // Côte d'Ivoire
          'sn', // Senegal
          'zm', // Zambia
          'gb', // United Kingdom
          'fr', // France
          'de', // Germany
          'it', // Italy
          'es', // Spain
          'pt', // Portugal
          'nl', // Netherlands
          'be', // Belgium
          'ch', // Switzerland
          'at', // Austria
          'se', // Sweden
          'no', // Norway
          'dk', // Denmark
          'fi', // Finland
          'us', // United States
          'ca', // Canada
          'mx', // Mexico
          'br', // Brazil
          'ar', // Argentina
          'cl', // Chile
          'co', // Colombia
          'pe', // Peru
          'uy', // Uruguay
          'py', // Paraguay
          'bo', // Bolivia
          'do', // Dominican Republic
          'pr', // Puerto Rico
          'gt', // Guatemala
          'hn', // Honduras
          'ni', // Nicaragua
          'sv', // El Salvador
          'jp', // Japan
          'cn', // China
          'in', // India
          'kr', // South Korea
          'my', // Malaysia
          'sg', // Singapore
          'ph', // Philippines
          'id', // Indonesia
          'th', // Thailand
          'vn', // Vietnam
          'hk', // Hong Kong
          'tw', // Taiwan
          'ae', // United Arab Emirates
          'sa', // Saudi Arabia
          'ir', // Iran
          'kw', // Kuwait
          'qa', // Qatar
          'om', // Oman
          'bd', // Bangladesh
          'pk', // Pakistan
          'np', // Nepal
          'lk', // Sri Lanka
          'uz', // Uzbekistan
          'kz', // Kazakhstan
        ]}
        countryCodeEditable={false}
      />
    );
  };
  
  export default PhoneInputComponent;
