@extends('user.layouts.index', ['header'=>true,'nav'=>true,'demo'=>true,'settings'=>$settings])

@section('head')
    <meta name="csrf-token" content="{{ csrf_token() }}">
@endsection

@section('content')
<div class="page-wrapper">
  <div class="page-body">
    <div class="container-fluid" style="padding: 0; max-width: none !important; margin: 0;">
      <iframe
        id="mitienda-iframe"
        src="{{ asset('mi-tienda/mi-tienda.html') }}?timestamp={{ time() }}&csrf={{ csrf_token() }}&user_id={{ Auth::id() }}&user_name={{ urlencode(Auth::user()->name ?? '') }}&user_email={{ urlencode(Auth::user()->email ?? '') }}"
        style="width: 100%; height: calc(100vh - 80px); border: 0; display: block; overflow-x: auto;"
        referrerpolicy="no-referrer"
      ></iframe>
    </div>
  </div>
</div>

<script>
// Simplificado - Los datos van por URL parameters
console.log('✅ Laravel data sent via URL parameters');
</script>

@endsection