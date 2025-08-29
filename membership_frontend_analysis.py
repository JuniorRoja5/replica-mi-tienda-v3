#!/usr/bin/env python3
"""
Membership Frontend Integration Analysis
Analyzes the JavaScript implementation to identify missing functions and integration issues
"""

import os
import re

def analyze_membership_frontend():
    """Analyze the membership frontend integration"""
    
    js_file_path = "/app/temp_laravel_repo/public/mi-tienda/js/mi-tienda.js"
    
    if not os.path.exists(js_file_path):
        print(f"❌ JavaScript file not found: {js_file_path}")
        return False
    
    print("🔍 ANALYZING MEMBERSHIP FRONTEND INTEGRATION")
    print("=" * 60)
    
    with open(js_file_path, 'r') as f:
        js_content = f.read()
    
    # Check for required functions according to test_result.md
    required_functions = [
        'createMembership',
        'saveMembershipAsDraft', 
        'updateExistingMembership',
        'editMembership'
    ]
    
    function_analysis = {}
    
    for func_name in required_functions:
        # Check if function is defined
        function_pattern = rf'function\s+{func_name}\s*\('
        async_function_pattern = rf'async\s+function\s+{func_name}\s*\('
        
        if re.search(function_pattern, js_content) or re.search(async_function_pattern, js_content):
            function_analysis[func_name] = {
                'defined': True,
                'uses_api': 'fetch(' in js_content or 'axios(' in js_content or '$.ajax(' in js_content,
                'uses_localstorage': 'localStorage' in js_content
            }
        else:
            function_analysis[func_name] = {
                'defined': False,
                'uses_api': False,
                'uses_localstorage': False
            }
    
    # Check editProduct function for membership case
    editproduct_pattern = r'function\s+editProduct\s*\([^)]*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}'
    editproduct_match = re.search(editproduct_pattern, js_content, re.DOTALL)
    
    has_membership_case = False
    if editproduct_match:
        editproduct_body = editproduct_match.group(1)
        has_membership_case = 'membership' in editproduct_body.lower()
    
    # Check for API integration patterns
    api_patterns = {
        'fetch_usage': len(re.findall(r'fetch\s*\(', js_content)),
        'axios_usage': len(re.findall(r'axios\s*\(', js_content)),
        'jquery_ajax': len(re.findall(r'\$\.ajax\s*\(', js_content)),
        'laravel_api_calls': len(re.findall(r'/user/api/mi-tienda/products', js_content))
    }
    
    # Print analysis results
    print("📋 FUNCTION ANALYSIS:")
    for func_name, analysis in function_analysis.items():
        status = "✅ DEFINED" if analysis['defined'] else "❌ MISSING"
        print(f"  {status}: {func_name}")
        if analysis['defined']:
            api_status = "✅ Uses API" if analysis['uses_api'] else "❌ Uses localStorage"
            print(f"    Integration: {api_status}")
    
    print(f"\n📋 EDITPRODUCT FUNCTION:")
    editproduct_status = "✅ HANDLES MEMBERSHIP" if has_membership_case else "❌ MISSING MEMBERSHIP CASE"
    print(f"  {editproduct_status}")
    
    print(f"\n📋 API INTEGRATION PATTERNS:")
    print(f"  Fetch calls: {api_patterns['fetch_usage']}")
    print(f"  Axios calls: {api_patterns['axios_usage']}")
    print(f"  jQuery AJAX: {api_patterns['jquery_ajax']}")
    print(f"  Laravel API calls: {api_patterns['laravel_api_calls']}")
    
    # Check specific createMembership implementation
    createmembership_pattern = r'function\s+createMembership\s*\([^)]*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}'
    createmembership_match = re.search(createmembership_pattern, js_content, re.DOTALL)
    
    if createmembership_match:
        createmembership_body = createmembership_match.group(1)
        uses_localstorage = 'localStorage' in createmembership_body or 'saveToStorage' in createmembership_body
        uses_api = 'fetch(' in createmembership_body or '/api/' in createmembership_body
        
        print(f"\n📋 CREATEMEMBERSHIP IMPLEMENTATION:")
        if uses_api:
            print(f"  ✅ Uses Laravel API integration")
        elif uses_localstorage:
            print(f"  ❌ Still uses localStorage (needs API migration)")
        else:
            print(f"  ❓ Implementation unclear")
    
    # Summary
    defined_functions = sum(1 for analysis in function_analysis.values() if analysis['defined'])
    total_functions = len(required_functions)
    
    print(f"\n📊 SUMMARY:")
    print(f"  Functions defined: {defined_functions}/{total_functions}")
    print(f"  EditProduct handles membership: {'Yes' if has_membership_case else 'No'}")
    print(f"  API integration level: {'High' if api_patterns['laravel_api_calls'] > 0 else 'Low'}")
    
    # Determine overall status
    if defined_functions == total_functions and has_membership_case and api_patterns['laravel_api_calls'] > 0:
        print(f"  ✅ FRONTEND INTEGRATION: COMPLETE")
        return True
    elif defined_functions >= total_functions * 0.5:
        print(f"  ⚠️  FRONTEND INTEGRATION: PARTIAL")
        return False
    else:
        print(f"  ❌ FRONTEND INTEGRATION: INCOMPLETE")
        return False

if __name__ == "__main__":
    analyze_membership_frontend()