// PhoneInput.js
import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputComponent = ({ value, onChange }) => {
  return (
    <PhoneInput
      country={'ng'}  // Default country Nigeria
      value={value}
      onChange={onChange}
      enableSearch={true}
      disableCountryCode={false}
      onlyCountries={[
        'ng', 'za', 'ke', 'gh', 'eg', 'dz', 'tz', 'ug', 'ma', 'et',
        'ao', 'cm', 'ci', 'sn', 'zm', 'gb', 'fr', 'de', 'it', 'es',
        'pt', 'nl', 'be', 'ch', 'at', 'se', 'no', 'dk', 'fi', 'us',
        'ca', 'mx', 'br', 'ar', 'cl', 'co', 'pe', 'uy', 'py', 'bo',
        'do', 'pr', 'gt', 'hn'
      ]}
      inputProps={{
        prefix: '+234'  // Prefix the input with +234
      }}
      placeholder="Enter phone number" // Custom placeholder
    />
  );
};

export default PhoneInputComponent;
