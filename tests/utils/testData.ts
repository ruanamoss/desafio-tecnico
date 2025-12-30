export function randomUsername(prefix = 'user') {
  return `${prefix}_${Date.now().toString().slice(-6)}`;
}

export function sampleUser() {
  const username = randomUsername('parabank');
  return {
    firstName: 'Test',
    lastName: 'User',
    address: 'Rua Teste 123',
    city: 'Cidade',
    state: 'Estado',
    zipCode: '00000',
    phone: '11999999999',
    ssn: '123-45-6789',
    username,
    password: 'Password123!'
  };
}
