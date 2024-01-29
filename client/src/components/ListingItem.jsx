/* eslint-disable react/prop-types */

import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md"

export default function ListingItem({listing}) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img 
          src={listing.imageURLs[0]} 
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scal105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">{listing.name}</p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-gray-700" />
            <p className="text-sm text-gray-600 truncate w-full">{listing.address}</p>
          </div>
          {/* to truncate text with two lines you don't have a class inside taiwind to truncate text in one line so you could install line clamp so you go to -@tailwindcss/line-clamp-*/}
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            {listing.offer
              ? Number(listing.discountedPrice).toLocaleString('en-US')
              : Number(listing.regularPrice).toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs"> 
              {listing.bedRooms > 1 ? `${listing.bedRooms} beds` : `${listing.bedRooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathRooms > 1 ? `${listing.bathRooms} bathes` : `${listing.bathRooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

