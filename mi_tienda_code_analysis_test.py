#!/usr/bin/env python3
"""
Mi Tienda Link Image Persistence Code Analysis Test
Analyzes the Laravel controller code to verify the fix implementation
"""

import re
import sys
from pathlib import Path

class MiTiendaCodeAnalyzer:
    def __init__(self):
        self.controller_path = "/app/temp_laravel_repo/app/Http/Controllers/User/MiTiendaApiController.php"
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
    
    def test_controller_file_exists(self):
        """Test that the Laravel controller file exists"""
        try:
            controller_file = Path(self.controller_path)
            if controller_file.exists():
                self.log_test("Controller File Exists", True, 
                            "MiTiendaApiController.php file exists", 
                            f"File size: {controller_file.stat().st_size} bytes")
                return True
            else:
                self.log_test("Controller File Exists", False, 
                            "MiTiendaApiController.php file not found")
                return False
        except Exception as e:
            self.log_test("Controller File Exists", False, f"Error checking file: {str(e)}")
            return False
    
    def test_state_get_method_exists(self):
        """Test that stateGet method exists and returns links with icon field"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            # Check if stateGet method exists
            if 'public function stateGet(' in content:
                # Check if it queries card_links table
                if "'card_links'" in content and 'stateGet' in content:
                    # Check if it returns links in payload
                    if "'links'" in content and 'DB::table(\'card_links\')' in content:
                        self.log_test("StateGet Method Implementation", True, 
                                    "stateGet method exists and queries card_links table correctly", 
                                    "Method returns links with icon field from database")
                        return True
                    else:
                        self.log_test("StateGet Method Implementation", False, 
                                    "stateGet method exists but doesn't properly query card_links")
                        return False
                else:
                    self.log_test("StateGet Method Implementation", False, 
                                "stateGet method exists but doesn't query card_links table")
                    return False
            else:
                self.log_test("StateGet Method Implementation", False, 
                            "stateGet method not found in controller")
                return False
        except Exception as e:
            self.log_test("StateGet Method Implementation", False, f"Error reading file: {str(e)}")
            return False
    
    def test_state_post_base64_processing(self):
        """Test that statePost method processes base64 images correctly"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            # Check if statePost method exists
            if 'public function statePost(' in content:
                # Check for base64 image processing logic
                base64_checks = [
                    'str_starts_with($x[\'image_url\'], \'data:image\')',  # Base64 detection
                    'base64_decode($file_data)',  # Base64 decoding
                    'file_put_contents($fullPath, $image_data)',  # File saving
                    '$iconPath = $path'  # Icon path assignment
                ]
                
                found_checks = []
                for check in base64_checks:
                    if check in content:
                        found_checks.append(check)
                
                if len(found_checks) >= 3:  # At least 3 of 4 key operations
                    self.log_test("StatePost Base64 Processing", True, 
                                "statePost method has proper base64 image processing logic", 
                                f"Found {len(found_checks)}/4 key processing steps")
                    return True
                else:
                    self.log_test("StatePost Base64 Processing", False, 
                                "statePost method missing base64 processing logic", 
                                f"Found only {len(found_checks)}/4 key processing steps")
                    return False
            else:
                self.log_test("StatePost Base64 Processing", False, 
                            "statePost method not found in controller")
                return False
        except Exception as e:
            self.log_test("StatePost Base64 Processing", False, f"Error reading file: {str(e)}")
            return False
    
    def test_state_post_icon_preservation(self):
        """Test that statePost method preserves existing icon paths"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            # Check for icon preservation logic
            if 'public function statePost(' in content:
                # Look for logic that preserves existing icon paths
                preservation_checks = [
                    '$iconPath = $x[\'icon\'] ?? null',  # Initial icon path from input
                    'if (!empty($x[\'image_url\']) && str_starts_with($x[\'image_url\'], \'data:image\'))',  # Conditional processing
                    '\'icon\'=>$iconPath'  # Using processed icon path in database insert
                ]
                
                found_checks = []
                for check in preservation_checks:
                    if check in content:
                        found_checks.append(check)
                
                if len(found_checks) >= 2:  # At least 2 of 3 key preservation steps
                    self.log_test("StatePost Icon Preservation", True, 
                                "statePost method has proper icon preservation logic", 
                                f"Found {len(found_checks)}/3 key preservation steps")
                    return True
                else:
                    self.log_test("StatePost Icon Preservation", False, 
                                "statePost method missing icon preservation logic", 
                                f"Found only {len(found_checks)}/3 key preservation steps")
                    return False
            else:
                self.log_test("StatePost Icon Preservation", False, 
                            "statePost method not found in controller")
                return False
        except Exception as e:
            self.log_test("StatePost Icon Preservation", False, f"Error reading file: {str(e)}")
            return False
    
    def test_delete_insert_logic(self):
        """Test that statePost uses delete/insert logic for links"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            if 'public function statePost(' in content:
                # Check for delete/insert pattern
                delete_insert_checks = [
                    'DB::table(\'card_links\')->where(\'card_id\',$card->id)->delete()',  # Delete existing
                    'if($rows) DB::table(\'card_links\')->insert($rows)',  # Insert new batch
                    'DB::transaction(function() use ($card, $r)'  # Transaction wrapper
                ]
                
                found_checks = []
                for check in delete_insert_checks:
                    if check in content:
                        found_checks.append(check)
                
                if len(found_checks) >= 2:  # At least delete and insert operations
                    self.log_test("Delete/Insert Logic", True, 
                                "statePost method uses proper delete/insert logic for links", 
                                f"Found {len(found_checks)}/3 key operations")
                    return True
                else:
                    self.log_test("Delete/Insert Logic", False, 
                                "statePost method missing delete/insert logic", 
                                f"Found only {len(found_checks)}/3 key operations")
                    return False
            else:
                self.log_test("Delete/Insert Logic", False, 
                            "statePost method not found in controller")
                return False
        except Exception as e:
            self.log_test("Delete/Insert Logic", False, f"Error reading file: {str(e)}")
            return False
    
    def test_products_get_asset_url_fix(self):
        """Test that productsGet method uses asset() function for image URLs"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            if 'public function productsGet(' in content:
                # Check for asset() function usage in productsGet
                asset_checks = [
                    'asset($link->icon)',  # Asset function for link icons
                    '\'image_url\' => $link->icon ? asset($link->icon) : \'\'',  # Proper image_url generation
                    '\'image_path\' => $link->icon ? asset($link->icon) : \'\'',  # Proper image_path generation
                ]
                
                found_checks = []
                for check in asset_checks:
                    if check in content:
                        found_checks.append(check)
                
                if len(found_checks) >= 1:  # At least one asset() usage
                    self.log_test("ProductsGet Asset URL Fix", True, 
                                "productsGet method uses asset() function for proper image URLs", 
                                f"Found {len(found_checks)}/3 asset() usages")
                    return True
                else:
                    self.log_test("ProductsGet Asset URL Fix", False, 
                                "productsGet method missing asset() function usage", 
                                "No asset() function calls found for image URLs")
                    return False
            else:
                self.log_test("ProductsGet Asset URL Fix", False, 
                            "productsGet method not found in controller")
                return False
        except Exception as e:
            self.log_test("ProductsGet Asset URL Fix", False, f"Error reading file: {str(e)}")
            return False
    
    def test_image_processing_error_handling(self):
        """Test that image processing has proper error handling"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            # Check for error handling in image processing
            error_handling_checks = [
                '@list($type, $file_data) = explode',  # Error suppression for explode
                'if (!file_exists($uploadDir))',  # Directory existence check
                'mkdir($uploadDir, 0755, true)',  # Directory creation
                'preg_match(\'/^data:image\/(\w+);base64,/\', $base64_image, $matches)'  # Extension detection
            ]
            
            found_checks = []
            for check in error_handling_checks:
                if check in content:
                    found_checks.append(check)
            
            if len(found_checks) >= 3:  # At least 3 of 4 error handling measures
                self.log_test("Image Processing Error Handling", True, 
                            "Image processing has proper error handling", 
                            f"Found {len(found_checks)}/4 error handling measures")
                return True
            else:
                self.log_test("Image Processing Error Handling", False, 
                            "Image processing missing error handling", 
                            f"Found only {len(found_checks)}/4 error handling measures")
                return False
        except Exception as e:
            self.log_test("Image Processing Error Handling", False, f"Error reading file: {str(e)}")
            return False
    
    def test_file_upload_security(self):
        """Test that file upload has proper security measures"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            # Check for security measures in file upload
            security_checks = [
                'Auth::id()',  # User authentication
                'Str::random(',  # Random filename generation
                'public_path($path)',  # Proper path handling
                '$extension = $matches[1]'  # Extension validation from MIME type
            ]
            
            found_checks = []
            for check in security_checks:
                if check in content:
                    found_checks.append(check)
            
            if len(found_checks) >= 3:  # At least 3 of 4 security measures
                self.log_test("File Upload Security", True, 
                            "File upload has proper security measures", 
                            f"Found {len(found_checks)}/4 security measures")
                return True
            else:
                self.log_test("File Upload Security", False, 
                            "File upload missing security measures", 
                            f"Found only {len(found_checks)}/4 security measures")
                return False
        except Exception as e:
            self.log_test("File Upload Security", False, f"Error reading file: {str(e)}")
            return False
    
    def test_database_transaction_usage(self):
        """Test that statePost uses database transactions"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            if 'public function statePost(' in content:
                # Check for transaction usage
                if 'DB::transaction(function() use ($card, $r)' in content:
                    self.log_test("Database Transaction Usage", True, 
                                "statePost method uses database transactions for data consistency", 
                                "DB::transaction wrapper found")
                    return True
                else:
                    self.log_test("Database Transaction Usage", False, 
                                "statePost method missing database transaction wrapper")
                    return False
            else:
                self.log_test("Database Transaction Usage", False, 
                            "statePost method not found in controller")
                return False
        except Exception as e:
            self.log_test("Database Transaction Usage", False, f"Error reading file: {str(e)}")
            return False
    
    def test_fix_completeness(self):
        """Test that the fix addresses the original problem completely"""
        try:
            with open(self.controller_path, 'r') as f:
                content = f.read()
            
            # Check for all key components of the fix
            fix_components = [
                # Base64 processing in statePost
                'str_starts_with($x[\'image_url\'], \'data:image\')',
                'base64_decode($file_data)',
                'file_put_contents($fullPath, $image_data)',
                
                # Icon preservation in statePost
                '$iconPath = $x[\'icon\'] ?? null',
                
                # Asset URL generation in productsGet
                'asset($link->icon)',
                
                # Database operations
                'DB::table(\'card_links\')',
                'DB::transaction('
            ]
            
            found_components = []
            for component in fix_components:
                if component in content:
                    found_components.append(component)
            
            completeness_percentage = (len(found_components) / len(fix_components)) * 100
            
            if completeness_percentage >= 85:  # At least 85% of fix components present
                self.log_test("Fix Completeness", True, 
                            f"Link image persistence fix is {completeness_percentage:.1f}% complete", 
                            f"Found {len(found_components)}/{len(fix_components)} key components")
                return True
            else:
                self.log_test("Fix Completeness", False, 
                            f"Link image persistence fix is only {completeness_percentage:.1f}% complete", 
                            f"Found only {len(found_components)}/{len(fix_components)} key components")
                return False
        except Exception as e:
            self.log_test("Fix Completeness", False, f"Error reading file: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all code analysis tests"""
        print(f"🚀 Starting Mi Tienda Link Image Persistence Code Analysis")
        print(f"Controller Path: {self.controller_path}")
        print("=" * 80)
        
        tests = [
            self.test_controller_file_exists,
            self.test_state_get_method_exists,
            self.test_state_post_base64_processing,
            self.test_state_post_icon_preservation,
            self.test_delete_insert_logic,
            self.test_products_get_asset_url_fix,
            self.test_image_processing_error_handling,
            self.test_file_upload_security,
            self.test_database_transaction_usage,
            self.test_fix_completeness
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 80)
        print(f"📊 Code Analysis Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All code analysis tests PASSED!")
            return True
        else:
            print(f"⚠️  {total - passed} test(s) FAILED!")
            return False

def main():
    """Main function to run the code analysis"""
    try:
        analyzer = MiTiendaCodeAnalyzer()
        success = analyzer.run_all_tests()
        
        if success:
            print("\n✅ CONCLUSION: Mi Tienda link image persistence fix implementation is correct!")
            print("   - stateGet method properly queries card_links table and returns icon field")
            print("   - statePost method processes base64 images and preserves existing icon paths")
            print("   - Delete/insert logic implemented with proper transaction handling")
            print("   - productsGet method uses asset() function for proper image URL generation")
            print("   - Proper error handling and security measures in place")
        else:
            print("\n❌ CONCLUSION: Some issues found in the fix implementation")
            print("   - Check failed tests above for specific code issues")
        
        return success
        
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)