#!/usr/bin/env python3
"""
Laravel Integration Testing Suite for Mi Tienda
Tests the specific Laravel integration issues reported by the user:
1. 404 errors for images (logo.png, favicon.png) 
2. 403 Forbidden error on /user/mi-tienda/ route (index) while sub-routes work fine
"""

import requests
import json
import sys
import os
from datetime import datetime
from pathlib import Path

class LaravelIntegrationTester:
    def __init__(self):
        # Based on review request, this appears to be testing a Laravel application
        # The user mentioned URLs like https://clickmy.link/user/mi-tienda/
        self.base_url = "https://clickmy.link"  # Production URL from review request
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
    
    def test_image_files_accessibility(self):
        """Test that logo.png and favicon.png are accessible at /images/"""
        try:
            # Test the image files that were reported as 404
            image_files = [
                "/images/logo.png",
                "/images/favicon.png"
            ]
            
            all_success = True
            for image_file in image_files:
                try:
                    # Test if image is accessible
                    response = requests.get(f"{self.base_url}{image_file}", timeout=10)
                    if response.status_code == 200:
                        # Check if it's actually an image by checking content type or size
                        content_type = response.headers.get('content-type', '')
                        content_length = len(response.content)
                        
                        if 'image' in content_type.lower() or content_length > 500:
                            self.log_test(f"Image File {image_file}", True, 
                                        f"Image accessible and valid (Content-Type: {content_type}, Size: {content_length} bytes)")
                        else:
                            self.log_test(f"Image File {image_file}", False, 
                                        f"File accessible but may not be valid image (Content-Type: {content_type}, Size: {content_length} bytes)")
                            all_success = False
                    elif response.status_code == 404:
                        self.log_test(f"Image File {image_file}", False, 
                                    f"404 Not Found - Image file missing (this was the reported issue)")
                        all_success = False
                    else:
                        self.log_test(f"Image File {image_file}", False, 
                                    f"HTTP {response.status_code}: {response.text[:100]}")
                        all_success = False
                        
                except requests.exceptions.RequestException as e:
                    self.log_test(f"Image File {image_file}", False, f"Request failed: {str(e)}")
                    all_success = False
            
            return all_success
            
        except Exception as e:
            self.log_test("Image Files Accessibility", False, f"Test failed: {str(e)}")
            return False
    
    def test_mi_tienda_index_route(self):
        """Test the main Mi Tienda index route that was reported as 403 Forbidden"""
        try:
            # Test the main index route that was failing
            index_url = f"{self.base_url}/user/mi-tienda/"
            
            response = requests.get(index_url, timeout=15, allow_redirects=True)
            
            if response.status_code == 200:
                content = response.text
                # Check if it contains expected Mi Tienda content
                if any(keyword in content.lower() for keyword in ['mi tienda', 'mi-tienda', 'tienda']):
                    self.log_test("Mi Tienda Index Route", True, 
                                "Index route accessible and contains expected content")
                    return True
                else:
                    self.log_test("Mi Tienda Index Route", False, 
                                "Index route accessible but doesn't contain expected Mi Tienda content")
                    return False
            elif response.status_code == 403:
                self.log_test("Mi Tienda Index Route", False, 
                            "403 Forbidden error on index route (this was the reported issue)")
                return False
            elif response.status_code == 404:
                self.log_test("Mi Tienda Index Route", False, 
                            "404 Not Found - Route may not be properly configured")
                return False
            else:
                self.log_test("Mi Tienda Index Route", False, 
                            f"HTTP {response.status_code}: {response.text[:200]}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Mi Tienda Index Route", False, f"Request failed: {str(e)}")
            return False
    
    def test_mi_tienda_sub_routes(self):
        """Test Mi Tienda sub-routes that were reported as working"""
        try:
            # Test the sub-routes that were reported as working
            sub_routes = [
                "/user/mi-tienda/dashboard",
                "/user/mi-tienda/ingresos",
                "/user/mi-tienda/diseno",
                "/user/mi-tienda/customers",
                "/user/mi-tienda/statistics"
            ]
            
            working_routes = []
            failing_routes = []
            
            for route in sub_routes:
                try:
                    response = requests.get(f"{self.base_url}{route}", timeout=15, allow_redirects=True)
                    
                    if response.status_code == 200:
                        working_routes.append(route)
                        self.log_test(f"Sub-route {route}", True, "Sub-route accessible")
                    elif response.status_code == 403:
                        failing_routes.append(route)
                        self.log_test(f"Sub-route {route}", False, "403 Forbidden error")
                    elif response.status_code == 404:
                        failing_routes.append(route)
                        self.log_test(f"Sub-route {route}", False, "404 Not Found")
                    else:
                        failing_routes.append(route)
                        self.log_test(f"Sub-route {route}", False, f"HTTP {response.status_code}")
                        
                except requests.exceptions.RequestException as e:
                    failing_routes.append(route)
                    self.log_test(f"Sub-route {route}", False, f"Request failed: {str(e)}")
            
            # Summary
            if len(working_routes) > 0:
                self.log_test("Mi Tienda Sub-routes Summary", True, 
                            f"{len(working_routes)} sub-routes working, {len(failing_routes)} failing",
                            f"Working: {working_routes}, Failing: {failing_routes}")
                return True
            else:
                self.log_test("Mi Tienda Sub-routes Summary", False, 
                            f"All {len(failing_routes)} sub-routes failing")
                return False
                
        except Exception as e:
            self.log_test("Mi Tienda Sub-routes", False, f"Test failed: {str(e)}")
            return False
    
    def test_laravel_blade_files_exist(self):
        """Test if Laravel Blade files exist in the local repository"""
        try:
            # Check if the Laravel Blade files exist locally
            blade_files = [
                "/app/temp_laravel_repo/resources/views/user/pages/mi-tienda/index.blade.php",
                "/app/temp_laravel_repo/resources/views/user/pages/mi-tienda/dashboard.blade.php",
                "/app/temp_laravel_repo/resources/views/user/pages/mi-tienda/ingresos.blade.php",
                "/app/temp_laravel_repo/resources/views/user/pages/mi-tienda/diseno.blade.php",
                "/app/temp_laravel_repo/resources/views/user/pages/mi-tienda/customers.blade.php",
                "/app/temp_laravel_repo/resources/views/user/pages/mi-tienda/statistics.blade.php"
            ]
            
            existing_files = []
            missing_files = []
            
            for blade_file in blade_files:
                if Path(blade_file).exists():
                    existing_files.append(blade_file)
                    # Check if file has valid content
                    try:
                        with open(blade_file, 'r') as f:
                            content = f.read()
                            if '@extends' in content and '@section' in content:
                                self.log_test(f"Blade File {Path(blade_file).name}", True, 
                                            "Blade file exists and has valid Laravel syntax")
                            else:
                                self.log_test(f"Blade File {Path(blade_file).name}", False, 
                                            "Blade file exists but may have invalid syntax")
                    except Exception as e:
                        self.log_test(f"Blade File {Path(blade_file).name}", False, 
                                    f"Blade file exists but couldn't read content: {str(e)}")
                else:
                    missing_files.append(blade_file)
                    self.log_test(f"Blade File {Path(blade_file).name}", False, 
                                "Blade file missing")
            
            if len(existing_files) == len(blade_files):
                self.log_test("Laravel Blade Files", True, 
                            f"All {len(existing_files)} Blade files exist and have valid syntax")
                return True
            else:
                self.log_test("Laravel Blade Files", False, 
                            f"{len(missing_files)} Blade files missing: {[Path(f).name for f in missing_files]}")
                return False
                
        except Exception as e:
            self.log_test("Laravel Blade Files", False, f"Test failed: {str(e)}")
            return False
    
    def test_mi_tienda_controller_exists(self):
        """Test if MiTiendaController exists and has required methods"""
        try:
            controller_path = "/app/temp_laravel_repo/app/Http/Controllers/User/MiTiendaController.php"
            
            if not Path(controller_path).exists():
                self.log_test("MiTiendaController", False, "MiTiendaController.php file missing")
                return False
            
            # Read controller content
            with open(controller_path, 'r') as f:
                content = f.read()
            
            # Check for required methods
            required_methods = ['index', 'dashboard', 'ingresos', 'diseno', 'customers', 'statistics']
            existing_methods = []
            missing_methods = []
            
            for method in required_methods:
                if f"function {method}(" in content:
                    existing_methods.append(method)
                else:
                    missing_methods.append(method)
            
            if len(existing_methods) == len(required_methods):
                self.log_test("MiTiendaController", True, 
                            f"Controller exists with all {len(existing_methods)} required methods")
                return True
            else:
                self.log_test("MiTiendaController", False, 
                            f"Controller missing methods: {missing_methods}")
                return False
                
        except Exception as e:
            self.log_test("MiTiendaController", False, f"Test failed: {str(e)}")
            return False
    
    def test_public_mi_tienda_html_exists(self):
        """Test if mi-tienda.html file exists in public directory"""
        try:
            html_files = [
                "/app/temp_laravel_repo/public/mi-tienda/mi-tienda.html",
                "/app/temp_laravel_repo/public/mi-tienda/index.html"
            ]
            
            existing_files = []
            for html_file in html_files:
                if Path(html_file).exists():
                    existing_files.append(html_file)
                    # Check file size and basic content
                    file_size = Path(html_file).stat().st_size
                    if file_size > 1000:  # Should be a substantial HTML file
                        self.log_test(f"HTML File {Path(html_file).name}", True, 
                                    f"HTML file exists and has substantial content ({file_size} bytes)")
                    else:
                        self.log_test(f"HTML File {Path(html_file).name}", False, 
                                    f"HTML file exists but seems too small ({file_size} bytes)")
                else:
                    self.log_test(f"HTML File {Path(html_file).name}", False, 
                                "HTML file missing")
            
            if len(existing_files) > 0:
                self.log_test("Public Mi Tienda HTML Files", True, 
                            f"{len(existing_files)} HTML files found")
                return True
            else:
                self.log_test("Public Mi Tienda HTML Files", False, 
                            "No Mi Tienda HTML files found in public directory")
                return False
                
        except Exception as e:
            self.log_test("Public Mi Tienda HTML Files", False, f"Test failed: {str(e)}")
            return False
    
    def test_laravel_routes_configuration(self):
        """Test if Laravel routes are properly configured"""
        try:
            routes_file = "/app/temp_laravel_repo/routes/web.php"
            
            if not Path(routes_file).exists():
                self.log_test("Laravel Routes Configuration", False, "web.php routes file missing")
                return False
            
            # Read routes file
            with open(routes_file, 'r') as f:
                content = f.read()
            
            # Check for Mi Tienda routes configuration
            route_checks = [
                "MiTiendaController",
                "mi-tienda",
                "prefix('mi-tienda')",
                "Route::get('/', [MiTiendaController::class, 'index'])"
            ]
            
            found_patterns = []
            missing_patterns = []
            
            for pattern in route_checks:
                if pattern in content:
                    found_patterns.append(pattern)
                else:
                    missing_patterns.append(pattern)
            
            if len(found_patterns) >= 3:  # At least 3 out of 4 patterns should be found
                self.log_test("Laravel Routes Configuration", True, 
                            f"Routes properly configured with {len(found_patterns)} expected patterns found")
                return True
            else:
                self.log_test("Laravel Routes Configuration", False, 
                            f"Routes configuration incomplete. Missing patterns: {missing_patterns}")
                return False
                
        except Exception as e:
            self.log_test("Laravel Routes Configuration", False, f"Test failed: {str(e)}")
            return False
    
    def test_image_files_exist_locally(self):
        """Test if image files exist locally in the Laravel public directory"""
        try:
            image_files = [
                "/app/temp_laravel_repo/public/images/logo.png",
                "/app/temp_laravel_repo/public/images/favicon.png"
            ]
            
            existing_files = []
            missing_files = []
            
            for image_file in image_files:
                if Path(image_file).exists():
                    existing_files.append(image_file)
                    file_size = Path(image_file).stat().st_size
                    if file_size > 100:  # Should be a substantial image file
                        self.log_test(f"Local Image {Path(image_file).name}", True, 
                                    f"Image file exists locally ({file_size} bytes)")
                    else:
                        self.log_test(f"Local Image {Path(image_file).name}", False, 
                                    f"Image file exists but seems too small ({file_size} bytes)")
                else:
                    missing_files.append(image_file)
                    self.log_test(f"Local Image {Path(image_file).name}", False, 
                                "Image file missing locally")
            
            if len(existing_files) == len(image_files):
                self.log_test("Local Image Files", True, 
                            f"All {len(existing_files)} image files exist locally")
                return True
            else:
                self.log_test("Local Image Files", False, 
                            f"{len(missing_files)} image files missing locally")
                return False
                
        except Exception as e:
            self.log_test("Local Image Files", False, f"Test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all Laravel integration tests"""
        print(f"🚀 Starting Laravel Integration Tests for Mi Tienda")
        print(f"Testing Laravel application at: {self.base_url}")
        print("=" * 60)
        
        tests = [
            # Local file system tests
            self.test_laravel_blade_files_exist,
            self.test_mi_tienda_controller_exists,
            self.test_public_mi_tienda_html_exists,
            self.test_laravel_routes_configuration,
            self.test_image_files_exist_locally,
            
            # Remote Laravel application tests
            self.test_image_files_accessibility,
            self.test_mi_tienda_index_route,
            self.test_mi_tienda_sub_routes
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"📊 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All Laravel integration tests PASSED!")
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
        tester = LaravelIntegrationTester()
        success = tester.run_all_tests()
        
        # Print detailed results
        summary = tester.get_summary()
        print(f"\n📈 Success Rate: {summary['success_rate']:.1f}%")
        
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"❌ Test setup failed: {str(e)}")
        sys.exit(1)