"use client"
import { AuthContext } from '@/context/AuthContext';
import Payments from '@/shared/Payments';
import React, { useContext } from 'react';

const page = () => {

    const { user } = useContext(AuthContext)


    if (user?.role === "manager") {
        return <div className='h-screen flex items-center justify-center flex-col gap-5 mx-auto '>
            <img className='w-100' src="/no-permission.png" alt="" />
            <p>You Dont have Permission To View This Page</p>
        </div>
    }
    return (
        <div>
            <Payments />
        </div>
    );
};

export default page;