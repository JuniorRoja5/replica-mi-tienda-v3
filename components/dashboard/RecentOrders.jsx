
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ShoppingBag, Mail } from "lucide-react";
import { useLanguage } from "../LanguageProvider";

export default function RecentOrders({ orders }) {
  const { t } = useLanguage();

  if (orders.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {t('recentOrders')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <p className="text-purple-200">{t('noOrdersYet')}</p>
            <p className="text-purple-300 text-sm">{t('firstSale')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          {t('recentOrders')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{order.customer_name}</p>
                  <p className="text-purple-200 text-sm">{order.customer_email}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-white">${order.amount.toFixed(2)}</p>
                <p className="text-purple-300 text-xs">
                  {format(new Date(order.created_date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
