const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    const response = await axios.post('http://localhost:4451/auth/login', {
      email: 'admin@hospital.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', {
      status: response.data.status,
      role: response.data.role,
      user: {
        userName: response.data.user.userName,
        email: response.data.user.email,
        role: response.data.user.role
      },
      token: response.data.token ? 'Present' : 'Missing'
    });
    
    // Test admin endpoint
    console.log('\nTesting admin endpoint...');
    const adminResponse = await axios.get('http://localhost:4451/admin/get-count', {
      headers: {
        'Authorization': `Bearer ${response.data.token}`,
        'x-access-token': response.data.token
      }
    });
    
    console.log('✅ Admin endpoint accessible!');
    console.log('Counts:', adminResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAdminLogin();
