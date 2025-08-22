#!/usr/bin/env python3
"""
Mi Tienda Dashboard Integration Test Suite
Tests the actual Mi Tienda dashboard functionality and Laravel integration readiness
"""

import requests
import json
import sys
import os
import re
from datetime import datetime
from urllib.parse import urljoin

class MiTiendaIntegrationTester:
    def __init__(self):
        # Get backend URL from frontend .env file
        self.backend_url = self.get_backend_url()
        if not self.backend_url:
            raise Exception("Could not get backend URL from frontend/.env")
        
        self.api_url = f"{self.backend_url}/api"
        self.test_results = []
        self.session = requests.Session()
        
        print(f"🎯 Mi Tienda Dashboard Integration Tester")
        print(f"Backend URL: {self.backend_url}")
        print(f"API URL: {self.api_url}")
        print("=" * 80)
        
    def get_backend_url(self):
        """Get backend URL from frontend .env file"""
        try:
            with open('/app/frontend/.env', 'r') as f:
                for line in f:
                    if line.startswith('REACT_APP_BACKEND_URL='):
                        return line.split('=', 1)[1].strip()
        except Exception as e:
            print(f"Error reading frontend .env: {e}")
            return None
    
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
        print(f"{status}: {test_name}")
        print(f"   {message}")
        if details:
            print(f"   Details: {details}")
        print()
    
    def test_mi_tienda_dashboard_page_serving(self):
        """Test Mi Tienda dashboard page is served correctly"""
        try:
            # Test the main mi-tienda page via API
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for key dashboard elements
                dashboard_indicators = [
                    'Mi Tienda',
                    'dashboard',
                    'estadísticas',
                    'ingresos',
                    'visitas',
                    'Chart.js',
                    'Bootstrap'
                ]
                
                found_indicators = []
                for indicator in dashboard_indicators:
                    if indicator.lower() in content.lower():
                        found_indicators.append(indicator)
                
                if len(found_indicators) >= 4:
                    self.log_test(
                        "Mi Tienda Dashboard Page Serving",
                        True,
                        f"Dashboard page served with {len(found_indicators)}/{len(dashboard_indicators)} key elements",
                        f"Found: {', '.join(found_indicators)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Mi Tienda Dashboard Page Serving",
                        False,
                        f"Dashboard page missing key elements ({len(found_indicators)}/{len(dashboard_indicators)})",
                        f"Found: {', '.join(found_indicators)}"
                    )
                    return False
            else:
                self.log_test(
                    "Mi Tienda Dashboard Page Serving",
                    False,
                    f"Dashboard page not accessible (HTTP {response.status_code})",
                    f"Response: {response.text[:200]}..."
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Mi Tienda Dashboard Page Serving",
                False,
                f"Connection failed: {str(e)}",
                "Dashboard page may not be available"
            )
            return False
    
    def test_dashboard_javascript_functionality(self):
        """Test dashboard JavaScript functionality is present"""
        try:
            # Get the mi-tienda page content
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for JavaScript functionality
                js_functions = [
                    'loadData',
                    'updateUI',
                    'createCharts',
                    'handlePeriodSelect',
                    'dashboard',
                    'Chart.js',
                    'initializeDashboard'
                ]
                
                found_functions = []
                for func in js_functions:
                    if func in content:
                        found_functions.append(func)
                
                if len(found_functions) >= 4:
                    self.log_test(
                        "Dashboard JavaScript Functionality",
                        True,
                        f"Dashboard JavaScript functions present ({len(found_functions)}/{len(js_functions)})",
                        f"Found: {', '.join(found_functions)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Dashboard JavaScript Functionality",
                        False,
                        f"Dashboard JavaScript functions missing ({len(found_functions)}/{len(js_functions)})",
                        f"Found: {', '.join(found_functions)}"
                    )
                    return False
            else:
                self.log_test(
                    "Dashboard JavaScript Functionality",
                    False,
                    f"Could not access dashboard page (HTTP {response.status_code})",
                    "Cannot verify JavaScript functionality"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Dashboard JavaScript Functionality",
                False,
                f"Connection failed: {str(e)}",
                "Cannot verify JavaScript functionality"
            )
            return False
    
    def test_laravel_api_endpoint_structure(self):
        """Test Laravel API endpoint structure in dashboard code"""
        try:
            # Get the dashboard content to check for Laravel API calls
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for Laravel API endpoint patterns
                laravel_patterns = [
                    r'/user/api/mi-tienda/dashboard-stats',
                    r'csrf.*token',
                    r'X-CSRF-TOKEN',
                    r'Laravel.*auth',
                    r'Auth::',
                    r'laravelAuth'
                ]
                
                found_patterns = []
                for pattern in laravel_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        found_patterns.append(pattern)
                
                if len(found_patterns) >= 2:
                    self.log_test(
                        "Laravel API Endpoint Structure",
                        True,
                        f"Laravel integration patterns found ({len(found_patterns)}/{len(laravel_patterns)})",
                        f"Found patterns: {', '.join(found_patterns)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Laravel API Endpoint Structure",
                        False,
                        f"Laravel integration patterns missing ({len(found_patterns)}/{len(laravel_patterns)})",
                        f"Found patterns: {', '.join(found_patterns)}"
                    )
                    return False
            else:
                self.log_test(
                    "Laravel API Endpoint Structure",
                    False,
                    f"Could not access dashboard page (HTTP {response.status_code})",
                    "Cannot verify Laravel integration"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Laravel API Endpoint Structure",
                False,
                f"Connection failed: {str(e)}",
                "Cannot verify Laravel integration"
            )
            return False
    
    def test_dashboard_data_integration_readiness(self):
        """Test dashboard data integration readiness"""
        try:
            # Get the dashboard content
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for data integration features
                data_features = [
                    'fetch.*dashboard-stats',
                    'period.*7D.*14D.*30D',
                    'revenue.*change',
                    'visits.*change',
                    'leads.*change',
                    'chart.*data',
                    'mock.*data',
                    'fallback'
                ]
                
                found_features = []
                for feature in data_features:
                    if re.search(feature, content, re.IGNORECASE):
                        found_features.append(feature)
                
                if len(found_features) >= 5:
                    self.log_test(
                        "Dashboard Data Integration Readiness",
                        True,
                        f"Data integration features ready ({len(found_features)}/{len(data_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Dashboard Data Integration Readiness",
                        False,
                        f"Data integration features incomplete ({len(found_features)}/{len(data_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return False
            else:
                self.log_test(
                    "Dashboard Data Integration Readiness",
                    False,
                    f"Could not access dashboard page (HTTP {response.status_code})",
                    "Cannot verify data integration readiness"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Dashboard Data Integration Readiness",
                False,
                f"Connection failed: {str(e)}",
                "Cannot verify data integration readiness"
            )
            return False
    
    def test_authentication_integration_readiness(self):
        """Test authentication integration readiness"""
        try:
            # Get the dashboard content
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for authentication integration features
                auth_features = [
                    'PostMessage.*auth',
                    'LARAVEL_AUTH',
                    'csrfToken',
                    'userId',
                    'userName',
                    'X-CSRF-TOKEN',
                    'same-origin',
                    'credentials'
                ]
                
                found_features = []
                for feature in auth_features:
                    if re.search(feature, content, re.IGNORECASE):
                        found_features.append(feature)
                
                if len(found_features) >= 4:
                    self.log_test(
                        "Authentication Integration Readiness",
                        True,
                        f"Authentication integration ready ({len(found_features)}/{len(auth_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Authentication Integration Readiness",
                        False,
                        f"Authentication integration incomplete ({len(found_features)}/{len(auth_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return False
            else:
                self.log_test(
                    "Authentication Integration Readiness",
                    False,
                    f"Could not access dashboard page (HTTP {response.status_code})",
                    "Cannot verify authentication integration"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Authentication Integration Readiness",
                False,
                f"Connection failed: {str(e)}",
                "Cannot verify authentication integration"
            )
            return False
    
    def test_chart_visualization_integration(self):
        """Test chart visualization integration"""
        try:
            # Get the dashboard content
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for chart integration features
                chart_features = [
                    'Chart.js',
                    'createChart',
                    'chart.*data',
                    'canvas.*chart',
                    'visits.*day',
                    'bar.*chart',
                    'animation',
                    'tooltip'
                ]
                
                found_features = []
                for feature in chart_features:
                    if re.search(feature, content, re.IGNORECASE):
                        found_features.append(feature)
                
                if len(found_features) >= 5:
                    self.log_test(
                        "Chart Visualization Integration",
                        True,
                        f"Chart integration complete ({len(found_features)}/{len(chart_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Chart Visualization Integration",
                        False,
                        f"Chart integration incomplete ({len(found_features)}/{len(chart_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return False
            else:
                self.log_test(
                    "Chart Visualization Integration",
                    False,
                    f"Could not access dashboard page (HTTP {response.status_code})",
                    "Cannot verify chart integration"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Chart Visualization Integration",
                False,
                f"Connection failed: {str(e)}",
                "Cannot verify chart integration"
            )
            return False
    
    def test_responsive_design_implementation(self):
        """Test responsive design implementation"""
        try:
            # Get the dashboard content
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for responsive design features
                responsive_features = [
                    'mobile.*layout',
                    'desktop.*layout',
                    '@media.*min-width',
                    'viewport',
                    'responsive',
                    'grid.*template',
                    'flex',
                    'Bootstrap'
                ]
                
                found_features = []
                for feature in responsive_features:
                    if re.search(feature, content, re.IGNORECASE):
                        found_features.append(feature)
                
                if len(found_features) >= 5:
                    self.log_test(
                        "Responsive Design Implementation",
                        True,
                        f"Responsive design implemented ({len(found_features)}/{len(responsive_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Responsive Design Implementation",
                        False,
                        f"Responsive design incomplete ({len(found_features)}/{len(responsive_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return False
            else:
                self.log_test(
                    "Responsive Design Implementation",
                    False,
                    f"Could not access dashboard page (HTTP {response.status_code})",
                    "Cannot verify responsive design"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Responsive Design Implementation",
                False,
                f"Connection failed: {str(e)}",
                "Cannot verify responsive design"
            )
            return False
    
    def test_period_selector_functionality(self):
        """Test period selector functionality"""
        try:
            # Get the dashboard content
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for period selector features
                period_features = [
                    'period.*btn',
                    '7D.*14D.*30D',
                    'custom.*range',
                    'calendar.*modal',
                    'handlePeriodSelect',
                    'date.*range',
                    'period.*selector'
                ]
                
                found_features = []
                for feature in period_features:
                    if re.search(feature, content, re.IGNORECASE):
                        found_features.append(feature)
                
                if len(found_features) >= 4:
                    self.log_test(
                        "Period Selector Functionality",
                        True,
                        f"Period selector implemented ({len(found_features)}/{len(period_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Period Selector Functionality",
                        False,
                        f"Period selector incomplete ({len(found_features)}/{len(period_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return False
            else:
                self.log_test(
                    "Period Selector Functionality",
                    False,
                    f"Could not access dashboard page (HTTP {response.status_code})",
                    "Cannot verify period selector"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Period Selector Functionality",
                False,
                f"Connection failed: {str(e)}",
                "Cannot verify period selector"
            )
            return False
    
    def test_error_handling_and_fallbacks(self):
        """Test error handling and fallback mechanisms"""
        try:
            # Get the dashboard content
            response = self.session.get(f"{self.api_url}/mi-tienda", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for error handling features
                error_features = [
                    'try.*catch',
                    'fallback.*mock',
                    'error.*handling',
                    'loading.*state',
                    'timeout',
                    'exception',
                    'graceful',
                    'console.*error'
                ]
                
                found_features = []
                for feature in error_features:
                    if re.search(feature, content, re.IGNORECASE):
                        found_features.append(feature)
                
                if len(found_features) >= 4:
                    self.log_test(
                        "Error Handling and Fallbacks",
                        True,
                        f"Error handling implemented ({len(found_features)}/{len(error_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return True
                else:
                    self.log_test(
                        "Error Handling and Fallbacks",
                        False,
                        f"Error handling incomplete ({len(found_features)}/{len(error_features)})",
                        f"Found features: {', '.join(found_features)}"
                    )
                    return False
            else:
                self.log_test(
                    "Error Handling and Fallbacks",
                    False,
                    f"Could not access dashboard page (HTTP {response.status_code})",
                    "Cannot verify error handling"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(
                "Error Handling and Fallbacks",
                False,
                f"Connection failed: {str(e)}",
                "Cannot verify error handling"
            )
            return False
    
    def test_backend_api_compatibility(self):
        """Test backend API compatibility for Mi Tienda integration"""
        try:
            # Test existing API endpoints that support Mi Tienda
            api_tests = [
                ("/", "Root API endpoint"),
                ("/status", "Status endpoint for health checks"),
                ("/mi-tienda", "Mi Tienda page serving"),
                ("/diseno", "Design integration endpoint")
            ]
            
            passed_tests = 0
            total_tests = len(api_tests)
            
            for endpoint, description in api_tests:
                try:
                    response = self.session.get(f"{self.api_url}{endpoint}", timeout=10)
                    if response.status_code == 200:
                        passed_tests += 1
                except:
                    pass
            
            if passed_tests >= 3:
                self.log_test(
                    "Backend API Compatibility",
                    True,
                    f"Backend API compatible ({passed_tests}/{total_tests} endpoints working)",
                    "FastAPI backend supports Mi Tienda integration"
                )
                return True
            else:
                self.log_test(
                    "Backend API Compatibility",
                    False,
                    f"Backend API issues ({passed_tests}/{total_tests} endpoints working)",
                    "Some API endpoints not responding"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Backend API Compatibility",
                False,
                f"API compatibility test failed: {str(e)}",
                "Cannot verify backend compatibility"
            )
            return False
    
    def run_all_tests(self):
        """Run all Mi Tienda Dashboard integration tests"""
        print("🚀 Starting Mi Tienda Dashboard Integration Tests")
        print("=" * 80)
        
        tests = [
            self.test_mi_tienda_dashboard_page_serving,
            self.test_dashboard_javascript_functionality,
            self.test_laravel_api_endpoint_structure,
            self.test_dashboard_data_integration_readiness,
            self.test_authentication_integration_readiness,
            self.test_chart_visualization_integration,
            self.test_responsive_design_implementation,
            self.test_period_selector_functionality,
            self.test_error_handling_and_fallbacks,
            self.test_backend_api_compatibility
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 80)
        print(f"📊 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All Mi Tienda Dashboard integration tests PASSED!")
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
        tester = MiTiendaIntegrationTester()
        success = tester.run_all_tests()
        
        # Print detailed results
        summary = tester.get_summary()
        print(f"\n📈 Success Rate: {summary['success_rate']:.1f}%")
        
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"❌ Test setup failed: {str(e)}")
        sys.exit(1)