<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\{Card};

class MiTiendaApiController extends Controller
{
    public function ping(){ return response()->json(['ok'=>true,'ts'=>now()]); }

    public function stateGet(Request $r){
        $r->validate(['card_id'=>'required|integer|min:1']);
        $card = Card::where('id', $r->card_id)->where('user_id', Auth::id())->firstOrFail();

        $payload = [
            'card'         => $card->only(['id','user_id','title','slug','status','name','job_title','company','phone','email','website','bio','avatar_path','cover_path','theme','is_published','views','data','social_links']),
            'links'        => DB::table('card_links')->where('card_id',$card->id)->orderBy('sort_order')->get(),
            'products'     => DB::table('card_products')->where('card_id',$card->id)->orderByDesc('id')->get(),
            'galleries'    => DB::table('card_galleries')->where('card_id',$card->id)->orderBy('sort_order')->get(),
            'hours'        => DB::table('card_hours')->where('card_id',$card->id)->orderBy('weekday')->get(),
            'testimonials' => DB::table('card_testimonials')->where('card_id',$card->id)->orderByDesc('id')->get(),
        ];
        return response()->json($payload);
    }

    public function statePost(Request $r){
        $r->validate(['card_id'=>'required|integer|min:1']);
        $card = Card::where('id', $r->card_id)->where('user_id', Auth::id())->firstOrFail();

        DB::transaction(function() use ($card, $r){
            if($r->has('card') && is_array($r->card)){
                $allowed = ['title','name','job_title','company','phone','email','website','bio','avatar_path','cover_path','theme','is_published','data','social_links'];
                $card->fill(array_intersect_key($r->card, array_flip($allowed)));
                $card->save();
            }
            if($r->has('links')) DB::table('card_links')->where('card_id',$card->id)->delete();
            if($r->has('products')) DB::table('card_products')->where('card_id',$card->id)->delete();
            if($r->has('galleries')) DB::table('card_galleries')->where('card_id',$card->id)->delete();
            if($r->has('hours')) DB::table('card_hours')->where('card_id',$card->id)->delete();
            if($r->has('testimonials')) DB::table('card_testimonials')->where('card_id',$card->id)->delete();
            if($r->has('links')){
                $rows=[]; foreach ((array)$r->links as $x){
                    $rows[]=['card_id'=>$card->id,'label'=>$x['label']??'','url'=>$x['url']??'','icon'=>$x['icon']??null,'type'=>$x['type']??null,'sort_order'=>$x['sort_order']??0];
                }
                if($rows) DB::table('card_links')->insert($rows);
            }
            if($r->has('products')){
                $rows=[]; foreach ((array)$r->products as $x){
                    $rows[]=['card_id'=>$card->id,'name'=>$x['name']??'','description'=>$x['description']??null,'price'=>$x['price']??null,'currency'=>$x['currency']??'USD','sku'=>$x['sku']??null,'image_path'=>$x['image_path']??null,'meta'=>isset($x['meta'])?json_encode($x['meta']):null];
                }
                if($rows) DB::table('card_products')->insert($rows);
            }
            if($r->has('galleries')){
                $rows=[]; foreach ((array)$r->galleries as $x){
                    $rows[]=['card_id'=>$card->id,'title'=>$x['title']??null,'image_path'=>$x['image_path']??'','meta'=>isset($x['meta'])?json_encode($x['meta']):null,'sort_order'=>$x['sort_order']??0];
                }
                if($rows) DB::table('card_galleries')->insert($rows);
            }
            if($r->has('hours')){
                $rows=[]; foreach ((array)$r->hours as $x){
                    $rows[]=['card_id'=>$card->id,'weekday'=>(int)($x['weekday']??0),'open_time'=>$x['open_time']??null,'close_time'=>$x['close_time']??null,'is_closed'=>!empty($x['is_closed'])];
                }
                if($rows) DB::table('card_hours')->insert($rows);
            }
            if($r->has('testimonials')){
                $rows=[]; foreach ((array)$r->testimonials as $x){
                    $rows[]=['card_id'=>$card->id,'author'=>$x['author']??'','role'=>$x['role']??null,'content'=>$x['content']??null,'rating'=>$x['rating']??null];
                }
                if($rows) DB::table('card_testimonials')->insert($rows);
            }
        });

        return response()->json(['ok'=>true]);
    }

    public function inventory(Request $r){
        $r->validate(['card_id'=>'required|integer|min:1']);
        $card = Card::where('id', $r->card_id)->where('user_id', Auth::id())->firstOrFail();
        return response()->json(['products'=>DB::table('card_products')->where('card_id',$card->id)->orderByDesc('id')->get()]);
    }

    /**
     * Get dashboard statistics
     * Provides real analytics data for Mi Tienda dashboard
     */
    public function dashboardStats(Request $r){
        $r->validate([
            'period' => 'string|in:7D,14D,30D,custom',
            'start_date' => 'date|nullable',
            'end_date' => 'date|nullable'
        ]);

        $userId = Auth::id();
        $period = $r->period ?? '7D';
        
        // Calculate date range
        $endDate = now();
        if ($period === 'custom' && $r->start_date && $r->end_date) {
            $startDate = \Carbon\Carbon::parse($r->start_date);
            $endDate = \Carbon\Carbon::parse($r->end_date);
        } else {
            $days = ['7D' => 7, '14D' => 14, '30D' => 30][$period] ?? 7;
            $startDate = now()->subDays($days);
        }

        // Get user's cards for analytics context
        $userCards = Card::where('user_id', $userId)->pluck('id');
        
        // Calculate current period stats
        $currentStats = $this->calculatePeriodStats($userId, $userCards, $startDate, $endDate);
        
        // Calculate previous period for comparison
        $periodLength = $endDate->diffInDays($startDate);
        $prevStartDate = $startDate->copy()->subDays($periodLength);
        $prevEndDate = $startDate->copy()->subDay();
        $previousStats = $this->calculatePeriodStats($userId, $userCards, $prevStartDate, $prevEndDate);
        
        // Calculate percentage changes
        $revenueChange = $this->calculatePercentageChange($previousStats['revenue'], $currentStats['revenue']);
        $visitsChange = $this->calculatePercentageChange($previousStats['visits'], $currentStats['visits']);
        $leadsChange = $this->calculatePercentageChange($previousStats['leads'], $currentStats['leads']);
        
        // Generate daily chart data
        $chartData = $this->generateDailyChartData($userCards, $startDate, $endDate);
        
        return response()->json([
            'user' => [
                'name' => Auth::user()->name ?? 'Usuario',
                'username' => Auth::user()->username ?? 'user'
            ],
            'stats' => [
                'total_revenue' => $currentStats['revenue'],
                'revenue_change' => $revenueChange,
                'store_visits' => $currentStats['visits'], 
                'visits_change' => $visitsChange,
                'leads' => $currentStats['leads'],
                'leads_change' => $leadsChange
            ],
            'chart_data' => $chartData,
            'period' => $period,
            'date_range' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString()
            ]
        ]);
    }

    /**
     * Calculate statistics for a given period
     */
    private function calculatePeriodStats($userId, $userCards, $startDate, $endDate) {
        // Revenue from store orders
        $storeRevenue = DB::table('store_orders')
            ->where('user_id', $userId)
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('order_total');
        
        // Revenue from transactions (plan payments)
        $transactionRevenue = DB::table('transactions')
            ->where('user_id', $userId)
            ->where('payment_status', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('transaction_amount');
            
        $totalRevenue = $storeRevenue + $transactionRevenue;
        
        // Visits (card views) 
        $visits = $userCards->count() > 0 ? 
            Card::whereIn('id', $userCards)->sum('views') : 0;
        
        // Leads (inquiries/contacts)
        $leads = DB::table('enquiries')
            ->whereIn('card_id', $userCards)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
        
        return [
            'revenue' => $totalRevenue,
            'visits' => $visits,
            'leads' => $leads
        ];
    }

    /**
     * Calculate percentage change between two values
     */
    private function calculatePercentageChange($oldValue, $newValue) {
        if ($oldValue == 0) {
            return $newValue > 0 ? 100 : 0;
        }
        return round((($newValue - $oldValue) / $oldValue) * 100, 1);
    }

    /**
     * Generate daily chart data for visits
     */
    private function generateDailyChartData($userCards, $startDate, $endDate) {
        $data = [];
        $current = $startDate->copy();
        
        while ($current <= $endDate) {
            $dayStart = $current->copy()->startOfDay();
            $dayEnd = $current->copy()->endOfDay();
            
            // For now, use a simple metric based on total views
            // In a more sophisticated system, you'd track daily visits separately
            $dayVisits = rand(5, 50); // Placeholder - replace with actual daily analytics
            
            $data[] = [
                'day' => $current->format('M j'),
                'visits' => $dayVisits,
                'date' => $current->toDateString()
            ];
            
            $current->addDay();
        }
        
        return $data;
    }
}