@php
    $userPlan = auth()->user()->plan_details ? json_decode(auth()->user()->plan_details, true) : null;
    $planType = $userPlan['plan_type'] ?? null;
@endphp

<div class="navbar-nav">
    
    {{-- HOME (antes Dashboard) --}}
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.dashboard') ? 'active' : '' }}" href="{{ route('user.dashboard') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <polyline points="5 12 3 12 12 3 21 12 19 12" />
                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
            </span>
            <span class="nav-link-title">Home</span>
        </a>
    </div>

    {{-- MI TIENDA --}}
    @if($planType == 'BOTH' || $planType == 'VCARD')
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.mi-tienda.*') ? 'active' : '' }}" href="{{ route('user.mi-tienda.index') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 21l18 0" />
                    <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
                    <path d="M5 21l0 -10.15" />
                    <path d="M19 21l0 -10.15" />
                    <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
                </svg>
            </span>
            <span class="nav-link-title">Mi Tienda</span>
        </a>
    </div>
    @endif

    {{-- DISEÑO --}}
    @if($planType == 'BOTH' || $planType == 'VCARD')
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.mi-tienda.diseno') ? 'active' : '' }}" href="{{ route('user.mi-tienda.diseno') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 2l0 6l6 0l-6 -6" />
                    <path d="M13 8l7 0l0 12a1 1 0 0 1 -1 1l-6 0l0 -20" />
                    <path d="M5 8l0 -1c0 -1.1 .9 -2 2 -2h2" />
                    <path d="M5 8l0 13l12 0" />
                    <path d="M15 2l0 6l6 0" />
                </svg>
            </span>
            <span class="nav-link-title">Diseño</span>
        </a>
    </div>
    @endif

    {{-- INGRESOS --}}
    @if($planType == 'BOTH' || $planType == 'VCARD')
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.mi-tienda.ingresos') ? 'active' : '' }}" href="{{ route('user.mi-tienda.ingresos') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                </svg>
            </span>
            <span class="nav-link-title">Ingresos</span>
        </a>
    </div>
    @endif

    {{-- CLIENTES --}}
    @if($planType == 'BOTH' || $planType == 'VCARD')
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.mi-tienda.customers') ? 'active' : '' }}" href="{{ route('user.mi-tienda.customers') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="9" cy="7" r="4" />
                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                </svg>
            </span>
            <span class="nav-link-title">Clientes</span>
        </a>
    </div>
    @endif

    {{-- ESTADÍSTICAS --}}
    @if($planType == 'BOTH' || $planType == 'VCARD')
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.mi-tienda.statistics') ? 'active' : '' }}" href="{{ route('user.mi-tienda.statistics') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 12l6 6l4 -4l8 8" />
                    <path d="M14 4l7 0l0 7" />
                    <path d="M9 4l0 12" />
                    <path d="M15 4l0 8" />
                    <path d="M3 4l0 16" />
                </svg>
            </span>
            <span class="nav-link-title">Estadísticas</span>
        </a>
    </div>
    @endif

    {{-- SEPARADOR --}}
    <div class="hr-text hr-text-left">Cuenta</div>

    {{-- REFERIDOS (ruta real: user.referrals) --}}
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.referrals*') ? 'active' : '' }}" href="{{ route('user.referrals') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="13" cy="12" r="1" />
                    <circle cx="17" cy="12" r="1" />
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                    <path d="M3 12h2m14 0h2" />
                </svg>
            </span>
            <span class="nav-link-title">Referidos</span>
        </a>
    </div>

    {{-- SOLICITUDES DE RETIRO (ruta real: user.referrals.withdrawal.request) --}}
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.referrals.withdrawal.request') ? 'active' : '' }}" href="{{ route('user.referrals.withdrawal.request') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
                    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                    <path d="M13 10l4 0l0 2l-4 0" />
                </svg>
            </span>
            <span class="nav-link-title">Solicitudes de retiro</span>
        </a>
    </div>

    {{-- GALERÍA (ruta real: user.media) --}}
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.media*') ? 'active' : '' }}" href="{{ route('user.media') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <rect x="4" y="4" width="6" height="6" rx="1" />
                    <rect x="14" y="4" width="6" height="6" rx="1" />
                    <rect x="4" y="14" width="6" height="6" rx="1" />
                    <rect x="14" y="14" width="6" height="6" rx="1" />
                </svg>
            </span>
            <span class="nav-link-title">Galería</span>
        </a>
    </div>

    {{-- PLANS (ruta real: user.plans) --}}
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.plans*') ? 'active' : '' }}" href="{{ route('user.plans') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <rect x="3" y="4" width="18" height="4" rx="1" />
                    <rect x="5" y="8" width="14" height="8" rx="1" />
                    <rect x="7" y="16" width="10" height="4" rx="1" />
                </svg>
            </span>
            <span class="nav-link-title">Plans</span>
        </a>
    </div>

    {{-- MI CUENTA (ruta real: user.account) --}}
    <div class="nav-item">
        <a class="nav-link {{ Request::routeIs('user.account') || Request::routeIs('user.settings') ? 'active' : '' }}" href="{{ route('user.account') }}">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="7" r="4" />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
            </span>
            <span class="nav-link-title">Mi cuenta</span>
        </a>
    </div>

    {{-- SEPARADOR --}}
    <div class="hr-text hr-text-left">Sesión</div>

    {{-- CERRAR SESIÓN --}}
    <div class="nav-item">
        <a class="nav-link" href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
            <span class="nav-link-icon d-md-none d-lg-inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                    <path d="M7 12h14l-3 -3m0 6l3 -3" />
                </svg>
            </span>
            <span class="nav-link-title">Cerrar sesión</span>
        </a>
        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
            @csrf
        </form>
    </div>

</div>

{{-- 
ELEMENTOS ELIMINADOS/OCULTOS (que NO aparecen en el sidebar):
✅ Order NFC Card (user.order.nfc.cards)
✅ My Orders (user.manage.nfc.orders)  
✅ My NFC Cards (user.manage.nfc.cards)
✅ Transactions (user.transactions)
✅ Referral como menú padre (separado en Referidos y Solicitudes de retiro)

CAMBIOS IMPLEMENTADOS:
✅ Dashboard → HOME
✅ Media → Galería
✅ My Account → Mi cuenta  
✅ Logout → Cerrar sesión
✅ Referral separado en dos opciones independientes
--}}