#!/usr/bin/env python3
"""
Laravel Blade Integration Testing Suite for Mi Tienda
Tests the Laravel Blade syntax fixes and route accessibility
"""

import subprocess
import os
import sys
import re
from pathlib import Path

class LaravelBladeIntegrationTester:
    def __init__(self):
        self.laravel_path = Path("/app/temp_laravel_repo")
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
    
    def test_blade_syntax_validation(self):
        """Test all Mi Tienda Blade files for PHP syntax errors"""
        try:
            blade_files = [
                "resources/views/user/pages/mi-tienda/index.blade.php",
                "resources/views/user/pages/mi-tienda/dashboard.blade.php", 
                "resources/views/user/pages/mi-tienda/ingresos.blade.php",
                "resources/views/user/pages/mi-tienda/diseno.blade.php",
                "resources/views/user/pages/mi-tienda/customers.blade.php",
                "resources/views/user/pages/mi-tienda/statistics.blade.php"
            ]
            
            all_valid = True
            syntax_errors = []
            
            for blade_file in blade_files:
                file_path = self.laravel_path / blade_file
                if not file_path.exists():
                    syntax_errors.append(f"File not found: {blade_file}")
                    all_valid = False
                    continue
                
                # Read file content and check for problematic syntax
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check for the problematic double backslash syntax that was causing errors
                    if '\\\\Throwable' in content or 'catch (\\\\' in content:
                        syntax_errors.append(f"Found problematic double backslash syntax in {blade_file}")
                        all_valid = False
                    
                    # Check for proper Blade syntax patterns
                    if '@extends(' in content and '@section(' in content:
                        # File has proper Blade structure
                        pass
                    else:
                        syntax_errors.append(f"Missing proper Blade structure in {blade_file}")
                        all_valid = False
                        
                except Exception as e:
                    syntax_errors.append(f"Error reading {blade_file}: {str(e)}")
                    all_valid = False
            
            if all_valid:
                self.log_test("Blade Syntax Validation", True, "All Mi Tienda Blade files have valid syntax")
                return True
            else:
                self.log_test("Blade Syntax Validation", False, f"Blade syntax issues found", syntax_errors)
                return False
                
        except Exception as e:
            self.log_test("Blade Syntax Validation", False, f"Syntax validation failed: {str(e)}")
            return False
    
    def test_blade_content_structure(self):
        """Test that Blade files have correct content structure"""
        try:
            blade_files = {
                "dashboard.blade.php": ["Panel de Control", "dashboardFrame", "dashboard.html"],
                "ingresos.blade.php": ["Gestión de Ingresos", "ingresosFrame", "ingresos.html"],
                "diseno.blade.php": ["Personalización de Diseño", "disenoFrame", "diseno.html"],
                "customers.blade.php": ["Gestión de Clientes", "customersFrame", "customers.html"],
                "statistics.blade.php": ["Análisis y Estadísticas", "statisticsFrame", "statistics.html"],
                "index.blade.php": ["Mi Tienda Principal", "miTiendaFrame", "mi-tienda.html"]
            }
            
            all_valid = True
            content_errors = []
            
            for blade_file, expected_content in blade_files.items():
                file_path = self.laravel_path / "resources/views/user/pages/mi-tienda" / blade_file
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    missing_content = []
                    for expected in expected_content:
                        if expected not in content:
                            missing_content.append(expected)
                    
                    if missing_content:
                        content_errors.append(f"{blade_file}: Missing content {missing_content}")
                        all_valid = False
                        
                except Exception as e:
                    content_errors.append(f"Error reading {blade_file}: {str(e)}")
                    all_valid = False
            
            if all_valid:
                self.log_test("Blade Content Structure", True, "All Blade files have correct content structure")
                return True
            else:
                self.log_test("Blade Content Structure", False, f"Content structure issues found", content_errors)
                return False
                
        except Exception as e:
            self.log_test("Blade Content Structure", False, f"Content structure test failed: {str(e)}")
            return False
    
    def test_controller_exists(self):
        """Test that MiTiendaController exists and has correct methods"""
        try:
            controller_path = self.laravel_path / "app/Http/Controllers/User/MiTiendaController.php"
            
            if not controller_path.exists():
                self.log_test("MiTienda Controller", False, "MiTiendaController.php not found")
                return False
            
            with open(controller_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for required methods
            required_methods = ['index', 'dashboard', 'ingresos', 'diseno', 'customers', 'statistics']
            missing_methods = []
            
            for method in required_methods:
                if f"public function {method}()" not in content:
                    missing_methods.append(method)
            
            if missing_methods:
                self.log_test("MiTienda Controller", False, f"Missing methods: {missing_methods}")
                return False
            else:
                self.log_test("MiTienda Controller", True, "MiTiendaController exists with all required methods")
                return True
                
        except Exception as e:
            self.log_test("MiTienda Controller", False, f"Controller test failed: {str(e)}")
            return False
    
    def test_routes_configuration(self):
        """Test that Laravel routes are properly configured"""
        try:
            routes_path = self.laravel_path / "routes/web.php"
            
            if not routes_path.exists():
                self.log_test("Routes Configuration", False, "web.php routes file not found")
                return False
            
            with open(routes_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for Mi Tienda routes
            required_routes = [
                "Route::get('/', [MiTiendaController::class, 'index'])",
                "Route::get('/dashboard', [MiTiendaController::class, 'dashboard'])",
                "Route::get('/ingresos', [MiTiendaController::class, 'ingresos'])",
                "Route::get('/diseno', [MiTiendaController::class, 'diseno'])",
                "Route::get('/customers', [MiTiendaController::class, 'customers'])",
                "Route::get('/statistics', [MiTiendaController::class, 'statistics'])"
            ]
            
            missing_routes = []
            for route in required_routes:
                if route not in content:
                    missing_routes.append(route)
            
            # Also check for the route prefix
            if "Route::prefix('mi-tienda')" not in content:
                missing_routes.append("mi-tienda prefix")
            
            if missing_routes:
                self.log_test("Routes Configuration", False, f"Missing routes: {missing_routes}")
                return False
            else:
                self.log_test("Routes Configuration", True, "All Mi Tienda routes are properly configured")
                return True
                
        except Exception as e:
            self.log_test("Routes Configuration", False, f"Routes test failed: {str(e)}")
            return False
    
    def test_static_html_files_exist(self):
        """Test that static HTML files exist in Laravel public directory"""
        try:
            html_files = [
                "public/mi-tienda/mi-tienda.html",
                "public/mi-tienda/dashboard.html",
                "public/mi-tienda/ingresos.html",
                "public/mi-tienda/diseno.html",
                "public/mi-tienda/customers.html",
                "public/mi-tienda/statistics.html"
            ]
            
            missing_files = []
            for html_file in html_files:
                file_path = self.laravel_path / html_file
                if not file_path.exists():
                    missing_files.append(html_file)
            
            if missing_files:
                self.log_test("Static HTML Files", False, f"Missing HTML files: {missing_files}")
                return False
            else:
                self.log_test("Static HTML Files", True, "All required static HTML files exist")
                return True
                
        except Exception as e:
            self.log_test("Static HTML Files", False, f"HTML files test failed: {str(e)}")
            return False
    
    def test_iframe_src_paths(self):
        """Test that iframe src paths in Blade files are correct"""
        try:
            blade_files = {
                "dashboard.blade.php": "mi-tienda/dashboard.html",
                "ingresos.blade.php": "mi-tienda/ingresos.html", 
                "diseno.blade.php": "mi-tienda/diseno.html",
                "customers.blade.php": "mi-tienda/customers.html",
                "statistics.blade.php": "mi-tienda/statistics.html",
                "index.blade.php": "mi-tienda/mi-tienda.html"
            }
            
            all_valid = True
            path_errors = []
            
            for blade_file, expected_src in blade_files.items():
                file_path = self.laravel_path / "resources/views/user/pages/mi-tienda" / blade_file
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check for correct asset() usage
                    if f"asset('{expected_src}')" not in content:
                        path_errors.append(f"{blade_file}: Missing correct asset path {expected_src}")
                        all_valid = False
                        
                except Exception as e:
                    path_errors.append(f"Error reading {blade_file}: {str(e)}")
                    all_valid = False
            
            if all_valid:
                self.log_test("Iframe Src Paths", True, "All iframe src paths are correctly configured")
                return True
            else:
                self.log_test("Iframe Src Paths", False, f"Iframe path issues found", path_errors)
                return False
                
        except Exception as e:
            self.log_test("Iframe Src Paths", False, f"Iframe paths test failed: {str(e)}")
            return False
    
    def test_no_problematic_syntax(self):
        """Test that problematic PHP syntax has been removed"""
        try:
            blade_files = [
                "resources/views/user/pages/mi-tienda/index.blade.php",
                "resources/views/user/pages/mi-tienda/dashboard.blade.php",
                "resources/views/user/pages/mi-tienda/ingresos.blade.php", 
                "resources/views/user/pages/mi-tienda/diseno.blade.php",
                "resources/views/user/pages/mi-tienda/customers.blade.php",
                "resources/views/user/pages/mi-tienda/statistics.blade.php"
            ]
            
            all_clean = True
            problematic_files = []
            
            for blade_file in blade_files:
                file_path = self.laravel_path / blade_file
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check for problematic patterns that were causing PHP 8.2.29 errors
                    problematic_patterns = [
                        '\\\\Throwable',
                        'catch (\\\\',
                        '@php',  # Should not have @php blocks anymore
                        'try {',  # Should not have try-catch blocks
                        'catch ('
                    ]
                    
                    found_problems = []
                    for pattern in problematic_patterns:
                        if pattern in content:
                            found_problems.append(pattern)
                    
                    if found_problems:
                        problematic_files.append(f"{blade_file}: {found_problems}")
                        all_clean = False
                        
                except Exception as e:
                    problematic_files.append(f"Error reading {blade_file}: {str(e)}")
                    all_clean = False
            
            if all_clean:
                self.log_test("No Problematic Syntax", True, "All problematic PHP syntax has been removed from Blade files")
                return True
            else:
                self.log_test("No Problematic Syntax", False, f"Problematic syntax still found", problematic_files)
                return False
                
        except Exception as e:
            self.log_test("No Problematic Syntax", False, f"Syntax check failed: {str(e)}")
            return False
    
    def test_url_helper_usage(self):
        """Test that url() helper is used correctly instead of problematic try-catch"""
        try:
            blade_files = [
                "resources/views/user/pages/mi-tienda/index.blade.php",
                "resources/views/user/pages/mi-tienda/dashboard.blade.php",
                "resources/views/user/pages/mi-tienda/ingresos.blade.php",
                "resources/views/user/pages/mi-tienda/diseno.blade.php", 
                "resources/views/user/pages/mi-tienda/customers.blade.php",
                "resources/views/user/pages/mi-tienda/statistics.blade.php"
            ]
            
            all_valid = True
            url_errors = []
            
            for blade_file in blade_files:
                file_path = self.laravel_path / blade_file
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check for proper url() helper usage
                    if "url('/user/mi-tienda')" not in content and "url('/user/cards')" not in content:
                        url_errors.append(f"{blade_file}: Missing proper url() helper usage")
                        all_valid = False
                        
                except Exception as e:
                    url_errors.append(f"Error reading {blade_file}: {str(e)}")
                    all_valid = False
            
            if all_valid:
                self.log_test("URL Helper Usage", True, "All Blade files use url() helper correctly")
                return True
            else:
                self.log_test("URL Helper Usage", False, f"URL helper issues found", url_errors)
                return False
                
        except Exception as e:
            self.log_test("URL Helper Usage", False, f"URL helper test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all Laravel Blade integration tests"""
        print(f"🚀 Starting Laravel Blade Integration Tests for Mi Tienda")
        print(f"Laravel Path: {self.laravel_path}")
        print("=" * 60)
        
        tests = [
            self.test_blade_syntax_validation,
            self.test_no_problematic_syntax,
            self.test_url_helper_usage,
            self.test_blade_content_structure,
            self.test_controller_exists,
            self.test_routes_configuration,
            self.test_static_html_files_exist,
            self.test_iframe_src_paths
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 60)
        print(f"📊 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All Laravel Blade integration tests PASSED!")
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
        tester = LaravelBladeIntegrationTester()
        success = tester.run_all_tests()
        
        # Print detailed results
        summary = tester.get_summary()
        print(f"\n📈 Success Rate: {summary['success_rate']:.1f}%")
        
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"❌ Test setup failed: {str(e)}")
        sys.exit(1)