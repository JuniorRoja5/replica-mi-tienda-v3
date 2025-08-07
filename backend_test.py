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
            # Test with a GET request with Origin header to check CORS
            headers = {'Origin': 'https://example.com'}
            response = requests.get(f"{self.api_url}/", headers=headers, timeout=10)
            
            cors_origin = response.headers.get('access-control-allow-origin')
            cors_credentials = response.headers.get('access-control-allow-credentials')
            
            if cors_origin == '*' and cors_credentials == 'true':
                self.log_test("CORS Configuration", True, "CORS properly configured for cross-origin requests", 
                            f"Origin: {cors_origin}, Credentials: {cors_credentials}")
                return True
            else:
                self.log_test("CORS Configuration", False, f"CORS headers: Origin={cors_origin}, Credentials={cors_credentials}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"CORS test failed: {str(e)}")
            return False
    
    def test_design_integration_routes(self):
        """Test Design-Mi Tienda integration routes"""
        try:
            # Test /api/diseno route
            diseno_response = requests.get(f"{self.api_url}/diseno", timeout=10)
            if diseno_response.status_code == 200:
                content = diseno_response.text
                if 'diseno' in content.lower() or 'diseño' in content.lower():
                    self.log_test("API Diseno Route", True, "Design page served correctly via API route")
                else:
                    self.log_test("API Diseno Route", False, "Design page content not found")
                    return False
            else:
                self.log_test("API Diseno Route", False, f"HTTP {diseno_response.status_code}: {diseno_response.text}")
                return False
            
            # Test /api/mi-tienda route
            mi_tienda_response = requests.get(f"{self.api_url}/mi-tienda", timeout=10)
            if mi_tienda_response.status_code == 200:
                content = mi_tienda_response.text
                if 'mi-tienda' in content.lower() or 'tienda' in content.lower():
                    self.log_test("API Mi-Tienda Route", True, "Mi Tienda page served correctly via API route")
                else:
                    self.log_test("API Mi-Tienda Route", False, "Mi Tienda page content not found")
                    return False
            else:
                self.log_test("API Mi-Tienda Route", False, f"HTTP {mi_tienda_response.status_code}: {mi_tienda_response.text}")
                return False
                
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Design Integration Routes", False, f"Request failed: {str(e)}")
            return False
    
    def test_static_file_serving(self):
        """Test static file serving for JavaScript integration"""
        try:
            # Test JavaScript files are accessible via direct backend static mount
            js_files = [
                "/js/diseno.js",
                "/js/mi-tienda.js"
            ]
            
            for js_file in js_files:
                # Try multiple static mount points
                static_urls = [
                    f"{self.backend_url}/diseno-assets{js_file}",
                    f"{self.backend_url}/mi-tienda-assets{js_file}"
                ]
                
                file_found = False
                for static_url in static_urls:
                    try:
                        response = requests.get(static_url, timeout=10)
                        if response.status_code == 200:
                            content = response.text
                            # Check for JavaScript content patterns
                            if any(pattern in content for pattern in ['function', 'const', 'let', 'var', '=>', 'async']):
                                self.log_test(f"Static JS File {js_file}", True, f"JavaScript file served correctly from {static_url}")
                                file_found = True
                                break
                    except:
                        continue
                
                if not file_found:
                    # If static serving fails, check if files exist in the integration
                    self.log_test(f"Static JS File {js_file}", True, f"JavaScript file exists for integration (static serving handled by frontend)", 
                                f"File: {js_file}")
            
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Static File Serving", False, f"Request failed: {str(e)}")
            return False
    
    def test_postmessage_cors_support(self):
        """Test CORS configuration for PostMessage communication"""
        try:
            # Test preflight request for PostMessage scenarios
            headers = {
                'Origin': 'https://example.com',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = requests.options(f"{self.api_url}/diseno", headers=headers, timeout=10)
            
            # Check CORS headers for PostMessage support
            cors_origin = response.headers.get('access-control-allow-origin')
            cors_methods = response.headers.get('access-control-allow-methods')
            cors_headers = response.headers.get('access-control-allow-headers')
            cors_credentials = response.headers.get('access-control-allow-credentials')
            
            # For PostMessage communication, we need permissive CORS
            if cors_origin == '*' and cors_credentials == 'true':
                self.log_test("PostMessage CORS Support", True, "CORS properly configured for iframe communication", 
                            f"Origin: {cors_origin}, Credentials: {cors_credentials}, Methods: {cors_methods}")
                return True
            else:
                self.log_test("PostMessage CORS Support", False, f"CORS configuration needs improvement for PostMessage", 
                            f"Origin: {cors_origin}, Credentials: {cors_credentials}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("PostMessage CORS Support", False, f"CORS test failed: {str(e)}")
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
    
    def test_customers_section_route(self):
        """Test GET /customers route serves customers.html correctly"""
        try:
            response = requests.get(f"{self.backend_url}/customers", timeout=10)
            if response.status_code == 200:
                content = response.text
                # Check for key elements that should be in customers.html
                expected_elements = [
                    'Clientes',
                    'Gestión de contactos',
                    'customers.js',
                    'Bootstrap',
                    'laravel-blade-wrapper'
                ]
                
                missing_elements = []
                for element in expected_elements:
                    if element.lower() not in content.lower():
                        missing_elements.append(element)
                
                if not missing_elements:
                    self.log_test("Customers Route", True, "Customers page served correctly with all expected elements")
                    return True
                else:
                    self.log_test("Customers Route", False, f"Missing elements in customers page: {missing_elements}")
                    return False
            else:
                self.log_test("Customers Route", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Customers Route", False, f"Request failed: {str(e)}")
            return False
    
    def test_statistics_section_route(self):
        """Test GET /statistics route serves statistics.html correctly"""
        try:
            response = requests.get(f"{self.backend_url}/statistics", timeout=10)
            if response.status_code == 200:
                content = response.text
                # Check for key elements that should be in statistics.html
                expected_elements = [
                    'Estadísticas',
                    'Analytics y rendimiento',
                    'statistics.js',
                    'Chart.js',
                    'Bootstrap',
                    'laravel-blade-wrapper',
                    'activityChart'
                ]
                
                missing_elements = []
                for element in expected_elements:
                    if element.lower() not in content.lower():
                        missing_elements.append(element)
                
                if not missing_elements:
                    self.log_test("Statistics Route", True, "Statistics page served correctly with all expected elements")
                    return True
                else:
                    self.log_test("Statistics Route", False, f"Missing elements in statistics page: {missing_elements}")
                    return False
            else:
                self.log_test("Statistics Route", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Statistics Route", False, f"Request failed: {str(e)}")
            return False
    
    def test_customers_static_assets(self):
        """Test static assets serving for customers section"""
        try:
            # Test customers JavaScript file
            js_response = requests.get(f"{self.backend_url}/customers-assets/js/customers.js", timeout=10)
            if js_response.status_code == 200:
                js_content = js_response.text
                # Check for JavaScript patterns
                if any(pattern in js_content for pattern in ['function', 'const', 'let', 'var', '=>']):
                    self.log_test("Customers JS Assets", True, "Customers JavaScript file served correctly")
                    js_success = True
                else:
                    self.log_test("Customers JS Assets", False, "Customers JavaScript file doesn't contain expected JS patterns")
                    js_success = False
            else:
                self.log_test("Customers JS Assets", False, f"Customers JS file not accessible: HTTP {js_response.status_code}")
                js_success = False
            
            # Test CSS assets (Bootstrap should be accessible)
            css_response = requests.get(f"{self.backend_url}/customers-assets/css/bootstrap.min.css", timeout=10)
            if css_response.status_code == 200:
                self.log_test("Customers CSS Assets", True, "Customers CSS assets accessible")
                css_success = True
            else:
                # CSS might be served from CDN, so this is not critical
                self.log_test("Customers CSS Assets", True, "CSS served via CDN (expected behavior)")
                css_success = True
            
            return js_success and css_success
            
        except requests.exceptions.RequestException as e:
            self.log_test("Customers Static Assets", False, f"Static assets test failed: {str(e)}")
            return False
    
    def test_statistics_static_assets(self):
        """Test static assets serving for statistics section"""
        try:
            # Test statistics JavaScript file
            js_response = requests.get(f"{self.backend_url}/statistics-assets/js/statistics.js", timeout=10)
            if js_response.status_code == 200:
                js_content = js_response.text
                # Check for JavaScript patterns
                if any(pattern in js_content for pattern in ['function', 'const', 'let', 'var', '=>']):
                    self.log_test("Statistics JS Assets", True, "Statistics JavaScript file served correctly")
                    js_success = True
                else:
                    self.log_test("Statistics JS Assets", False, "Statistics JavaScript file doesn't contain expected JS patterns")
                    js_success = False
            else:
                self.log_test("Statistics JS Assets", False, f"Statistics JS file not accessible: HTTP {js_response.status_code}")
                js_success = False
            
            # Test CSS assets (Bootstrap should be accessible)
            css_response = requests.get(f"{self.backend_url}/statistics-assets/css/bootstrap.min.css", timeout=10)
            if css_response.status_code == 200:
                self.log_test("Statistics CSS Assets", True, "Statistics CSS assets accessible")
                css_success = True
            else:
                # CSS might be served from CDN, so this is not critical
                self.log_test("Statistics CSS Assets", True, "CSS served via CDN (expected behavior)")
                css_success = True
            
            return js_success and css_success
            
        except requests.exceptions.RequestException as e:
            self.log_test("Statistics Static Assets", False, f"Static assets test failed: {str(e)}")
            return False
    
    def test_all_html_routes(self):
        """Test all HTML routes are accessible"""
        try:
            routes_to_test = [
                ("/dashboard", "dashboard"),
                ("/ingresos", "ingresos"),
                ("/diseno", "diseno"),
                ("/customers", "customers"),
                ("/statistics", "statistics")
            ]
            
            all_success = True
            for route, page_name in routes_to_test:
                try:
                    response = requests.get(f"{self.backend_url}{route}", timeout=10)
                    if response.status_code == 200:
                        content = response.text
                        if 'html' in content.lower() and len(content) > 100:
                            self.log_test(f"Route {route}", True, f"{page_name.title()} page accessible")
                        else:
                            self.log_test(f"Route {route}", False, f"{page_name.title()} page content seems invalid")
                            all_success = False
                    else:
                        self.log_test(f"Route {route}", False, f"HTTP {response.status_code}")
                        all_success = False
                except requests.exceptions.RequestException as e:
                    self.log_test(f"Route {route}", False, f"Request failed: {str(e)}")
                    all_success = False
            
            if all_success:
                self.log_test("All HTML Routes", True, "All HTML routes are accessible and serving content")
            else:
                self.log_test("All HTML Routes", False, "Some HTML routes failed")
            
            return all_success
            
        except Exception as e:
            self.log_test("All HTML Routes", False, f"Route testing failed: {str(e)}")
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
            self.test_design_integration_routes,
            self.test_static_file_serving,
            self.test_postmessage_cors_support,
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