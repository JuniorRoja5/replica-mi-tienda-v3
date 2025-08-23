<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Mi Tienda</title>
</head>
<body style="margin:0;padding:0">
    <iframe
        id="mitienda-iframe"
        src="{{ asset('mi-tienda/mi-tienda.html') }}?timestamp={{ time() }}&csrf={{ csrf_token() }}&user_id={{ Auth::id() }}&user_name={{ urlencode(Auth::user()->name ?? '') }}&user_email={{ urlencode(Auth::user()->email ?? '') }}"
        style="width:100vw;height:100vh;border:0"
        referrerpolicy="no-referrer">
    </iframe>
    
    <script>
        console.log('✅ Laravel data sent via URL parameters');
    </script>
</body>
</html>