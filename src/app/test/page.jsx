import Image from 'next/image';
import React from 'react';

const page = () => {
    return (
        <div className='w-full h-screen'>
           <Image fill placeholder='blur' quality={100} blurDataURL='/WhatsApp Image 2026-05-11 at 1.26.51 PM.jpeg' src="/WhatsApp Image 2026-05-11 at 1.26.51 PM.jpeg" alt="" />
           {/* <img src="/WhatsApp Image 2026-05-11 at 1.26.51 PM.jpeg" alt="" /> */}
        </div>
    );
};

export default page;