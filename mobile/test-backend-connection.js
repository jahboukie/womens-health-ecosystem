// Test script to verify mobile app can connect to backend
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testBackendConnection() {
  console.log('🧪 Testing SoberPal Mobile App Backend Connection...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${API_BASE_URL}/../health`,
      method: 'GET'
    },
    {
      name: 'Community Health',
      url: `${API_BASE_URL}/community/health`,
      method: 'GET'
    },
    {
      name: 'Get Sponsors',
      url: `${API_BASE_URL}/community/sponsors`,
      method: 'GET'
    },
    {
      name: 'Get Community Groups',
      url: `${API_BASE_URL}/community/groups`,
      method: 'GET'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000
      });
      
      if (response.status === 200) {
        console.log(`✅ ${test.name} - SUCCESS (${response.status})`);
        passed++;
      } else {
        console.log(`⚠️  ${test.name} - UNEXPECTED STATUS (${response.status})`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 BACKEND CONNECTION TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${passed}`);
  console.log(`❌ Tests Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Mobile app can connect to backend!');
    console.log('📱 Ready for device testing!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check backend server.');
  }
}

// Run the test
testBackendConnection().catch(console.error);
