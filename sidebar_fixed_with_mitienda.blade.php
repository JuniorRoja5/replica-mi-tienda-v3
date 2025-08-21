@php
    use Illuminate\Support\Facades\DB;
    use App\User;
    use App\Plan;
    use App\BusinessCard;
    use Carbon\Carbon;

    // Queries
    $config = DB::table('config')->get();

    // Card details
    $business_card = BusinessCard::where('card_id', Request::segment(3))->first();

    // Fetch the user plan
    $plan = User::where('user_id', Auth::user()->user_id)->first();
    $active_plan = json_decode($plan->plan_details, true);

    if ($active_plan) {
        // Fetch the default plan details only once if necessary
        if (
            !$active_plan ||
            !isset($active_plan['appointment']) ||
            !isset($active_plan['custom_domain']) ||
            !isset($active_plan['nfc_card']) ||
            !isset($active_plan['storage'])
        ) {
            $planDefaults = Plan::where('plan_id', $plan->plan_id)->first();
        }

        // Check and assign missing plan details
        $active_plan['appointment'] = $active_plan['appointment'] ?? $planDefaults->appointment;
        $active_plan['custom_domain'] = $active_plan['custom_domain'] ?? $planDefaults->appointment;
        $active_plan['nfc_card'] = $active_plan['nfc_card'] ?? $planDefaults->nfc_card;
        $active_plan['storage'] = $active_plan['storage'] ?? $planDefaults->storage;

        // Update plan details if necessary
        if ($active_plan !== json_decode($plan->plan_details, true)) {
            $plan->plan_details = json_encode($active_plan);
            $plan->updated_at = Carbon::now();
            $plan->save();
        }

        // Fetch the updated plan details
        $active_plan = json_decode($plan->plan_details, true);
    }
@endphp

<!-- Sidebar -->
<aside class="navbar navbar-vertical navbar-expand-lg d-print-none bg-body-tertiary">
    <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu"
            aria-controls="sidebar-menu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-brand navbar-brand-autodark">
            <a href="{{ route('user.mitienda.dashboard') }}">
                @if (file_exists(public_path('img/logo-light.png')))
                    <img src="{{ optional(Auth::user())->choosed_theme == 'light' ? asset($settings->site_logo) : asset('img/logo-light.png') }}" width="200" height="50"
                        alt="{{ $settings->site_name }}" class="navbar-brand-image custom-logo">
                @else
                    <img src="{{ $settings->site_logo }}" width="200" height="50" alt="{{ $settings->site_name }}"
                        class="navbar-brand-image custom-logo">
                @endif
            </a>
        </div>
        <div class="navbar-nav flex-row d-lg-none align-items-center">
            {{-- Light / Dark Mode --}}
            <a href="{{ route('user.change.theme', 'dark') }}" class="hide-theme-dark border rounded-3 p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-moon icon-primary">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                </svg>
            </a>
            <a href="{{ route('user.change.theme', 'light') }}"
                class="hide-theme-light border rounded-3 p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-sun icon-primary">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                    <path
                        d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
                </svg>
            </a>
        </div>
        <div class="collapse navbar-collapse" id="sidebar-menu">
            <ul class="navbar-nav m-0 ml-lg-auto p-3 p-lg-0 overflow-y-auto bg-body-tertiary" style="z-index: 9999999 !important;">
                <li class="d-inline d-lg-none">
                    <button class="navbar-toggler float-right" type="button" data-bs-toggle="collapse"
                        data-bs-target="#sidebar-menu" aria-controls="sidebar-menu" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </li>
                <li class="nav-item {{ request()->is('user/dashboard') || request()->is('user/mi-tienda/dashboard') ? 'active' : '' }}">
                    <a class="nav-link" href="{{ route('user.mitienda.dashboard') }}">
                        <span class="nav-link-icon d-md-none d-lg-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <polyline points="5 12 3 12 12 3 21 12 19 12" />
                                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                            </svg>
                        </span>
                        <span class="nav-link-title">
                            {{ __('Dashboard') }}
                        </span>
                    </a>
                </li>
                {{-- Check type --}}
                @if ($active_plan)
                    @if ($active_plan['plan_type'] == 'VCARD')
                        {{-- Mi Tienda Integration --}}
                        <li class="nav-item {{ request()->is('user/mi-tienda') || request()->is('user/mi-tienda/*') ? 'active' : '' }}">
                            <a class="nav-link" href="{{ route('user.mitienda') }}">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-shopping-bag"
                                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"></path>
                                        <path d="M9 11v-5a3 3 0 0 1 6 0v5"></path>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Mi Tienda') }}
                                </span>
                            </a>
                        </li>

                        {{-- Mi Tienda Sub-sections --}}
                        <li class="nav-item {{ request()->is('user/mi-tienda/ingresos') ? 'active' : '' }}">
                            <a class="nav-link" href="{{ route('user.mitienda.ingresos') }}">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-coin"
                                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"></path>
                                        <path d="M12 7v10"></path>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Ingresos') }}
                                </span>
                            </a>
                        </li>

                        <li class="nav-item {{ request()->is('user/mi-tienda/diseno') ? 'active' : '' }}">
                            <a class="nav-link" href="{{ route('user.mitienda.diseno') }}">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-palette"
                                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M12 21a9 9 0 0 1 0 -18c5 0 9 4 9 9a4.5 4.5 0 0 1 -4.5 4.5h-2.5a2 2 0 0 0 -2 2a1.5 1.5 0 0 1 -3 0"></path>
                                        <path d="M9.5 11.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                        <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                        <path d="M16.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Diseño') }}
                                </span>
                            </a>
                        </li>

                        <li class="nav-item {{ request()->is('user/mi-tienda/customers') ? 'active' : '' }}">
                            <a class="nav-link" href="{{ route('user.mitienda.customers') }}">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users"
                                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Clientes') }}
                                </span>
                            </a>
                        </li>

                        <li class="nav-item {{ request()->is('user/mi-tienda/statistics') ? 'active' : '' }}">
                            <a class="nav-link" href="{{ route('user.mitienda.statistics') }}">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chart-bar"
                                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <rect x="3" y="12" width="6" height="8" rx="1"></rect>
                                        <rect x="9" y="8" width="6" height="12" rx="1"></rect>
                                        <rect x="15" y="4" width="6" height="16" rx="1"></rect>
                                        <rect x="4" y="20" width="14" height="0"></rect>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Estadísticas') }}
                                </span>
                            </a>
                        </li>
                    @endif

                    @if ($active_plan['plan_type'] == 'STORE')
                        <li class="nav-item {{ request()->is('user/stores*') || request()->is('user/categories*') ? 'active' : '' }}">
                            <a class="nav-link" href="{{ route('user.stores') }}">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-id"
                                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <rect x="3" y="4" width="18" height="16" rx="3"></rect>
                                        <circle cx="9" cy="10" r="2"></circle>
                                        <line x1="15" y1="8" x2="17" y2="8"></line>
                                        <line x1="15" y1="12" x2="17" y2="12"></line>
                                        <line x1="7" y1="16" x2="17" y2="16"></line>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Stores') }}
                                </span>
                            </a>
                        </li>
                    @endif

                    @if ($active_plan['plan_type'] == 'BOTH')
                        {{-- Mi Tienda Integration for BOTH plans --}}
                        <li class="nav-item {{ request()->is('user/mi-tienda') || request()->is('user/mi-tienda/*') ? 'active' : '' }}">
                            <a class="nav-link" href="{{ route('user.mitienda') }}">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-shopping-bag"
                                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"></path>
                                        <path d="M9 11v-5a3 3 0 0 1 6 0v5"></path>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Mi Tienda') }}
                                </span>
                            </a>
                        </li>

                        <li class="nav-item {{ request()->is('user/stores*') || request()->is('user/store*') || request()->is('user/categories*') ? 'active' : '' }}">
                            <a class="nav-link" href="{{ route('user.stores') }}">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-building-store" width="24"
                                        height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                        fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M3 21l18 0"></path>
                                        <path
                                            d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4">
                                        </path>
                                        <path d="M5 21l0 -10.15"></path>
                                        <path d="M19 21l0 -10.15"></path>
                                        <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4"></path>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Stores') }}
                                </span>
                            </a>
                        </li>
                    @endif
                @endif

                {{-- Order NFC Card --}}
                @if ($config[76]->config_value == '1')
                    @if ($active_plan)
                        @if (isset($active_plan['nfc_card']) && $active_plan['nfc_card'])
                            <li class="nav-item {{ request()->is('user/nfc-cards/order') || request()->is('user/nfc-cards/checkout') || request()->is('user/nfc-cards/checkout*') ? 'active' : '' }}">
                                <a class="nav-link" href="{{ route('user.order.nfc.cards') }}">
                                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="icon icon-tabler icons-tabler-outline icon-tabler-nfc">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M11 20a3 3 0 0 1 -3 -3v-11l5 5" />
                                            <path d="M13 4a3 3 0 0 1 3 3v11l-5 -5" />
                                            <path
                                                d="M4 4m0 3a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3z" />
                                        </svg>
                                    </span>
                                    <span class="nav-link-title">
                                        {{ __('Order NFC Card') }}
                                    </span>
                                </a>
                            </li>

                            {{-- My Orders --}}
                            <li
                                class="nav-item {{ request()->is('user/orders') || request()->is('user/order*') ? 'active' : '' }}">
                                <a class="nav-link" href="{{ route('user.manage.nfc.orders') }}">
                                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                            <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                            <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
                                            <path d="M3 9l4 0" />
                                        </svg>
                                    </span>
                                    <span class="nav-link-title">
                                        {{ __('My Orders') }}
                                    </span>
                                </a>
                            </li>

                            {{-- My NFC Cards --}}
                            <li
                                class="nav-item {{ request()->is('user/manage-nfc-cards') || request()->is('user/link-nfc-card*') || request()->is('user/activate-nfc-card') ? 'active' : '' }}">
                                <a class="nav-link" href="{{ route('user.manage.nfc.cards') }}">
                                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="icon icon-tabler icons-tabler-outline icon-tabler-credit-card-pay">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path
                                                d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
                                            <path d="M3 10h18" />
                                            <path d="M16 19h6" />
                                            <path d="M19 16l3 3l-3 3" />
                                            <path d="M7.005 15h.005" />
                                            <path d="M11 15h2" />
                                        </svg>
                                    </span>
                                    <span class="nav-link-title">
                                        {{ __('My NFC Cards') }}
                                    </span>
                                </a>
                            </li>
                        @endif
                    @endif
                @endif

                {{-- Referral --}}
                @if ($config[80]->config_value == '1')
                    <li class="nav-item dropdown {{ request()->is('user/referrals*') ? 'active' : '' }}">
                        <a class="nav-link dropdown-toggle" href="#navbar-help" data-bs-toggle="dropdown"
                            data-bs-auto-close="outside" role="button" aria-expanded="false">
                            <span class="nav-link-icon d-md-none d-lg-inline-block">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-link"
                                    width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                    stroke="currentColor" fill="none" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M9 15l6 -6"></path>
                                    <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path>
                                    <path
                                        d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463">
                                    </path>
                                </svg>
                            </span>
                            <span class="nav-link-title">
                                {{ __('Referral') }}
                            </span>
                        </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="{{ route('user.referrals') }}">
                                {{ __('Referrals') }}
                            </a>
                            <a class="dropdown-item" href="{{ route('user.referrals.withdrawal.request') }}">
                                {{ __('Withdrawal Request') }}
                            </a>
                        </div>
                    </li>
                @endif

                {{-- Media Library --}}
                <li class="nav-item {{ request()->is('user/media') ? 'active' : '' }}">
                    <a class="nav-link" href="{{ route('user.media') }}">
                        <span class="nav-link-icon d-md-none d-lg-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-photo"
                                width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <line x1="15" y1="8" x2="15.01" y2="8"></line>
                                <rect x="4" y="4" width="16" height="16" rx="3"></rect>
                                <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
                                <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
                            </svg>
                        </span>
                        <span class="nav-link-title">
                            {{ __('Media') }}
                        </span>
                    </a>
                </li>

                {{-- Plans --}}
                <li class="nav-item {{ request()->is('user/plans') || request()->is('user/checkout*') ? 'active' : '' }}">
                    <a class="nav-link" href="{{ route('user.plans') }}">
                        <span class="nav-link-icon d-md-none d-lg-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-id"
                                width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <rect x="3" y="4" width="18" height="16" rx="3"></rect>
                                <circle cx="9" cy="10" r="2"></circle>
                                <line x1="15" y1="8" x2="17" y2="8"></line>
                                <line x1="15" y1="12" x2="17" y2="12"></line>
                                <line x1="7" y1="16" x2="17" y2="16"></line>
                            </svg>
                        </span>
                        <span class="nav-link-title">
                            {{ __('Plans') }}
                        </span>
                    </a>
                </li>

                {{-- Transactions --}}
                <li class="nav-item dropdown {{ request()->is('user/transactions*') || request()->is('user/nfc-cards/transactions') || request()->is('user/nfc-cards/transaction/invoice*') || request()->is('user/view-invoice*') ? 'active' : '' }}">
                    <a class="nav-link dropdown-toggle" href="#navbar-help" data-bs-toggle="dropdown"
                        data-bs-auto-close="outside" role="button" aria-expanded="false">
                        <span class="nav-link-icon d-md-none d-lg-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                                <rect x="9" y="3" width="6" height="4" rx="2" />
                                <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
                                <path d="M12 17v1m0 -8v1" />
                            </svg>
                        </span>
                        <span class="nav-link-title">
                            {{ __('Transactions') }}
                        </span>
                    </a>
                    <div class="dropdown-menu">
                        {{-- NFC Card Transactions --}}
                        @if ($config[76]->config_value == '1')
                            @if ($active_plan)
                                @if (isset($active_plan['nfc_card']) && $active_plan['nfc_card'])
                                    <a class="dropdown-item" href="{{ route('user.transaction.nfc.cards') }}">
                                        {{ __('NFC Card') }}
                                    </a>
                                @endif
                            @endif
                        @endif
                        <a class="dropdown-item" href="{{ route('user.transactions') }}">
                            {{ __('Plan') }}
                        </a>
                    </div>
                </li>

                {{-- Additional Tools --}}
                @if ($active_plan)
                    @if (isset($active_plan['additional_tools']) && $active_plan['additional_tools'] == 1)
                        <li class="nav-item dropdown {{ request()->is('user/tools*') ? 'active' : '' }}">
                            <a class="nav-link dropdown-toggle" href="#navbar-help" data-bs-toggle="dropdown"
                                data-bs-auto-close="outside" role="button" aria-expanded="false">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-tools"
                                        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
                                        stroke="currentColor" fill="none" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4"></path>
                                        <line x1="14.5" y1="5.5" x2="18.5" y2="9.5"></line>
                                        <polyline points="12 8 7 3 3 7 8 12"></polyline>
                                        <line x1="7" y1="8" x2="5.5" y2="9.5"></line>
                                        <polyline points="16 12 21 17 17 21 12 16"></polyline>
                                        <line x1="16" y1="17" x2="14.5" y2="18.5"></line>
                                    </svg>
                                </span>
                                <span class="nav-link-title">
                                    {{ __('Addtional Tools') }}
                                </span>
                            </a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="{{ route('user.qr-maker') }}">
                                    {{ __('QR Maker') }}
                                </a>
                                <a class="dropdown-item" href="{{ route('user.whois-lookup') }}">
                                    {{ __('Whois Lookup') }}
                                </a>
                                <a class="dropdown-item" href="{{ route('user.dns-lookup') }}">
                                    {{ __('DNS Lookup') }}
                                </a>
                                <a class="dropdown-item" href="{{ route('user.ip-lookup') }}">
                                    {{ __('IP Lookup') }}
                                </a>
                            </div>
                        </li>
                    @endif
                @endif

                {{-- My Account --}}
                <li class="nav-item {{ request()->is('user/account') ? 'active' : '' }}">
                    <a class="nav-link" href="{{ route('user.account') }}">
                        <span class="nav-link-icon d-md-none d-lg-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                            </svg>
                        </span>
                        <span class="nav-link-title">
                            {{ __('My Account') }}
                        </span>
                    </a>
                </li>

                {{-- Logout --}}
                <li class="nav-item">
                    <a href="{{ route('logout') }}" class="nav-link"
                        onclick="event.preventDefault(); document.getElementById('logout-form').submit();"><span
                            class="nav-link-icon d-md-none d-lg-inline-block"><svg xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="icon icon-tabler icons-tabler-outline icon-tabler-logout-2">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
                                <path d="M15 12h-12l3 -3" />
                                <path d="M6 15l-3 -3" />
                            </svg>
                        </span>
                        <span class="nav-link-title">
                            {{ __('Logout') }}
                        </span></a>
                    <form class="logout" id="logout-form" action="{{ route('logout') }}" method="POST">
                        @csrf
                    </form>
                </li>
            </ul>
        </div>
    </div>
</aside>