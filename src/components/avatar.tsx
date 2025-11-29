"use client";

import Image from "next/image";
import { useState } from "react";
import type { AvatarProps } from "@/lib/definitions";

export default function Avatar({ src, alt, fullName, username }: AvatarProps) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        className="relative block w-12 h-12"
      >
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className="rounded-full"
          unoptimized
        />
      </button>

      {showPopover && (
        <div className="absolute z-10 w-64 p-4 mt-2 bg-white rounded-lg shadow-lg left-0">
          <div className="flex items-center">
            <div className="relative block w-16 h-16">
              <Image
                src={src}
                alt={alt}
                width={100}
                height={100}
                className="rounded-full"
                unoptimized
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {fullName}
              </h3>
              <p className="text-sm text-gray-600">@{username}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
