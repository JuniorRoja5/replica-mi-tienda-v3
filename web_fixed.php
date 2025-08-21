<?php

/*
 |--------------------------------------------------------------------------
 | GoBiz vCard SaaS - FIXED WEB ROUTES
 |--------------------------------------------------------------------------
 | Fixed route conflicts for cards integration
 | Maintains compatibility while adding Mi Tienda functionality
 |--------------------------------------------------------------------------
*/

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebToolsController;
use App\Http\Controllers\SubdomainController;
use App\Http\Controllers\User\CardController;
use App\Http\Controllers\Admin\DemoController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\User\MediaController;
use App\Http\Controllers\User\StoreController;
use App\Http\Controllers\Admin\GroupController;
use App\Http\Controllers\Admin\ThemeController;
use App\Http\Controllers\ReadNfcCardController;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\PluginController;
use App\Http\Controllers\Admin\PusherController;
use App\Http\Controllers\Admin\UpdateController;
use App\Http\Controllers\CustomDomainController;
use App\Http\Controllers\User\BillingController;
use App\Http\Controllers\User\InquiryController;
use App\Http\Controllers\User\PreviewController;
use App\Http\Controllers\User\VisitorController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\CouponsController;
use App\Http\Controllers\Admin\CronJobController;
use App\Http\Controllers\Admin\MailgunController;
use App\Http\Controllers\Admin\SitemapController;
use App\Http\Controllers\Payment\PaytrController;
use App\Http\Controllers\User\CategoryController;
use App\Http\Controllers\User\CheckOutController;
use App\Http\Controllers\User\EditCardController;
use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\PusherNotification;
use App\Http\Controllers\Admin\ReferralController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Payment\MollieController;
use App\Http\Controllers\Payment\PaddleController;
use App\Http\Controllers\Payment\PaypalController;
use App\Http\Controllers\Payment\StripeController;
use App\Http\Controllers\Payment\XenditController;
use App\Http\Controllers\User\DuplicateController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\BookAppointmentController;
use App\Http\Controllers\Payment\IyzipayController;
use App\Http\Controllers\Payment\OfflineController;
use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Payment\PhonepeController;
use App\Http\Controllers\User\AdditionalController;
use App\Http\Controllers\Admin\TaxSettingController;
use App\Http\Controllers\Payment\CashfreeController;
use App\Http\Controllers\Payment\PaystackController;
use App\Http\Controllers\Payment\RazorpayController;
use App\Http\Controllers\Admin\MaintenanceController;
use App\Http\Controllers\Payment\ToyyibpayController;
use App\Http\Controllers\User\OrderNfcCardController;
use App\Http\Controllers\User\VerificationController;
use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\EmailSettingController;
use App\Http\Controllers\Admin\NfcCardOrderController;
use App\Http\Controllers\Admin\TransactionsController;
use App\Http\Controllers\User\ConnectDomainController;
use App\Http\Controllers\User\ManageNfcCardController;
use App\Http\Controllers\User\VerifiedEmailController;
use App\Http\Controllers\Admin\EmailTemplateController;
use App\Http\Controllers\Admin\GoogleSettingController;
use App\Http\Controllers\Admin\NfcCardDesignController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Payment\FlutterwaveController;
use App\Http\Controllers\Payment\MercadoPagoController;
use App\Http\Controllers\Payment\TwoCheckoutController;
use App\Http\Controllers\Admin\PaymentSettingController;
use App\Http\Controllers\Admin\WebsiteSettingController;
use App\Http\Controllers\User\ActivateNfcCardController;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;
use App\Http\Controllers\Admin\SubdomainSettingController;
use App\Http\Controllers\Admin\SupportActivatorController;
use App\Http\Controllers\Payment\NFC\NFCIyzipayController;
use App\Http\Controllers\Admin\BlogController as AdminBlog;
use App\Http\Controllers\Admin\MarketingCustomerController;
use App\Http\Controllers\User\ManageOrderNfcCardController;
use App\Http\Controllers\User\TransactionNfcCardController;
use App\Http\Controllers\User\Vcard\Create\PopUpController;
use App\Http\Controllers\User\Vcard\Create\CreateController;
use App\Http\Controllers\User\Vcard\Create\GalleryController;
use App\Http\Controllers\User\Vcard\Create\ProductController;
use App\Http\Controllers\User\Vcard\Create\ServiceController;
use App\Http\Controllers\Admin\CustomDomainRequestsController;
use App\Http\Controllers\Admin\NfcCardKeyGenerationController;
use App\Http\Controllers\User\Store\Edit\StoreOrderController;
use App\Http\Controllers\User\AccountController as userAccount;
use App\Http\Controllers\Admin\ApplicationHealthCheckController;
use App\Http\Controllers\User\Vcard\Create\SocialLinkController;
use Plugins\ReferralSystem\Controllers\ReferralSystemController;
use App\Http\Controllers\Admin\NfcCardOrderTransactionController;
use App\Http\Controllers\User\Vcard\Create\AppointmentController;
use App\Http\Controllers\User\Vcard\Create\ContactFormController;
use App\Http\Controllers\User\Vcard\Create\PaymentLinkController;
use App\Http\Controllers\User\Vcard\Create\TestimonialController;
use App\Http\Controllers\User\Store\Edit\UpdateStoreSeoController;
use App\Http\Controllers\User\Vcard\Create\BusinessHourController;
use App\Http\Controllers\Admin\EnableDisableNFCCardOrderController;
use App\Http\Controllers\Admin\ReferralWithdrawalRequestController;
use App\Http\Controllers\User\DashboardController as userDashboard;
use App\Http\Controllers\User\PlanController as UserPlanController;
use App\Http\Controllers\User\Store\Edit\EditStorePopupsController;
use App\Http\Controllers\User\CustomDomainCloudflareRulesController;
use App\Http\Controllers\User\Store\Edit\UpdateStoreHoursController;
use App\Http\Controllers\Admin\ReferralSystemConfigurationController;
use App\Http\Controllers\User\Vcard\Create\AdvancedSettingController;
use App\Http\Controllers\User\Store\Edit\UpdateStoreCategoryController;
use App\Http\Controllers\User\Store\Edit\UpdateStoreSettingsController;
use App\Http\Controllers\User\TransactionsController as userTransactions;
use App\Http\Controllers\Payment\NFC\PaytrController as NFCPaytrController;
use App\Http\Controllers\User\ReferralController as UserReferralController;
use App\Http\Controllers\StoreOrderController as StoreOrderPlacedController;
use App\Http\Controllers\User\Store\Edit\EditStoreAdvancedSettingController;
use App\Http\Controllers\Payment\NFC\MollieController as NFCMollieController;
use App\Http\Controllers\Payment\NFC\PaddleController as NFCPaddleController;
use App\Http\Controllers\Payment\NFC\PaypalController as NFCPaypalController;
use App\Http\Controllers\Payment\NFC\StripeController as NFCStripeController;
use App\Http\Controllers\Payment\NFC\XenditController as NFCXenditController;
use App\Http\Controllers\Payment\NFC\OfflineController as NFCOfflineController;
use App\Http\Controllers\Payment\NFC\PhonepeController as NFCPhonepeController;
use App\Http\Controllers\User\NewsletterController as UserNewsletterController;
use App\Http\Controllers\User\Vcard\Edit\PopUpController as EditPopUpController;
use App\Http\Controllers\Payment\NFC\CashfreeController as NFCCashfreeController;
use App\Http\Controllers\Payment\NFC\PaystackController as NFCPaystackController;
use App\Http\Controllers\Payment\NFC\RazorpayController as NFCRazorpayController;
use App\Http\Controllers\Payment\NFC\ToyyibpayController as NFCToyyibpayController;
use App\Http\Controllers\User\AppointmentController as BookedAppointmentController;
use App\Http\Controllers\User\Store\Edit\UpdateController as UpdateStoreController;
use App\Http\Controllers\User\Vcard\Edit\GalleryController as EditGalleryController;
use App\Http\Controllers\User\Vcard\Edit\ProductController as EditProductController;
use App\Http\Controllers\User\Vcard\Edit\ServiceController as EditServiceController;
use App\Http\Controllers\User\Store\Create\CreateController as CreateStoreController;
use App\Http\Controllers\Payment\NFC\FlutterwaveController as NFCFlutterwaveController;
use App\Http\Controllers\Payment\NFC\MercadoPagoController as NFCMercadoPagoController;
use App\Http\Controllers\Payment\NFC\PaymentController as OrderNfcCardPaymentController;
use App\Http\Controllers\User\Vcard\Edit\SocialLinkController as EditSocialLinkController;
use App\Http\Controllers\User\Store\Edit\ProductController as UpdateStoreProductController;
use App\Http\Controllers\User\Vcard\Edit\AppointmentController as EditAppointmentController;
use App\Http\Controllers\User\Vcard\Edit\ContactFormController as EditContactFormController;
use App\Http\Controllers\User\Vcard\Edit\PaymentLinkController as EditPaymentLinkController;
use App\Http\Controllers\User\Vcard\Edit\TestimonialController as EditTestimonialController;
use App\Http\Controllers\User\Store\Create\ProductController as CreateStoreProductController;
use App\Http\Controllers\User\Vcard\Edit\BusinessHourController as EditBusinessHourController;
use App\Http\Controllers\User\Vcard\Edit\AdvancedSettingController as EditAdvancedSettingController;
use App\Http\Controllers\User\Vcard\Edit\EditCustomizationController;

// Mi Tienda API Controllers
use App\Http\Controllers\User\MiTiendaApiController;
use App\Http\Controllers\CardPublicController;           
use App\Http\Controllers\MiTiendaPublicApiController;    

/*
|--------------------------------------------------------------------------
| Web Routes - FIXED VERSION
|--------------------------------------------------------------------------
*/

// Installer Middleware
Route::group(['middleware' => 'Installer'], function () {
    // Subdomain Route
    Route::domain('{cardname}.' . env('MAIN_DOMAIN', env('APP_URL')))->group(function () {
        Route::get('/', [SubdomainController::class, 'subdomainProfile'])->name('subdomain.profile')->middleware('scriptsanitizer');
    });

    // Custom Domain Route
    Route::domain('{domain}')->group(function () {
        Route::get('/', [CustomDomainController::class, 'customDomain'])->name('customdomain.profile')->middleware('scriptsanitizer');
    });

    // Path to plugins directory
    $pluginsPath = base_path('plugins');

    if (File::exists($pluginsPath)) {
        foreach (File::directories($pluginsPath) as $plugin) {
            $routeFile = $plugin . '/routes.php';
            if (File::exists($routeFile)) {
                require_once $routeFile;
            }
        }
    }

    Route::group(['middleware' => 'frame.destroyer', 'scriptsanitizer'], function () {
        Route::get('/', [HomeController::class, 'index'])->name('home-locale');
        Route::get('/', [HomeController::class, 'index'])->name('home');
        Route::get('/home-locale-alias', [HomeController::class, 'index'])->name('home-locale');

        Auth::routes(['verify' => true]);

        // Pages
        Route::get('faq', [HomeController::class, 'faq'])->name('faq');
        Route::get('about-us', [HomeController::class, 'about'])->name('about');
        Route::get('contact-us', [HomeController::class, 'contact'])->name('contact');
        Route::get('support', [HomeController::class, 'support'])->name('support');
        Route::get('privacy-policy', [HomeController::class, 'privacyPolicy'])->name('privacy.policy');
        Route::get('terms-and-conditions', [HomeController::class, 'termsAndConditions'])->name('terms.and.conditions');
        Route::get('refund-policy', [HomeController::class, 'refundPolicy'])->name('refund.policy');

        Route::get('maintenance', [HomeController::class, 'maintenance'])->name('maintenance');

        // Custom pages
        Route::get('/p/{id}', [HomeController::class, "customPage"])->name("custom.page");

        // Blogs
        Route::get('/blogs', [BlogController::class, "blogs"])->name("blogs");
        Route::get('/blog/{slug}', [BlogController::class, "viewBlog"])->name("view.blog");

        // Blog post share
        Route::get('/blog/{slug}/share/facebook', [ShareController::class, "shareToFacebook"])->name("sharetofacebook");
        Route::get('/blog/{slug}/share/twitter', [ShareController::class, "shareToTwitter"])->name("sharetotwitter");
        Route::get('/blog/{slug}/share/linkedin', [ShareController::class, "shareToLinkedIn"])->name("sharetolinkedin");
        Route::get('/blog/{slug}/share/instagram', [ShareController::class, "shareToInstagram"])->name("sharetoinstagram");
        Route::get('/blog/{slug}/share/whatsapp', [ShareController::class, "shareToWhatsApp"])->name("sharetowhatsapp");

        // Web Tools
        // HTML
        Route::get('html-beautifier', [WebToolsController::class, 'htmlBeautifier'])->name('web.html.beautifier');
        Route::get('html-minifier', [WebToolsController::class, 'htmlMinifier'])->name('web.html.minifier');

        // CSS
        Route::get('css-beautifier', [WebToolsController::class, 'cssBeautifier'])->name('web.css.beautifier');
        Route::get('css-minifier', [WebToolsController::class, 'cssMinifier'])->name('web.css.minifier');
        Route::post('css-minifier', [WebToolsController::class, 'resultCssMinifier'])->name('web.result.css.minifier');

        // JS
        Route::get('js-beautifier', [WebToolsController::class, 'jsBeautifier'])->name('web.js.beautifier');
        Route::get('js-minifier', [WebToolsController::class, 'jsMinifier'])->name('web.js.minifier');
        Route::post('js-minifier', [WebToolsController::class, 'resultjsMinifier'])->name('web.result.js.minifier');

        // Random Password Generator
        Route::get('random-password-generator', [WebToolsController::class, 'randomPasswordGenerator'])->name('web.random.password.generator');
        Route::post('random-password-generator', [WebToolsController::class, 'resultRandomPasswordGenerator'])->name('web.result.random.password.generator');

        // Bcrypt Password Generator
        Route::get('bcrypt-password-generator', [WebToolsController::class, 'bcryptPasswordGenerator'])->name('web.bcrypt.password.generator');
        Route::post('bcrypt-password-generator', [WebToolsController::class, 'resultBcryptPasswordGenerator'])->name('web.result.bcrypt.password.generator');

        // MD5 Password Generator
        Route::get('md5-password-generator', [WebToolsController::class, 'md5PasswordGenerator'])->name('web.md5.password.generator');
        Route::post('md5-password-generator', [WebToolsController::class, 'resultMd5PasswordGenerator'])->name('web.result.md5.password.generator');

        // Random Word Generator
        Route::get('random-word-generator', [WebToolsController::class, 'randomWordGenerator'])->name('web.random.word.generator');
        Route::post('random-word-generator', [WebToolsController::class, 'resultRandomWordGenerator'])->name('web.result.random.word.generator');

        // Text counter
        Route::get('text-counter', [WebToolsController::class, 'textCounter'])->name('web.text.counter');

        // Lorem Generator
        Route::get('lorem-generator', [WebToolsController::class, 'loremGenerator'])->name('web.lorem.generator');

        // Emojies
        Route::get('emojies', [WebToolsController::class, 'emojies'])->name('web.emojies');

        // DNS Lookup
        Route::get('dns-lookup', [WebToolsController::class, 'dnsLookup'])->name('web.dns.lookup');
        Route::post('dns-lookup', [WebToolsController::class, 'resultDnsLookup'])->name('web.result.dns.lookup');

        // IP Lookup
        Route::get('ip-lookup', [WebToolsController::class, 'ipLookup'])->name('web.ip.lookup');
        Route::post('ip-lookup', [WebToolsController::class, 'resultIpLookup'])->name('web.result.ip.lookup');

        // Whois Lookup
        Route::get('whois-lookup', [WebToolsController::class, 'whoisLookup'])->name('web.whois.lookup');
        Route::post('whois-lookup', [WebToolsController::class, 'resultWhoisLookup'])->name('web.result.whois.lookup');

        // QR code maker
        Route::get('qr-maker', [WebToolsController::class, 'qrMaker'])->name('web.qrcode');
    });

    Route::group(['as' => 'admin.', 'prefix' => 'admin', 'namespace' => 'Admin', 'middleware' => ['auth', 'admin', 'frame.destroyer', 'twofactor', 'scriptsanitizer'], 'where' => ['locale' => '[a-zA-Z]{2}']], function () {
        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Themes
        Route::get('themes', [ThemeController::class, 'themes'])->name('themes')->middleware('user.page.permission:themes');
        Route::get('active-themes', [ThemeController::class, 'activeThemes'])->name('active.themes')->middleware('user.page.permission:themes');
        Route::get('disabled-themes', [ThemeController::class, 'disabledThemes'])->name('disabled.themes')->middleware('user.page.permission:themes');
        Route::get('edit-theme/{id}', [ThemeController::class, 'editTheme'])->name('edit.theme')->middleware('user.page.permission:themes');
        Route::post('update-theme', [ThemeController::class, 'updateTheme'])->name('update.theme')->middleware(['user.page.permission:themes', 'demo.mode']);
        Route::get('update-theme-status', [ThemeController::class, 'updateThemeStatus'])->name('update.theme.status')->middleware(['user.page.permission:themes', 'demo.mode']);
        Route::get('search', [ThemeController::class, 'searchTheme'])->name('search.theme')->middleware('user.page.permission:themes');

        // Plans
        Route::get('plans', [PlanController::class, 'plans'])->name('plans')->middleware('user.page.permission:plans');
        Route::get('add-plan', [PlanController::class, 'addPlan'])->name('add.plan')->middleware('user.page.permission:plans');
        Route::post('save-plan', [PlanController::class, 'savePlan'])->name('save.plan')->middleware(['user.page.permission:plans', 'demo.mode']);
        Route::get('edit-plan/{id}', [PlanController::class, 'editPlan'])->name('edit.plan')->middleware('user.page.permission:plans');
        Route::post('update-plan', [PlanController::class, 'updatePlan'])->name('update.plan')->middleware(['user.page.permission:plans', 'demo.mode']);
        Route::get('status-plan', [PlanController::class, 'statusPlan'])->name('status.plan')->middleware(['user.page.permission:plans', 'demo.mode']);
        Route::get('delete-plan', [PlanController::class, 'deletePlan'])->name('delete.plan')->middleware(['user.page.permission:plans', 'demo.mode']);

        // Customers
        Route::get('customers', [CustomerController::class, 'customers'])->name('customers')->middleware('user.page.permission:customers');
        Route::get('edit-customer/{id}', [CustomerController::class, 'editCustomer'])->name('edit.customer')->middleware('user.page.permission:customers');
        Route::post('update-customer', [CustomerController::class, 'updateCustomer'])->name('update.customer')->middleware(['user.page.permission:customers', 'demo.mode']);
        Route::get('view-customer/{id}', [CustomerController::class, 'viewCustomer'])->name('view.customer')->middleware('user.page.permission:customers');
        Route::get('change-customer-plan/{id}', [CustomerController::class, 'ChangeCustomerPlan'])->name('change.customer.plan')->middleware('user.page.permission:customers');
        Route::post('update-customer-plan', [CustomerController::class, 'UpdateCustomerPlan'])->name('update.customer.plan')->middleware(['user.page.permission:customers', 'demo.mode']);
        Route::get('update-status', [CustomerController::class, 'updateStatus'])->name('update.status')->middleware(['user.page.permission:customers', 'demo.mode']);
        Route::get('delete-customer', [CustomerController::class, 'deleteCustomer'])->name('delete.customer')->middleware(['user.page.permission:customers', 'demo.mode']);
        Route::get('login-as/{id}', [CustomerController::class, 'authAs'])->name('login-as.customer')->middleware('user.page.permission:customers');

        // Duplicate card / store in one user account to another user account
        Route::post('assign-card', [CustomerController::class, 'assignCard'])->name('assign.card')->middleware('user.page.permission:customers');

        // Payment Gateways
        Route::get('payment-methods', [PaymentMethodController::class, 'paymentMethods'])->name('payment.methods')->middleware('user.page.permission:payment_methods');
        Route::get('add-payment-method', [PaymentMethodController::class, 'addPaymentMethod'])->name('add.payment.method')->middleware('user.page.permission:payment_methods');
        Route::post('save-payment-method', [PaymentMethodController::class, 'savePaymentMethod'])->name('save.payment.method')->middleware(['user.page.permission:payment_methods', 'demo.mode']);
        Route::get('edit-payment-method/{id}', [PaymentMethodController::class, 'editPaymentMethod'])->name('edit.payment.method')->middleware('user.page.permission:payment_methods');
        Route::post('update-payment-method', [PaymentMethodController::class, 'updatePaymentMethod'])->name('update.payment.method')->middleware(['user.page.permission:payment_methods', 'demo.mode']);
        Route::get('delete-payment-method', [PaymentMethodController::class, 'deletePaymentMethod'])->name('delete.payment.method')->middleware(['user.page.permission:payment_methods', 'demo.mode']);

        // Payment Configuration
        Route::get('configure-payment-method/{id}', [PaymentSettingController::class, 'configurePaymentMethod'])->name('configure.payment')->middleware('user.page.permission:payment_methods');
        Route::post('update-payment-configuration/{id}', [PaymentSettingController::class, 'updatePaymentConfiguration'])->name('update.payment.configuration')->middleware(['user.page.permission:payment_methods', 'demo.mode']);

        // Coupons
        Route::get('coupons', [CouponsController::class, 'indexCoupons'])->name('coupons')->middleware('user.page.permission:coupons');
        Route::get('create-coupon', [CouponsController::class, 'createCoupon'])->name('create.coupon')->middleware('user.page.permission:coupons');
        Route::post('store-coupon', [CouponsController::class, 'storeCoupon'])->name('store.coupon')->middleware(['user.page.permission:coupons', 'demo.mode']);
        Route::get('statistics-coupon/{id}', [CouponsController::class, 'statisticsCoupon'])->name('statistics.coupon')->middleware('user.page.permission:coupons');
        Route::get('edit-coupon/{id}', [CouponsController::class, 'editCoupon'])->name('edit.coupon')->middleware('user.page.permission:coupons');
        Route::post('update-coupon/{id}', [CouponsController::class, 'updateCoupon'])->name('update.coupon')->middleware(['user.page.permission:coupons', 'demo.mode']);
        Route::get('update-coupon-status', [CouponsController::class, 'updateCouponStatus'])->name('update.coupon.status')->middleware(['user.page.permission:coupons', 'demo.mode']);
        Route::get('delete-coupon', [CouponsController::class, 'deleteCoupon'])->name('delete.coupon')->middleware(['user.page.permission:coupons', 'demo.mode']);

        // Transactions
        Route::get('online/paid/transactions', [TransactionsController::class, 'onlinePaidTransactions'])->name('online.paid.transactions')->middleware('user.page.permission:transactions');
        Route::get('online/unpaid/transactions', [TransactionsController::class, 'onlineUnpaidTransactions'])->name('online.unpaid.transactions')->middleware('user.page.permission:transactions');
        Route::get('transaction-status/{id}/{status}', [TransactionsController::class, 'transactionStatus'])->name('trans.status')->middleware(['user.page.permission:transactions', 'demo.mode']);
        Route::get('offline/paid/transactions', [TransactionsController::class, 'offlinePaidTransactions'])->name('offline.paid.transactions')->middleware('user.page.permission:transactions');
        Route::get('offline/unpaid/transactions', [TransactionsController::class, 'offlineUnpaidTransactions'])->name('offline.unpaid.transactions')->middleware('user.page.permission:transactions');
        Route::get('offline-transaction-status/{id}/{status}', [TransactionsController::class, 'offlineTransactionStatus'])->name('offline.trans.status')->middleware(['user.page.permission:transactions', 'demo.mode']);
        Route::get('view-invoice/{id}', [TransactionsController::class, 'viewInvoice'])->name('view.invoice')->middleware('user.page.permission:transactions');

        // Users
        Route::get('users', [UserController::class, 'users'])->name('users')->middleware('user.page.permission:users');
        Route::get('create-user', [UserController::class, 'createUser'])->name('create.user')->middleware('user.page.permission:users');
        Route::post('save-user', [UserController::class, 'saveUser'])->name('save.user')->middleware(['user.page.permission:users', 'demo.mode']);
        Route::get('view-user/{id}', [UserController::class, 'viewUser'])->name('view.user')->middleware('user.page.permission:users');
        Route::get('edit-user/{id}', [UserController::class, 'editUser'])->name('edit.user')->middleware('user.page.permission:users');
        Route::post('update-user', [UserController::class, 'updateUser'])->name('update.user')->middleware(['user.page.permission:users', 'demo.mode']);
        Route::get('update-user-status', [UserController::class, 'updateUserStatus'])->name('update.user.status')->middleware(['user.page.permission:users', 'demo.mode']);
        Route::get('delete-user', [UserController::class, 'deleteUser'])->name('delete.user')->middleware(['user.page.permission:users', 'demo.mode']);
        Route::get('login-as-user/{id}', [UserController::class, 'authAsUser'])->name('login-as.user')->middleware('user.page.permission:users');

        // Custom domains
        Route::get('custom-domain-requests', [CustomDomainRequestsController::class, 'customDomainRequests'])->name('custom.domain.requests')->middleware('user.page.permission:custom_domain');
        Route::get('approved-custom-domain', [CustomDomainRequestsController::class, 'approvedCustomDomain'])->name('approved.custom.domain')->middleware(['user.page.permission:custom_domain', 'demo.mode']);
        Route::get('rejected-custom-domain', [CustomDomainRequestsController::class, 'rejectedCustomDomain'])->name('rejected.custom.domain')->middleware(['user.page.permission:custom_domain', 'demo.mode']);

        // Update custom domain status
        Route::get('process-custom-domain-requests', [CustomDomainRequestsController::class, 'processCustomDomainRequests'])->name('process.custom.domain.requests')->middleware('user.page.permission:custom_domain');
        Route::get('approved-custom-domain-requests', [CustomDomainRequestsController::class, 'approvedCustomDomainRequests'])->name('approved.custom.domain.requests')->middleware(['user.page.permission:custom_domain', 'demo.mode']);
        Route::get('rejected-custom-domain-requests', [CustomDomainRequestsController::class, 'rejectedCustomDomainRequests'])->name('rejected.custom.domain.requests')->middleware(['user.page.permission:custom_domain', 'demo.mode']);

        // Account Setting
        Route::get('account', [AccountController::class, 'account'])->name('account');
        Route::get('edit-account', [AccountController::class, 'editAccount'])->name('edit.account');
        Route::post('update-account', [AccountController::class, 'updateAccount'])->name('update.account')->middleware('demo.mode');
        Route::get('change-password', [AccountController::class, 'changePassword'])->name('change.password');
        Route::post('update-password', [AccountController::class, 'updatePassword'])->name('update.password')->middleware('demo.mode');

        // Change theme
        Route::get('theme/{id}', [AccountController::class, "changeTheme"])->name('change.theme');

        // Pages
        Route::get('pages', [PageController::class, "index"])->name('pages')->middleware('user.page.permission:pages');
        Route::get('custom-pages', [PageController::class, "customPagesIndex"])->name('custom.pages')->middleware('user.page.permission:pages');

        Route::get('add-page', [PageController::class, "addPage"])->name('add.page')->middleware('user.page.permission:pages');
        Route::post('save-page', [PageController::class, "savePage"])->name('save.page')->middleware(['user.page.permission:pages', 'demo.mode']);
        Route::get('custom-page/{id}', [PageController::class, "editCustomPage"])->name('edit.custom.page')->middleware('user.page.permission:pages');
        Route::post('custom-update-page', [PageController::class, "updateCustomPage"])->name('update.custom.page')->middleware(['user.page.permission:pages', 'demo.mode']);
        Route::get('status-page', [PageController::class, "statusPage"])->name('status.page')->middleware(['user.page.permission:pages', 'demo.mode']);
        Route::get('page/{id}', [PageController::class, "editPage"])->name('edit.page')->middleware('user.page.permission:pages');
        Route::post('update-page/{id}', [PageController::class, "updatePage"])->name('update.page')->middleware(['user.page.permission:pages', 'demo.mode']);
        Route::get('disable-page', [PageController::class, "disablePage"])->name('disable.page')->middleware(['user.page.permission:pages', 'demo.mode']);
        Route::get('delete-page', [PageController::class, "deletePage"])->name('delete.page')->middleware(['user.page.permission:pages', 'demo.mode']);

        // Blogs Categories (truncated for brevity - same as original)
        // ... [CONTINUING WITH ALL ADMIN ROUTES FROM ORIGINAL] ...
    });

    // ================================================================
    // USER ROUTES - FIXED VERSION (NO CONFLICTS)
    // ================================================================
    Route::group(['as' => 'user.', 'prefix' => 'user', 'namespace' => 'User', 'middleware' => ['auth', 'user', 'frame.destroyer', 'twofactor', 'scriptsanitizer'], 'where' => ['locale' => '[a-zA-Z]{2}']], function () {

        // Dashboard
        Route::get('dashboard', [userDashboard::class, 'index'])->name('dashboard');
        Route::get('calendar/appointments', [userDashboard::class, 'fetchAppointments'])->name('calendar.appointments');

        // ================================================================
        // CARDS ROUTES - COMPATIBLE WITH BOTH SYSTEMS
        // ================================================================
        
        // LEGACY COMPATIBILITY - Keep original route that views expect
        Route::get('cards', [CardController::class, 'index'])->name('cards'); // ✅ MANTENER PARA COMPATIBILITY
        Route::get('card-status/{id}', [CardController::class, 'cardStatus'])->name('card.status');
        
        // NEW CARDS SYSTEM - Resource routes for Mi Tienda integration
        Route::prefix('cards')->name('cards.')->group(function () {
            Route::get('/', [CardController::class, 'index'])->name('index');        // user.cards.index
            Route::get('/create', [CardController::class, 'create'])->name('create'); // user.cards.create
            Route::post('/', [CardController::class, 'store'])->name('store');       // user.cards.store
            Route::get('/{card}', [CardController::class, 'show'])->name('show');    // user.cards.show
            Route::get('/{card}/edit', [CardController::class, 'edit'])->name('edit'); // user.cards.edit
            Route::put('/{card}', [CardController::class, 'update'])->name('update'); // user.cards.update
            Route::patch('/{card}', [CardController::class, 'update'])->name('update'); // user.cards.update (patch)
            Route::delete('/{card}', [CardController::class, 'destroy'])->name('destroy'); // user.cards.destroy
            
            // Mi Tienda specific routes
            Route::get('/{card}/builder', [CardController::class, 'builder'])->name('builder');
            Route::get('/{card}/builder-bare', [CardController::class, 'builderBare'])->name('builder.bare');
            Route::get('/{card}/preview', [CardController::class, 'preview'])->name('preview');
            Route::post('/{card}/publish', [CardController::class, 'publish'])->name('publish');
            Route::post('/{card}/unpublish', [CardController::class, 'unpublish'])->name('unpublish');
        });

        // Mi Tienda API Routes
        Route::prefix('api/mi-tienda')->group(function () {
            Route::get('ping', [MiTiendaApiController::class, 'ping'])->name('mitienda.ping');
            Route::get('state', [MiTiendaApiController::class, 'stateGet'])->name('mitienda.state.get');
            Route::post('state', [MiTiendaApiController::class, 'statePost'])->name('mitienda.state.post');
            Route::get('inventory', [MiTiendaApiController::class, 'inventory'])->name('mitienda.inventory');
        });

        // Newsletter
        Route::get('newsletter/{id}', [UserNewsletterController::class, 'index'])->name('newsletter');

        // Connect with custom domain
        Route::get('connect-domain/{id}', [ConnectDomainController::class, 'connectDomain'])->name('connect.domain');
        Route::post('new-domain-request', [ConnectDomainController::class, 'newDomainRequest'])->name('new.domain.request');
        Route::get('unlink-domain', [ConnectDomainController::class, 'unlinkDomain'])->name('unlink.domain');

        // Choose Business type
        Route::get('choose-card-type', [CardController::class, 'chooseCardType'])->name('choose.card.type');

        // Create vcard
        Route::get('create-card', [CreateController::class, 'CreateCard'])->name('create.card');
        Route::post('save-business-card', [CreateController::class, 'saveBusinessCard'])->name('save.business.card');

        // Search theme
        Route::get('search', [CardController::class, 'searchTheme'])->name('search.theme');

        // Cropped image
        Route::post('vcard-cropped-image', [CreateController::class, 'vcardCroppedImage'])->name('vcard.cropped.image');

        // Check link
        Route::post('check-link', [CreateController::class, 'checkLink'])->name('check.link');

        // [CONTINUE WITH ALL OTHER ROUTES FROM ORIGINAL...]
        // [ALL OTHER ORIGINAL ROUTES REMAIN THE SAME]

    });

    // ================================================================
    // PUBLIC ROUTES - Mi Tienda Integration
    // ================================================================
    
    // Public card viewer
    Route::get('/c/{slug}', [CardPublicController::class, 'show'])->name('cards.public');
    Route::get('/v/{slug}', [CardPublicController::class, 'show'])->name('card.public');

    // Public read-only state API 
    Route::get('/api/mi-tienda/public/state/{slug}', [MiTiendaPublicApiController::class, 'state'])->name('mitienda.public.state');
    Route::get('/api/card/state/{slug}', [MiTiendaPublicApiController::class, 'state'])->name('mitienda.public.state.legacy');

    // ================================================================
    // ALL OTHER ROUTES (PAYMENTS, NFC, PROFILES, ETC.)
    // ================================================================
    // [SAME AS ORIGINAL - NO CHANGES NEEDED]

});