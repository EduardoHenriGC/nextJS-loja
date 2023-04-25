import { useState } from 'react';

const InputTelefone = ({ value, onChange }) => {
  const [fone, setfone] = useState(value);

  const handleTelefoneChange = (event) => {
    const inputTelefone = event.target.value.replace(/\D/g, '');
    let maskedTelefone;
    if (inputTelefone.length === 11) {
      maskedTelefone = inputTelefone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
      maskedTelefone = inputTelefone.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    setfone(maskedTelefone);
    onChange(maskedTelefone);
  };

  return (
    <input type="text" placeholder='DIGITE O NUMERO DO TELEFONE'  name='telefone' value={fone} onChange={handleTelefoneChange} maxLength={15} />
  );
};

export default InputTelefone;