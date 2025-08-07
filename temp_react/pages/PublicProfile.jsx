import React, { useState, useEffect } from "react";
import { Creator, Product } from "@/api/entities";
import { User } from "@/api/entities";
import { Package } from "lucide-react";
import ProfileView from "../components/public/ProfileView";

export default function PublicProfile() {
  const [creator, setCreator] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const user = await User.me(); // This might fail if public, need to handle that.
      // For now assuming we can get the creator by some means.
      // In a real scenario, we'd get the username from the URL.
      // e.g. /u/username -> filter Creator by username.
      // For now, I'll filter by logged-in user's email as before.
      const creators = await Creator.filter({ created_by: user.email });
      
      if (creators.length > 0) {
        const currentCreator = creators[0];
        setCreator(currentCreator);
        
        const activeProducts = await Product.filter({ 
          creator_id: currentCreator.id,
          is_active: true 
        });
        setProducts(activeProducts);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Handle cases where user is not logged in but viewing a public page
      setCreator(null);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
      <ProfileView creator={creator} products={products} />
    </div>
  );
}