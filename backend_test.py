#!/usr/bin/env python3
"""
Backend Testing Suite for Mi Tienda Application
Tests the FastAPI backend infrastructure supporting the frontend application
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

class BackendTester:
    def __init__(self):
        self.backend_url = get_backend_url()
        if not self.backend_url:
            raise Exception("Could not get backend URL from frontend/.env")
        
        self.api_url = f"{self.backend_url}/api"
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
    
    def test_backend_connectivity(self):
        """Test if backend server is accessible"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.log_test("Backend Connectivity", True, "Backend server is accessible and responding correctly")
                    return True
                else:
                    self.log_test("Backend Connectivity", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Backend Connectivity", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Backend Connectivity", False, f"Connection failed: {str(e)}")
            return False
    
    def test_status_endpoint_get(self):
        """Test GET /api/status endpoint"""
        try:
            response = requests.get(f"{self.api_url}/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Status GET Endpoint", True, f"Status endpoint working, returned {len(data)} records")
                    return True
                else:
                    self.log_test("Status GET Endpoint", False, f"Expected list, got: {type(data)}")
                    return False
            else:
                self.log_test("Status GET Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Status GET Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_status_endpoint_post(self):
        """Test POST /api/status endpoint"""
        try:
            test_data = {
                "client_name": "backend_test_client"
            }
            response = requests.post(
                f"{self.api_url}/status", 
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if data.get('client_name') == test_data['client_name'] and 'id' in data and 'timestamp' in data:
                    self.log_test("Status POST Endpoint", True, "Status creation working correctly", f"Created record with ID: {data.get('id')}")
                    return True
                else:
                    self.log_test("Status POST Endpoint", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Status POST Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Status POST Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_cors_headers(self):
        """Test CORS configuration"""
        try:
            response = requests.options(f"{self.api_url}/", timeout=10)
            cors_headers = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                'access-control-allow-headers': response.headers.get('access-control-allow-headers')
            }
            
            if cors_headers['access-control-allow-origin'] == '*':
                self.log_test("CORS Configuration", True, "CORS properly configured for cross-origin requests", str(cors_headers))
                return True
            else:
                self.log_test("CORS Configuration", False, f"CORS may not be properly configured: {cors_headers}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"CORS test failed: {str(e)}")
            return False
    
    def test_data_persistence(self):
        """Test data persistence by creating and retrieving a record"""
        try:
            # Create a test record
            test_data = {
                "client_name": f"persistence_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            }
            
            # POST the record
            post_response = requests.post(
                f"{self.api_url}/status", 
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if post_response.status_code != 200:
                self.log_test("Data Persistence", False, f"Failed to create test record: {post_response.status_code}")
                return False
            
            created_record = post_response.json()
            created_id = created_record.get('id')
            
            # GET all records and verify our record exists
            get_response = requests.get(f"{self.api_url}/status", timeout=10)
            if get_response.status_code != 200:
                self.log_test("Data Persistence", False, f"Failed to retrieve records: {get_response.status_code}")
                return False
            
            all_records = get_response.json()
            found_record = None
            for record in all_records:
                if record.get('id') == created_id:
                    found_record = record
                    break
            
            if found_record and found_record.get('client_name') == test_data['client_name']:
                self.log_test("Data Persistence", True, "Data persistence working correctly", f"Record persisted with ID: {created_id}")
                return True
            else:
                self.log_test("Data Persistence", False, "Created record not found in database")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Data Persistence", False, f"Persistence test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend Infrastructure Tests for Mi Tienda")
        print(f"Backend URL: {self.backend_url}")
        print(f"API URL: {self.api_url}")
        print("=" * 60)
        
        tests = [
            self.test_backend_connectivity,
            self.test_status_endpoint_get,
            self.test_status_endpoint_post,
            self.test_cors_headers,
            self.test_data_persistence
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"📊 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All backend infrastructure tests PASSED!")
            return True
        else:
            print(f"⚠️  {total - passed} test(s) FAILED!")
            return False
    
    def get_summary(self):
        """Get test summary"""
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        return {
            'total_tests': total,
            'passed': passed,
            'failed': total - passed,
            'success_rate': (passed / total * 100) if total > 0 else 0,
            'results': self.test_results
        }

if __name__ == "__main__":
    try:
        tester = BackendTester()
        success = tester.run_all_tests()
        
        # Print detailed results
        summary = tester.get_summary()
        print(f"\n📈 Success Rate: {summary['success_rate']:.1f}%")
        
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"❌ Test setup failed: {str(e)}")
        sys.exit(1)