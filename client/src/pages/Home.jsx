import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import {Navigation} from 'swiper/modules'
import SwiperCore from 'swiper';
import ListingItem from '../components/ListingItem'

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use(Navigation);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/v1/listing?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings(); // so until the result is not clear and response didn't come, we don't fetch the data for the rent, so this is going to be step by step. so the page is loaded more nicer
      } catch (err) {
        console.log(err);
      }
    }

    const fetchRentListings = async () => {      
      try {
        const res = await fetch(`api/v1/listing?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (err) {
        console.log(err);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`api/v1/listing?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (err) {
        console.log(err);
      } 
    }
    
    fetchOfferListings();
  }, [])
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next 
          <span className='text-slate-500'> perfect</span> 
          <br />  
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Sahand Estate is the best place to find your next perfect place to live.
          <br />
          we have a wide range of properties to choose from.
        </div>
        <Link className='text-xs text-blue-800 font-bold hover:underline'>
          Let's get started
        </Link>
      </div>

      {/* swiper */}
      <Swiper>
        {
          offerListings && offerListings.length > 0 && offerListings.map((listing) => (
            <SwiperSlide key={listing.imageURLs}>
              <div 
                style={{
                  background: `url(${listing.imageURLs[0]}) center no-repeat`,
                  backgroundSize: 'cover'
                }} 
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))
        }
      </Swiper>


      {/* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2 font-semibold text-slate-600'>Recent Offer</h2>
              <Link 
                to={'/search?offer=true'}
                className='text-sm text-blue-800 hover:underline'
              >
                Show more offer
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}              
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2 font-semibold text-slate-600'>Recent places for rent</h2>
              <Link 
                to={'/search?type=rent'}
                className='text-sm text-blue-800 hover:underline'
              >
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2 font-semibold text-slate-600'>Recent places for sale</h2>
              <Link 
                to={'/search?type=sale'}
                className='text-sm text-blue-800 hover:underline'
              >
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>

      </div>
  )
}
