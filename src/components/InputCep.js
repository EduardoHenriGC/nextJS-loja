import { useState } from 'react';

const InputCep = ({ value, onChange }) => {
  const [cep, setCep] = useState(value);

  const handleCepChange = (event) => {
    const inputCep = event.target.value.replace(/\D/g, '');
    const maskedCep = inputCep.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(maskedCep);
    onChange(maskedCep);
  };

  return (
    <input type="text" placeholder='DIGITE O NUMERO DO CEP' name="cep" value={cep} onChange={handleCepChange} maxLength={9} />
  );
};

export default InputCep;