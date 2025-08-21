@extends('user.layouts.index', ['header'=>true,'nav'=>true,'demo'=>true,'settings'=>$settings])

@section('content')
<div class="page-wrapper">
  <div class="page-header d-print-none">
    <div class="container-fluid">
      <h2 class="page-title">{{ __('Mi Tienda') }} - {{ $pageTitle }}</h2>
    </div>
  </div>

  <div class="page-body">
    <div class="container-fluid">
      <div class="card shadow-sm">
        <div class="card-header d-flex align-items-center justify-content-between">
          <h5 class="mb-0">{{ $pageTitle }}</h5>
          <div class="btn-group">
            <a href="{{ route('user.mitienda') }}" class="btn btn-sm btn-outline-primary">{{ __('Mi Tienda') }}</a>
            <a href="{{ route('user.mitienda.dashboard') }}" class="btn btn-sm btn-outline-secondary">{{ __('Dashboard') }}</a>
            <a href="{{ route('user.mitienda.ingresos') }}" class="btn btn-sm btn-outline-secondary">{{ __('Ingresos') }}</a>
            <a href="{{ route('user.mitienda.diseno') }}" class="btn btn-sm btn-outline-secondary">{{ __('Diseño') }}</a>
            <a href="{{ route('user.mitienda.customers') }}" class="btn btn-sm btn-outline-secondary">{{ __('Clientes') }}</a>
            <a href="{{ route('user.mitienda.statistics') }}" class="btn btn-sm btn-outline-secondary">{{ __('Estadísticas') }}</a>
          </div>
        </div>
        <div class="card-body p-0" style="height: calc(100vh - 320px);">
          <iframe
            id="miTiendaFrame"
            src="{{ asset('mi-tienda/'.$htmlFile) }}"
            style="width:100%;height:100%;border:0;"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection