export function randomUsername(prefix = 'user') {
  return `${prefix}_${Date.now().toString().slice(-6)}`;
}

export function randomEmail(prefix = 'test') {
  return `${prefix}_${Date.now().toString().slice(-6)}@test.com`;
}

export function sampleUser() {
  const username = randomUsername('parabank');
  const email = randomEmail('user');
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
    email,
    password: 'Password123!'
  };
}
