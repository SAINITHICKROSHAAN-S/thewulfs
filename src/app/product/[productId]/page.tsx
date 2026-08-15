'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { mockProducts } from '@/data/mock-data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCart } from '@/context/cart-context';
import { Heart } from 'lucide-react';
import { useWishlist } from "@/context/WishListContext";
import { FlyoutCart } from '@/components/FlyoutCart'; 

// --- SCOPE & TYPE DEFINITIONS (Unchanged, kept for completeness) ---
const reviewsInitial = [
  { id: 1, author: 'Lone Wolf', rating: 5, date: '2 days ago', comment: 'Absolutely love this hoodie! The quality is amazing and it fits perfectly. Worth every penny.' },
  { id: 2, author: 'Alpha_M', rating: 4, date: '1 week ago', comment: 'Great material, very comfortable. A little bit snug around the shoulders, but still looks good.' },
  { id: 3, author: 'Urban_Wulf', rating: 5, date: '3 weeks ago', comment: 'The design is incredible. It really captures the essence of the brand. Highly recommend!' },
];
const mockReviewPhotos = [
  { id: 1, imageUrl: 'https://placehold.co/800x800/1E202B/FFFFFF?text=Pack+in+Action+1' },
  { id: 2, imageUrl: 'https://placehold.co/800x800/262626/FFFFFF?text=Pack+in+Action+2' },
  { id: 3, imageUrl: 'https://placehold.co/800x800/374151/FFFFFF?text=Pack+in+Action+3' },
];
const colorMap: Record<string, string> = {
  Black: '#000000',
  White: '#FFFFFF',
  Red: '#FF0000',
  Gray: '#808080'
};
interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}
const getStarRating = (rating: number) => {
  const fullStars = '★'.repeat(rating);
  const emptyStars = '☆'.repeat(5 - rating);
  return <div className="text-yellow-400">{fullStars}{emptyStars}</div>;
};
// ------------------------------------

export default function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const unwrappedParams = use(params);
  const productId = parseInt(unwrappedParams.productId);
  const product = mockProducts.find((p) => p.id === productId);
  
  // FIX: Only destructure exposed functions. Removed 'setCartItems' (it's not used now)
  const { addToCart, isCartOpen, setIsCartOpen } = useCart(); 
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>(reviewsInitial as Review[]);
  const [newReview, setNewReview] = useState({ author: '', rating: 0, comment: '' });
  const [error, setError] = useState('');
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!product) notFound();

  const handleSizeSelect = (size: string) => setSelectedSize(size);
  const handleColorSelect = (color: string) => setSelectedColor(color);

  const productIDString = product.id.toString();
  const isProductInWishlist = isInWishlist(productIDString); 
  
  // 1. Utility function to create the item object
  const createCartItem = (quantity: number = 1) => {
    // Price fix: stores dollar value (e.g., "65.00")
    const rawPrice = typeof product.price === 'string' 
      ? parseFloat(product.price.replace('$', '')) 
      : product.price;
    const priceAsString = rawPrice.toFixed(2).toString(); 

    return {
      id: product.id.toString(),
      name: product.name,
      price: priceAsString, 
      imageUrl: typeof product.imageUrl === 'string' ? product.imageUrl : '',
      size: selectedSize!, 
      color: selectedColor!, 
      quantity: quantity,
    };
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.comment || newReview.rating === 0) {
      setError('Please fill out all fields and select a rating.');
      return;
    }
    const newEntry: Review = {
      id: reviews.length + 1,
      author: newReview.author,
      rating: newReview.rating,
      comment: newReview.comment,
      date: 'Just now'
    };
    setReviews([newEntry, ...reviews]);
    setNewReview({ author: '', rating: 0, comment: '' });
    setError('');
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setShowSizeAlert(true);
      setTimeout(() => setShowSizeAlert(false), 2000);
      return;
    }
    const itemToAdd = createCartItem();
    addToCart(itemToAdd);
  };

  // 🔑 FINAL BUY NOW FIX: Instant Checkout Logic (URL Parameter Method)
  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      setShowSizeAlert(true);
      setTimeout(() => setShowSizeAlert(false), 2000);
      return;
    }
    
    // Create the item data needed for checkout
    const itemToBuy = createCartItem();
    
    // 🛑 CRITICAL: Encode ONLY the single item's details into the URL.
    // The Checkout page will read these parameters and ignore the main cart.
    const checkoutQuery = new URLSearchParams({
        id: itemToBuy.id,
        name: itemToBuy.name,
        price: itemToBuy.price,
        size: itemToBuy.size,
        color: itemToBuy.color,
        imageUrl: itemToBuy.imageUrl, // Pass image URL too for a complete checkout summary
        instantBuy: 'true' // Flag for the Checkout page
    }).toString();

    // Close the flyout cart and redirect immediately to checkout with the query
    setIsCartOpen(false);
    router.push(`/checkout?${checkoutQuery}`);
  };

  const relatedProducts = mockProducts.filter((p) => p.id !== product.id);
  
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />

      <div className={`${isCartOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="h-24" />

        <main className="container mx-auto px-4 py-12 md:py-20">
          {/* Size/Color Alert */}
          <div className={`fixed top-20 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-2xl transition-all duration-300 transform ${showSizeAlert ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} bg-red-700 text-white font-bold z-50`}>
            <p>Please select size and color first.</p>
          </div>

          {/* Product Details Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Product Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-500 shadow-2xl">
              {product?.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-3xl" unoptimized />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center rounded-3xl">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl md:text-5xl font-anton uppercase font-extrabold mb-2 flex items-center justify-start gap-39">
                  <span>{product.name}</span>
                  {hydrated && (
                    <button
                      onClick={() => isProductInWishlist ? removeFromWishlist(productIDString) : addToWishlist(productIDString)} 
                      className="heart-icon ml-6 inline-flex items-center justify-center w-12 h-12 bg-transparent transition-all duration-300"
                      aria-label="Toggle wishlist"
                    >
                      <Heart
                        size={34}
                        strokeWidth={1.5}
                        // FINAL STYLING FIX: Use the CSS class 'filled' based on your global styles.
                        className={`transition-colors duration-300 ${isProductInWishlist ? 'filled' : ''}`}
                      />
                    </button>
                  )}
                </h1>
              </div>

              <p className="text-3xl font-oswald text-red-600 mb-6">{product.price}</p>
              <p className="text-lg font-inter text-gray-400 mb-8 leading-relaxed">
                This is the official streetwear hoodie from The Wulfs' debut Blood Moon Drop. Crafted for comfort and style, this piece embodies the untamed spirit of the pack. Made with premium, heavy-weight cotton.
              </p>

              {/* Size Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-montserrat font-bold uppercase mb-3 tracking-wide">
                  Size: <span className="text-gray-400 font-normal">{selectedSize || 'Select a size'}</span>
                </h3>
                <div className="flex space-x-3">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      className={`h-12 w-12 rounded-full font-montserrat border-gray-700 text-white transition-colors duration-300 ${selectedSize === size ? 'bg-red-600 text-white border-red-600' : 'bg-gray-900 border-white hover:bg-white hover:text-black'}`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Link href="/product/size-chart" className="mb-6 text-sm text-red-600 font-montserrat no-underline hover:text-white transition-colors">
                Size Chart
              </Link>

              {/* Color Selector */}
              <div className="mb-10">
                <h3 className="text-lg font-montserrat font-bold uppercase mb-3 tracking-wide">
                  Color: <span className="text-gray-400 font-normal">{selectedColor || 'Select a color'}</span>
                </h3>
                <div className="flex space-x-3">
                  {Object.keys(colorMap).map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${selectedColor === color ? 'ring-2 ring-red-600' : ''}`}
                      style={{ backgroundColor: colorMap[color], color: color === 'White' ? '#000' : '#FFF' }}
                      onClick={() => handleColorSelect(color)}
                    >
                      {color[0]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Add to Cart & Buy Now */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
                <Button onClick={handleAddToCart} className="flex-1 h-14 bg-red-600 hover:bg-red-700 text-white font-montserrat text-lg font-bold uppercase transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
                  Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="flex-1 h-14 border border-white text-white hover:bg-white hover:text-black font-montserrat text-lg font-bold uppercase transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
                  Buy Now
                </Button>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <Separator className="my-16 bg-gray-700" />
          <section>
            <h2 className="text-3xl font-anton uppercase font-extrabold mb-6">Reviews ({reviews.length})</h2>
            <Carousel className="w-full max-w-3xl mx-auto">
              <CarouselContent>
                {reviews.map((review: Review) => (
                  <CarouselItem key={review.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="p-6 rounded-lg border border-gray-800 bg-gray-900 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-oswald font-semibold">{review.author}</span>
                          {getStarRating(review.rating)}
                        </div>
                        <p className="text-sm font-inter text-gray-400 mb-2">{review.comment}</p>
                      </div>
                      <p className="text-xs font-montserrat text-gray-500">{review.date}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

          {/* Add Review Form */}
          <section className="my-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-anton uppercase font-extrabold mb-4">Leave a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm font-montserrat">{error}</p>}
                <Input type="text" placeholder="Your Name" className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 font-montserrat" value={newReview.author} onChange={(e) => setNewReview({ ...newReview, author: e.target.value })} />
                <Textarea placeholder="Your review..." className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 font-montserrat min-h-[100px]" value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} />
                <div className="flex items-center space-x-4">
                  <h4 className="text-lg font-montserrat font-bold">Rating:</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-3xl cursor-pointer transition-colors duration-200 ${newReview.rating >= star ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400"}`} onClick={() => setNewReview({ ...newReview, rating: star })}>★</span>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-montserrat text-lg font-bold uppercase transition-all duration-300">Submit Review</Button>
              </form>
            </div>
          </section>

          {/* Pack in Action Section */}
          <Separator className="my-16 bg-gray-700" />
          <section>
            <h2 className="text-3xl font-anton uppercase font-extrabold mb-8 text-center">Pack in Action</h2>
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent>
                {mockReviewPhotos.map((photo: { id: number; imageUrl: string }) => (
                  <CarouselItem key={photo.id} className="basis-full sm:basis-1/2 md:basis-1/3">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image src={photo.imageUrl} alt={`Review photo ${photo.id}`} fill className="object-cover" unoptimized />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

          {/* Related Products Section */}
          <Separator className="my-16 bg-gray-700" />
          <section>
            <h2 className="text-3xl font-anton uppercase font-extrabold mb-8 text-center">You Might Also Like</h2>
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent>
                {relatedProducts.map((related) => (
                  <CarouselItem key={related.id} className="basis-2/3 sm:basis-1/3 md:basis-1/4">
                    <Link href={`/product/${related.id}`} className="block">
                      <div className="group relative rounded-xl border border-gray-700 bg-gray-900 shadow-lg hover:shadow-2xl hover:border-red-600 transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 h-full flex flex-col scale-95 hover:scale-100">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
                          {related.imageUrl ? (
                            <Image src={related.imageUrl as string} alt={related.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex flex-col items-center flex-1">
                          <h3 className="text-base font-oswald font-semibold uppercase text-white mb-1">{related.name}</h3>
                          <p className="text-sm font-inter text-gray-400 mb-2">{related.price}</p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>

        </main>
      </div>
      
      <Footer />
      <FlyoutCart />
    </div>
  );
}